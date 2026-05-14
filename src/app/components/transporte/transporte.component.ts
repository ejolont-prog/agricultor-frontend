import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TransporteService } from '../../services/transporte.service';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.css']
})
export class TransporteComponent implements OnInit {
  private transporteService = inject(TransporteService);
  private router = inject(Router);

  displayedColumns: string[] = [
    'placa',
    'marca',
    'color',
    'linea',
    'modelo',
    'estado',
    'disponible',
    'pesaje'
  ];

  dataSource: any[] = [];
  ngOnInit(): void {

    this.cargarTransportes();
  }

  cargarTransportes(): void {
    this.transporteService.listarTransportes().subscribe({
      next: (data: any[]) => { // También tipamos la data que viene del server
        this.dataSource = data.map((t: any) => ({ // <--- Cambio aquí
          placa: t.placa,
          marca: t.marca || 'N/A',
          color: t.color || 'N/A',
          linea: t.linea || 'N/A',
          modelo: t.modelo || 'N/A',
          estado: t.estado || 'Pendiente',
          disponible: t.disponible ? 'Sí' : 'No',
          pesaje: t.nocuenta ? t.nocuenta : 'No'
        }));
      },
      error: (err: any) => console.error('Error al cargar transportes:', err)
    });
  }

  irACrear(): void {
    // IMPORTANTE: Esta ruta debe existir en tus app.routes.ts
    this.router.navigate(['/transporte/crear']);
  }

  regresar(): void {
    this.router.navigate(['/']);
  }
}
