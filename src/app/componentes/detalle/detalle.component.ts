import { Component, Input, OnInit } from '@angular/core';
import { Detalle, InfGeneral, RespuestaDetalle } from 'src/app/interfaces/interfaces';
import { Personajes } from 'src/app/services/personajes';
import { ModalController } from '@ionic/angular';
import { personajesFirebase } from '../../interfaces/interfaces';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
  standalone: false,
})
export class DetalleComponent  implements OnInit {
  @Input() id: any;
  detallePersonaje={} as personajesFirebase;
  detalleGeneral={} as InfGeneral;


  constructor(
    private detalle:Personajes,
    private ModalCtrl: ModalController
  ) { }

  regresar(){
    this.ModalCtrl.dismiss();
  }

  ngOnInit() {
    this.detalle.getPersonajesDetalle(this.id).subscribe(respuesta => {
      this.detallePersonaje = <personajesFirebase> respuesta ;
    })
  }

}
