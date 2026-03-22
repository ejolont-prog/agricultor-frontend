import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ParcialidadesComponent } from './components/parcialidades/parcialidades.component';
import { PesajesComponent } from './components/pesajes/pesajes.component';
import { TransporteComponent } from './components/transporte/transporte.component';
import { TransportistaComponent } from './components/transportista/transportista.component';
import { NuevaparcialidadComponent } from './components/parcialidades/nuevaparcialidad/nuevaparcialidad.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent }, // Esta es tu pantalla principal
  { path: 'parcialidades', component: ParcialidadesComponent },
  { path: 'parcialidades/nueva', component: NuevaparcialidadComponent },  { path: 'pesajes', component: PesajesComponent },
  { path: 'transporte', component: TransporteComponent },
  { path: 'transportista', component: TransportistaComponent },
];
