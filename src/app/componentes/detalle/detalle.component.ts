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
export class DetalleComponent implements OnInit {

  // Recibe un identificador desde el componente padre (por ejemplo, el ID del personaje a mostrar)
  @Input() id: any;

  // Objeto donde se almacenará la información del personaje obtenida desde el servicio
  detallePersonaje = {} as personajesFirebase;

  // Objeto adicional para información general, actualmente vacío pero preparado para recibir datos
  detalleGeneral = {} as InfGeneral;

  // Se inyectan las dependencias necesarias:
  // - Personajes: servicio encargado de obtener los datos
  // - ModalController: controlador que gestiona el cierre del modal
  constructor(
    private detalle: Personajes,
    private ModalCtrl: ModalController
  ) { }

  // Cierra el modal actual y regresa a la vista anterior
  regresar() {
    this.ModalCtrl.dismiss();
  }

  // Método del ciclo de vida de Angular que se ejecuta al iniciar el componente
  ngOnInit() {
    // Se llama al servicio para obtener el detalle del personaje según el ID recibido
    // Luego, se asigna la respuesta al objeto detallePersonaje
    this.detalle.getPersonajesDetalle(this.id).subscribe(respuesta => {
      this.detallePersonaje = <personajesFirebase>respuesta;
    });
  }

}
