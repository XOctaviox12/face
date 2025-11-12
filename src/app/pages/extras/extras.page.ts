import { Component, OnInit } from '@angular/core';
import { Personajes } from 'src/app/services/personajes';

import { Personajes as PersonajesApi } from '../../interfaces/interfaces';
import { RespuestaBD } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from 'src/app/componentes/detalle/detalle.component';
import {personajesFirebase} from '../../interfaces/interfaces';



@Component({
  standalone:false,
  selector: 'app-extras',
  templateUrl: './extras.page.html',
  styleUrls: ['./extras.page.scss'],
})



export class ExtrasPage implements OnInit {


  personajesRecientes: personajesFirebase[]=[];
  // personajesRecientes: PersonajesApi[]=[];
constructor(
  private servicioPersonajes: Personajes,
  private modalCtrl:ModalController
) { }


async verDetalle(id: string){
  const modal= await this.modalCtrl.create({
      component:DetalleComponent,
      componentProps:{id}
  });
  modal.present();
}

//   ngOnInit() {
//  this.servicioPersonajes.getDatos()
// .subscribe((resp: RespuestaBD)=>{
// console.log('Personajes', resp);
// this.personajesRecientes=resp.data;
// })
//   }

ngOnInit() {
this.servicioPersonajes.getPersonajes().subscribe((respuesta)=>{
respuesta.forEach(personaje=>{
  this.personajesRecientes.push(<personajesFirebase>personaje);
});
});
}

}
