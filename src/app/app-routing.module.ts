import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { PrincipalPageModule } from './pages/principal/principal.module';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
{
  path: '',
redirectTo: 'principal',
  pathMatch: 'full'
},
{
  path: 'principal',
  loadChildren: () => import('./pages/principal/principal.module').then( m => m.PrincipalPageModule)
},
  {
    path: 'social',
    loadChildren: () => import('./pages/social/social.module').then( m => m.SocialPageModule)
  },
  {
    path: 'extras',
    loadChildren: () => import('./pages/extras/extras.module').then( m => m.ExtrasPageModule)
  },
  {
    path: 'juego',
    loadChildren: () => import('./pages/juego/juego.module').then( m => m.JuegoPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }), 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
