import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Necesario para la navegación interna
import { NavController } from '@ionic/angular'; // Opcional, pero bueno para la navegación de Ionic

@Component({
  standalone: false,
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})


export class PrincipalPage implements OnInit {

  // Variable de estado para controlar la visibilidad del video
  showVideo: boolean = false;

  elementos: Elemento[]=[
    { //Primer elemento de la lista
      icono: 'newspaper-outline',
      nombre:'Novedades ',
      ruta:'/social'
    },
    { //Primer elemento de la lista
      icono: 'information-circle-outline',
      nombre:'Información',
      ruta:'/extras'
    },
    {
      //Primer elemento de la lista
      icono: 'game-controller-outline',
      nombre: 'Jugar',
      ruta: 'https://www.friv.com/z/play/juegos.html'
    }
  ];

  // Inyectamos Router o NavController para manejar la navegación si es necesario
  constructor(private router: Router, private navCtrl: NavController) { }

  ngOnInit() {
  }

  // LÓGICA PARA MOSTRAR/OCULTAR EL TRÁILER (basado en peticiones anteriores)
  toggleVideo() {
    // Invierte el valor de la variable de estado
    this.showVideo = !this.showVideo;
  }

  // LÓGICA PARA MANEJAR LA NAVEGACIÓN DE LOS BOTONES
  // Esto es útil si quieres manejar URLs externas o internas de manera controlada.
  navegar(ruta: string) {
    if (ruta.startsWith('http')) {
      // Si es una URL externa, abre en una nueva pestaña
      window.open(ruta, '_system');
    } else {
      this.navCtrl.navigateForward(ruta);
    }
  }

}

interface Elemento{
  icono: string;
  nombre:string;
  ruta:string;
}
