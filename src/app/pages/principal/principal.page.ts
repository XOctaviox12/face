import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Permite la navegación entre rutas dentro de la aplicación
import { NavController } from '@ionic/angular'; // Controlador de navegación propio de Ionic

@Component({
  standalone: false,
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  // Variable booleana que controla si se muestra o no el video del tráiler
  showVideo: boolean = false;

  // Lista de elementos que se mostrarán en la página principal, con icono, nombre y ruta asociada
  elementos: Elemento[] = [
    {
      icono: 'newspaper-outline',
      nombre: 'Novedades',
      ruta: '/social' // Navegación interna
    },
    {
      icono: 'information-circle-outline',
      nombre: 'Información',
      ruta: '/extras' // Navegación interna
    },
    {
      icono: 'game-controller-outline',
      nombre: 'Jugar',
      ruta: 'https://facebomb.onrender.com/' // Enlace externo
    }
  ];

  // Constructor que inyecta Router y NavController para gestionar la navegación
  constructor(private router: Router, private navCtrl: NavController) { }

  // Método del ciclo de vida de Angular que se ejecuta al inicializar el componente
  ngOnInit() {
  }

  // Cambia el estado de la variable showVideo para mostrar u ocultar el video
  toggleVideo() {
    this.showVideo = !this.showVideo;
  }

  // Controla la navegación según el tipo de ruta (interna o externa)
  navegar(ruta: string) {
    if (ruta.startsWith('http')) {
      // Si la ruta es una URL externa, se abre en una nueva pestaña o ventana
      window.open(ruta, '_system');
    } else {
      // Si la ruta es interna, se navega dentro de la aplicación Ionic
      this.navCtrl.navigateForward(ruta);
    }
  }

}

// Interfaz que define la estructura de los objetos dentro del arreglo elementos
interface Elemento {
  icono: string;
  nombre: string;
  ruta: string;
}
