import { Injectable } from '@angular/core';
import { Database, ref, child, get } from '@angular/fire/database'; // <--- Usamos Database ahora
import { Auth, sendEmailVerification, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(
    private db: Database, // Inyectamos Realtime Database
    private auth: Auth
  ) { }

  async obtenerDatosPerfil(uid: string): Promise<any> {
    try {
      // Referencia a la raíz de la base de datos
      const dbRef = ref(this.db);

      // Buscamos en la ruta: users/UID
      // (Exactamente igual a como lo guardamos en Unity)
      const snapshot = await get(child(dbRef, `users/${uid}`));

      if (snapshot.exists()) {
        return snapshot.val(); // .val() nos da el objeto JSON puro
      } else {
        console.log("No se encontraron datos para este usuario.");
        return {};
      }
    } catch (error) {
      console.error("Error leyendo Realtime DB:", error);
      throw error;
    }
  }

  async enviarCorreoVerificacion(user: User): Promise<void> {
    return sendEmailVerification(user);
  }
}
