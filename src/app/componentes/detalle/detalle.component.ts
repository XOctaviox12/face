import { Component, Input, OnInit } from '@angular/core';
import { Detalle, InfGeneral, RespuestaDetalle } from 'src/app/interfaces/interfaces';
import { Personajes } from 'src/app/services/personajes';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
  standalone: false,
})
export class DetalleComponent  implements OnInit {

  @Input() id: any;

  detallePersonaje={} as Detalle;
  detalleGeneral={} as InfGeneral;


  constructor(
    private detalle:Personajes,
    private ModalCtrl: ModalController
  ) { }

  regresar(){
    this.ModalCtrl.dismiss();
  }

  ngOnInit() {
    this.detalle.getDetalle(this.id)
    .subscribe((respuesta:RespuestaDetalle)=>{
      console.log('Detalle personaje', respuesta)
      this.detallePersonaje=respuesta.data;
      this.detalleGeneral=respuesta.suport;
    });
  }

}
