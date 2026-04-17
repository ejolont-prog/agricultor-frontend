import { Component, OnInit } from '@angular/core'; // Importamos OnInit
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransportistaService } from '../../services/transportista.service'; // Asegúrate de que la ruta sea correcta

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-transportista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './transportista.component.html',
  styleUrls: ['./transportista.component.css']
})
export class TransportistaComponent implements OnInit { // Agregamos el implements

  displayedColumns: string[] = [
    'cui',
    'nombre',
    'tipoLicencia',
    'fechaVencimiento',
    'estado',
    'disponible',
    'pesaje'
  ];

  // Inicializamos la tabla vacía
  dataSource: any[] = [];

  // Inyectamos el servicio en el constructor
  constructor(private transportistaService: TransportistaService) {}

  ngOnInit(): void {
    this.cargarTransportistas();
  }

  cargarTransportistas(): void {
    this.transportistaService.listarTransportistas().subscribe({
      next: (data) => {
        // Mapeamos los datos que vienen del backend a lo que espera tu HTML
        this.dataSource = data.map(t => ({
          cui: t.cui,
          nombre: t.nombreCompleto, // nombreCompleto viene del Java Entity
          tipoLicencia: t.tipoLicencia,
          fechaVencimiento: t.fechaVencimientoLicencia,
          estado: t.estado === 1 ? 'Activo' : 'Inactivo', // Ajusta según tus IDs de catálogo
          disponible: t.disponible,
          pesaje: 'No' // Dato estático por ahora como tenías en tu ejemplo
        }));
      },
      error: (err) => {
        console.error('Error al cargar transportistas:', err);
      }
    });
  }


}
