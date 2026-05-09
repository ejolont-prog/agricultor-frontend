import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ParcialidadesComponent } from './components/parcialidades/parcialidades.component';
import { PesajesComponent } from './components/pesajes/pesajes.component';
import { TransporteComponent } from './components/transporte/transporte.component';
import { TransportistaComponent } from './components/transportista/transportista.component';
import { NuevaparcialidadComponent } from './components/parcialidades/nuevaparcialidad/nuevaparcialidad.component';
import { CrearTransportistaComponent } from './components/transportista/creartransportista/creartransportista.component';
import { CrearTransporteComponent } from './components/transporte/crear-transporte/crear-transporte.component';
import { authGuard } from './auth/auth.guard';
import { CrearPesajeComponent } from "./components/pesajes/crear-pesaje/crear-pesaje.component";

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'parcialidades',
    component: ParcialidadesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'parcialidades/nueva',
    component: NuevaparcialidadComponent,
    canActivate: [authGuard]
  },
  {
    path: 'pesajes',
    component: PesajesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'pesajes/nueva',
    component: CrearPesajeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transporte',
    component: TransporteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transportista',
    component: TransportistaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transportista/creartransportista',
    component: CrearTransportistaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transporte/crear',
    component: CrearTransporteComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
