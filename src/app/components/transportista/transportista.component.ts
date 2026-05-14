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
     next: (data: any[]) => {
       this.dataSource = data.map(t => ({
         cui: t.cui,
         nombre: t.nombrecompleto, // Verifica si el Map lo devuelve en minúsculas
         tipoLicencia: t.nombre_licencia,
         fechaVencimiento: t.fechavencimientolicencia,
         estado: t.nombre_estado,
         disponible: t.disponible ? 'Sí' : 'No',
         // Si existe nocuenta, lo muestra, si no, muestra 'No'
         pesaje: t.nocuenta ? t.nocuenta : 'No'
       }));
     },
     error: (err) => console.error('Error al cargar transportistas:', err)
   });
 }


}
