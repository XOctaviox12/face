import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { DetalleComponent } from './componentes/detalle/detalle.component';

import { makeEnvironmentProviders } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { firebaseConfig } from '../environments/firebaseconfig';
import { provideDatabase, getDatabase } from '@angular/fire/database';

@NgModule({
  // Declaración de los componentes que pertenecen a este módulo principal
  declarations: [
    AppComponent,        // Componente raíz de la aplicación
    DetalleComponent     // Componente reutilizable para mostrar detalles
  ],

  // Módulos externos e internos que se importan para habilitar funcionalidades
  imports: [
    BrowserModule,               // Permite ejecutar la aplicación en navegadores web
    IonicModule.forRoot(),       // Inicializa Ionic con la configuración por defecto
    AppRoutingModule             // Módulo que gestiona las rutas de navegación
  ],

  // Proveedores de servicios y configuraciones globales del módulo
  providers: [
    // Estrategia de reutilización de rutas optimizada para Ionic
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // Habilita el uso de HttpClient para realizar peticiones HTTP
    provideHttpClient(),

    // Inicialización de los servicios de Firebase (App, Firestore y Auth)
    makeEnvironmentProviders([
      provideFirebaseApp(() => initializeApp(firebaseConfig)), // Inicializa Firebase con la configuración del entorno
      provideFirestore(() => getFirestore()),                  // Proporciona acceso a Firestore
      provideAuth(() => getAuth()),                            // Proporciona acceso al servicio de autenticación
      provideDatabase(() => getDatabase()),
    ])
  ],

  // Componente principal que se carga al iniciar la aplicación
  bootstrap: [AppComponent],

  // Exporta el componente DetalleComponent para que pueda usarse en otros módulos
  exports: [DetalleComponent],
})
export class AppModule {}
