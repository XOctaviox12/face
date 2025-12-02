import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { TiendaService } from '../../services/tienda.service';
import { ViewWillEnter } from '@ionic/angular'; // 1. IMPORTAR ESTO

@Component({
  standalone: false,
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
// 2. IMPLEMENTAR ViewWillEnter
export class PerfilPage implements OnInit, OnDestroy, ViewWillEnter {

  perfil: any = {};
  user: User | null = null;
  monedas: number = 0;
  cargando: boolean = true;
  enviandoVerificacion: boolean = false;
  inventario: any[] = [];

  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private tiendaSrv: TiendaService
  ) {}

  async ngOnInit() {
    // Mantenemos la suscripción principal aquí para detectar login/logout
    this.userSubscription = this.authService.user$.subscribe(async (user) => {
      this.user = user;
      if (user) {
        await this.cargarDatosUsuario();
        this.cargarInventario();
      } else {
        this.cargando = false;
      }
    });
  }

  // 3. AGREGAR ESTE MÉTODO MÁGICO
  // Se ejecuta CADA VEZ que entras a la pantalla (al volver de la tienda, etc.)
  ionViewWillEnter() {
    if (this.user) {
      console.log('🔄 Refrescando perfil al entrar...');
      this.cargarDatosUsuario(); // Recarga monedas y datos
      this.cargarInventario();   // Recarga la mochila
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  cargarInventario() {
    // Nota: Como getInventario devuelve un Observable, se queda escuchando cambios.
    // Pero llamarlo aquí asegura que tengamos la última versión si algo cambió.
    this.tiendaSrv.getInventario().subscribe(items => {
      this.inventario = items;
      // console.log("Inventario cargado:", this.inventario);
    });
  }

  async cargarDatosUsuario() {
    // Opcional: Poner cargando en true solo si quieres que aparezca el spinner cada vez
    // this.cargando = true;
    try {
      await this.cargarPerfilFirestore();
      this.cargarDatosAuth();
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.cargando = false;
    }
  }

  async cargarPerfilFirestore() {
    try {
      if (!this.user?.uid) return;

      const datos = await this.perfilService.obtenerDatosPerfil(this.user.uid);

      if (datos) {
        this.perfil = { ...this.perfil, ...datos };
        this.monedas = datos.monedas !== undefined ? datos.monedas : 0;
        console.log('💰 Monedas actualizadas:', this.monedas);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  }

  // ... El resto de tus métodos (getImagenProducto, cargarDatosAuth, etc.) siguen IGUAL ...

  getImagenProducto(item: any): string {
    return item.producto?.imagen || 'assets/default-item.png';
  }

  cargarDatosAuth() {
    if (this.user) {
      this.perfil = {
        ...this.perfil,
        nombre: this.perfil.nombre || this.user.displayName || 'Usuario',
        email: this.perfil.email || this.user.email || 'No especificado',
        fotoURL: this.perfil.fotoURL || this.user.photoURL,
        proveedor: this.perfil.proveedor || this.user.providerData[0]?.providerId || 'email',
        emailVerified: this.user.emailVerified
      };
    }
  }

  getFotoPerfil(): string {
    if (this.perfil.fotoURL) return this.perfil.fotoURL;
    if (this.user?.photoURL) return this.user.photoURL;
    return this.getAvatarPorDefecto();
  }

  onErrorImagen(event: any) {
    event.target.src = this.getAvatarPorDefecto();
  }

  getAvatarPorDefecto(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSI2MCIgZmlsbD0iIzI2MTkxMiIvPgogIDxwYXRoIGQ9Ik02MCAzMEM2Ni42IDMwIDcyIDM1LjQgNzIgNDJDNzIgNDguNiA2Ni42IDU0IDYwIDU0QzUzLjQgNTQgNDggNDguNiA0OCA0MkM0OCAzNS40IDUzLjQgMzAgNjAgMzBaTTYwIDYwQzcyIDYwIDgyIDY2IDgyIDc0Vjg2SDM4Vjc0QzM4IDY2IDQ4IDYwIDYwIDYwWiIgZmlsbD0iI2ZmY2M1YyIvPgo8L3N2Zz4=';
  }

  getNombreDisplay(): string {
    return this.perfil.nombre || this.user?.displayName || 'USUARIO';
  }

  getEmail(): string {
    return this.perfil.email || this.user?.email || 'No especificado';
  }

  estaVerificado(): boolean {
    return this.user?.emailVerified || false;
  }

  async enviarVerificacionEmail() {
    if (!this.user) return;
    this.enviandoVerificacion = true;
    try {
      await this.perfilService.enviarCorreoVerificacion(this.user);
      alert('✅ Email de verificación enviado. Revisa tu bandeja de entrada.');
    } catch (error: any) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      this.enviandoVerificacion = false;
    }
  }

  async actualizarPerfil() {
    await this.cargarDatosUsuario();
    console.log('Perfil actualizado manualmente');
  }

  getProveedor(): string {
    return this.perfil.proveedor === 'google.com' ? 'GOOGLE' : 'EMAIL';
  }
}
