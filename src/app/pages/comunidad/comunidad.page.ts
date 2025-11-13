import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-comunidad',
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
})
export class ComunidadPage implements OnInit {

  comentarios!: Observable<any[]>;
  nuevoComentario: string = '';

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    // Se obtiene la colección "comentarios" de Firebase en tiempo real
    const comentariosRef = collection(this.firestore, 'comentarios');
    this.comentarios = collectionData(comentariosRef, { idField: 'id' });
  }

  async agregarComentario() {
    if (this.nuevoComentario.trim() === '') return;

    const comentariosRef = collection(this.firestore, 'comentarios');
    await addDoc(comentariosRef, {
      texto: this.nuevoComentario,
      fecha: new Date(),
    });

    this.nuevoComentario = '';
  }
}
