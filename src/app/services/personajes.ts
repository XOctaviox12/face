import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespuestaBD, RespuestaDetalle } from '../interfaces/interfaces';
import {
  Firestore, collection, collectionData, doc,
  docData
} from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root',
})
export class Personajes {

  constructor(
    private http: HttpClient,
    private firestore: Firestore


  ) { }

  getDatos() {
    return this.http.get<RespuestaBD>('https://reqres.in/api/users', {
      headers: { 'x-api-key': 'reqres-free-v1' }
    });
  }

  getDetalle(id: string) {
    return this.http.get<RespuestaDetalle>('https://reqres.in/api/users/' + id, {
      headers: { 'x-api-key': 'reqres-free-v1' }
    });
  }

  getPersonajes() {
    const personajesRef = collection(this.firestore, 'personajesFacebomb');
    return collectionData(personajesRef, { idField: 'id' });
  }
  getPersonajesDetalle(id: string) {
    //Consulta de la colección el documento con el id que recibimos
    const personajeRef = doc(this.firestore, `personajesFacebomb/${id}`);
    //Extraemos los datos del objeto encontrado y lo retornamos
    return docData(personajeRef);
  }
}
