import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
  standalone: false
})
export class JuegoPage {

  constructor(private router: Router) {}

  irAlJuego() {
    // Redirigir al juego externo
    window.open('https://facebomb.onrender.com/', '_blank');
  }

  navegar(ruta: string) {
    // Navegación interna
    this.router.navigate([ruta]);
  }
}
