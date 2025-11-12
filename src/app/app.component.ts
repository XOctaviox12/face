import { Component} from '@angular/core';

interface Elemento{
icono: string;
nombre:string;
ruta:string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})


export class AppComponent{

elementos: Elemento[]=[

{
  //Primer elemento de la lista
  icono: 'Home',
  nombre: 'Inicio',
  ruta: '/principal'
},
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
  ruta: '/juego'
},



];

  constructor() {}
  
}
