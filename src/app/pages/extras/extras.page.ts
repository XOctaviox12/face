import { Component, OnInit } from '@angular/core';
import { Personajes } from 'src/app/services/personajes';
import { Personajes as PersonajesApi } from '../../interfaces/interfaces';
import { RespuestaBD } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from 'src/app/componentes/detalle/detalle.component';
import { personajesFirebase } from '../../interfaces/interfaces';

@Component({
  standalone: false,
  selector: 'app-extras',
  templateUrl: './extras.page.html',
  styleUrls: ['./extras.page.scss'],
})
export class ExtrasPage implements OnInit {

  // Arreglo que almacenará los personajes obtenidos desde Firebase
  personajesRecientes: personajesFirebase[] = [];

  // Se inyectan los servicios necesarios:
  // - servicioPersonajes: para acceder a los datos de personajes
  // - modalCtrl: para manejar la apertura y cierre de modales en Ionic
  constructor(
    private servicioPersonajes: Personajes,
    private modalCtrl: ModalController
  ) { }

  // Abre un modal que muestra el detalle de un personaje seleccionado
  // Recibe el 'id' del personaje como argumento
  async verDetalle(id: string) {
    const modal = await this.modalCtrl.create({
      component: DetalleComponent, // Componente que se mostrará dentro del modal
      componentProps: { id }        // Se pasa el ID como propiedad al componente DetalleComponent
    });
    modal.present(); // Muestra el modal en pantalla
  }

  // Método del ciclo de vida de Angular que se ejecuta al inicializar el componente
  ngOnInit() {
    // Llama al servicio para obtener la lista de personajes almacenados en Firebase
    // Luego, agrega cada personaje recibido al arreglo personajesRecientes
    this.servicioPersonajes.getPersonajes().subscribe((respuesta) => {
      respuesta.forEach(personaje => {
        this.personajesRecientes.push(<personajesFirebase>personaje);
      });
    });
  }

  /*
  // Versión anterior (comentada) que obtenía datos desde una API
  ngOnInit() {
    this.servicioPersonajes.getDatos()
      .subscribe((resp: RespuestaBD) => {
        console.log('Personajes', resp);
        this.personajesRecientes = resp.data;
      });
  }
  */
}
