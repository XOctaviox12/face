import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
// 1. IMPORTAMOS LA REALTIME DATABASE PARA LAS MONEDAS
import { Database, ref, get, set } from '@angular/fire/database';
import { Observable, of, combineLatest, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private db: Database // 2. INYECTAMOS LA DATABASE
  ) {}

  // --- WRAPPERS (Se quedan igual) ---
  public getCollectionData(path: string): Observable<any[]> {
    const ref = collection(this.firestore, path);
    return collectionData(ref, { idField: 'id' });
  }
  public async getDocSnapshot(path: string) {
    const ref = doc(this.firestore, path);
    return getDoc(ref);
  }
  public async setDocument(path: string, data: any) {
    const ref = doc(this.firestore, path);
    return setDoc(ref, data);
  }
  public async updateDocument(path: string, data: any) {
    const ref = doc(this.firestore, path);
    return updateDoc(ref, data);
  }
  public async deleteDocument(path: string) {
    const ref = doc(this.firestore, path);
    return deleteDoc(ref);
  }

  // --- PRODUCTOS ---
  getProductos(): Observable<any[]> {
    console.log('Consultando productos...');
    return this.getCollectionData('productos');
  }

  getProducto(productoId: string): Observable<any> {
    return new Observable(observer => {
      this.getDocSnapshot(`productos/${productoId}`).then(snapshot => {
        if (snapshot.exists()) {
          observer.next({ id: snapshot.id, ...snapshot.data() });
        } else {
          observer.next(null);
        }
        observer.complete();
      }).catch(error => observer.error(error));
    });
  }

  // --- CARRITO (Con authState para esperar al usuario) ---
  getCarrito(): Observable<any[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        return this.getCollectionData(`usuarios/${user.uid}/carrito`).pipe(
          switchMap((carritoItems: any[]) => {
            if (carritoItems.length === 0) return of([]);
            const productosObservables = carritoItems.map(item =>
              this.getProducto(item.productoId).pipe(
                map(producto => ({
                  ...item,
                  producto: producto || { nombre: 'Producto no disponible', precio: 0, imagen: this.getImagenPorDefecto() }
                }))
              )
            );
            return combineLatest(productosObservables);
          })
        );
      })
    );
  }

  // --- GESTIÓN DEL CARRITO ---
  async agregarAlCarrito(productoId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    const producto = await this.getDocSnapshot(`productos/${productoId}`);
    if (!producto.exists()) throw new Error('El producto no existe');

    const path = `usuarios/${user.uid}/carrito/${productoId}`;
    const itemSnapshot = await this.getDocSnapshot(path);

    if (itemSnapshot.exists()) {
      const currentData = itemSnapshot.data();
      await this.updateDocument(path, {
        cantidad: (currentData?.['cantidad'] || 1) + 1,
        actualizadoEn: new Date()
      });
    } else {
      await this.setDocument(path, {
        productoId,
        cantidad: 1,
        agregadoEn: new Date(),
        actualizadoEn: new Date()
      });
    }
  }

  async cambiarCantidad(productoId: string, cantidad: number): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    if (cantidad <= 0) {
      await this.eliminarDelCarrito(productoId);
      return;
    }
    await this.updateDocument(`usuarios/${user.uid}/carrito/${productoId}`, {
      cantidad,
      actualizadoEn: new Date()
    });
  }

  async eliminarDelCarrito(productoId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    await this.deleteDocument(`usuarios/${user.uid}/carrito/${productoId}`);
  }

  async vaciarCarrito(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    const carritoRef = collection(this.firestore, `usuarios/${user.uid}/carrito`);
    const carritoSnapshot = await getDocs(carritoRef);
    const deletePromises = carritoSnapshot.docs.map(docSnapshot =>
      this.deleteDocument(`usuarios/${user.uid}/carrito/${docSnapshot.id}`)
    );
    await Promise.all(deletePromises);
  }

  getTotalItemsCarrito(): Observable<number> {
    return this.getCarrito().pipe(
      map(carrito => carrito.reduce((total, item) => total + (item.cantidad || 1), 0))
    );
  }

  // --- PROCESAR COMPRA (COBRO + INVENTARIO) ---
  // Ahora recibe el total a pagar
  async procesarCompra(totalAPagar: number): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    // 1. VERIFICAR SALDO EN REALTIME DATABASE
    const monedasRef = ref(this.db, `users/${user.uid}/monedas`);
    const monedasSnapshot = await get(monedasRef);
    const monedasActuales = monedasSnapshot.val() || 0;

    // Si no tiene dinero, lanzamos error
    if (monedasActuales < totalAPagar) {
      throw new Error('SALDO_INSUFICIENTE');
    }



    // 2. COBRAR (Restar monedas)
    // Esto actualiza la base de datos de Unity al instante
    await set(monedasRef, monedasActuales - totalAPagar);

    // 3. MOVER ÍTEMS DEL CARRITO AL INVENTARIO
    const carritoItems = await this.getDocsSnapshot(`usuarios/${user.uid}/carrito`);

    if (carritoItems.empty) return;

    const batchPromises = carritoItems.docs.map(async (docSnapshot) => {
      const itemCarrito = docSnapshot.data();
      const productoId = itemCarrito['productoId'];
      const cantidadComprada = itemCarrito['cantidad'];

      // Referencia al inventario
      const inventarioPath = `usuarios/${user.uid}/inventario/${productoId}`;
      const itemInventario = await this.getDocSnapshot(inventarioPath);

      // Si ya existe, sumamos cantidad. Si no, lo creamos.
      if (itemInventario.exists()) {
        const cantidadActual = itemInventario.data()['cantidad'] || 0;
        await this.updateDocument(inventarioPath, {
          cantidad: cantidadActual + cantidadComprada,
          actualizadoEn: new Date()
        });
      } else {
        await this.setDocument(inventarioPath, {
          productoId: productoId,
          cantidad: cantidadComprada,
          compradoEn: new Date()
        });
      }

      // Eliminamos del carrito
      await this.deleteDocument(`usuarios/${user.uid}/carrito/${docSnapshot.id}`);
    });

    await Promise.all(batchPromises);
  }

  // --- INVENTARIO ---
  getInventario(): Observable<any[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);
        return this.getCollectionData(`usuarios/${user.uid}/inventario`).pipe(
          switchMap((invItems: any[]) => {
            if (invItems.length === 0) return of([]);
            const productosObservables = invItems.map(item =>
              this.getProducto(item.productoId).pipe(
                map(producto => ({
                  ...item,
                  producto: producto || { nombre: 'Item desconocido', imagen: this.getImagenPorDefecto() }
                }))
              )
            );
            return combineLatest(productosObservables);
          })
        );
      })
    );
  }

  // --- HELPERS ---
  private async getDocsSnapshot(path: string) {
    const ref = collection(this.firestore, path);
    return getDocs(ref);
  }

  private getImagenPorDefecto(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyNjE5MTIiLz4KICA8cGF0aCBkPSJNODAgNjBDOTMuMjUgNjAgMTA0IDcwLjc1IDEwNCA4NEMxMDQgOTcuMjUgOTMuMjUgMTA4IDgwIDEwOEM2Ni43NSAxMDggNTYgOTcuMjUgNTYgODRDNTYgNzAuNzUgNjYuNzUgNjAgODAgNjBaTTgwIDEyMEM5NiAxMjAgMTEwIDEzMCAxMTAgMTQ2VjE3MEg1MFYxNDZDNTAgMTMwIDY0IDEyMCA4MCAxMjBaIiBmaWxsPSIjZmZjYzVjIi8+Cjwvc3ZnPg==';
  }
}
