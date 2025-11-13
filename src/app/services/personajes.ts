import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespuestaBD, RespuestaDetalle } from '../interfaces/interfaces';
import {
  Firestore, collection, collectionData, doc, docData
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root', // Permite que el servicio esté disponible de forma global en toda la aplicación
})
export class Personajes {

  // Se inyectan los servicios necesarios:
  // - HttpClient: para realizar solicitudes HTTP a APIs externas
  // - Firestore: para interactuar con la base de datos de Firebase
  constructor(
    private http: HttpClient,
    private firestore: Firestore
  ) { }

  // Obtiene una lista de usuarios desde la API pública ReqRes
  // Devuelve un observable del tipo RespuestaBD
  getDatos() {
    return this.http.get<RespuestaBD>('https://reqres.in/api/users', {
      headers: { 'x-api-key': 'reqres-free-v1' } // Encabezado opcional de autenticación
    });
  }

  // Obtiene el detalle de un usuario específico desde la API de ReqRes
  // Recibe un ID como parámetro y devuelve un observable del tipo RespuestaDetalle
  getDetalle(id: string) {
    return this.http.get<RespuestaDetalle>('https://reqres.in/api/users/' + id, {
      headers: { 'x-api-key': 'reqres-free-v1' }
    });
  }

  // Obtiene todos los personajes almacenados en la colección "personajesFacebomb" de Firestore
  // collectionData devuelve un observable con todos los documentos de la colección
  getPersonajes() {
    const personajesRef = collection(this.firestore, 'personajesFacebomb'); // Referencia a la colección
    return collectionData(personajesRef, { idField: 'id' }); // Incluye el ID de cada documento en los resultados
  }

  // Obtiene el detalle de un personaje específico almacenado en Firestore
  // Recibe un ID y devuelve los datos del documento correspondiente
  getPersonajesDetalle(id: string) {
    const personajeRef = doc(this.firestore, `personajesFacebomb/${id}`); // Referencia al documento por ID
    return docData(personajeRef); // Retorna los datos del documento como observable
  }
}
