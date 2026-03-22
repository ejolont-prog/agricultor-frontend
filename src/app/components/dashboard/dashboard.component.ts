import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importaciones de Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Estos son los datos que alimentan las tarjetas del menú
  productos = [
    { nombre: 'Parcialidades', icon: 'segment', route: '/parcialidades' },
    { nombre: 'Pesajes', icon: 'scale', route: '/pesajes' },
    { nombre: 'Transporte', icon: 'local_shipping', route: '/transporte' },
    { nombre: 'Transportistas', icon: 'badge', route: '/transportista' }
  ];
}

