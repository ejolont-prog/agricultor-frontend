import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-parcialidades',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './parcialidades.component.html',
  styleUrl: './parcialidades.component.css'
})
export class ParcialidadesComponent {
  displayedColumns: string[] = ['col1', 'col2', 'col3', 'col4', 'col5', 'col6', 'acciones'];

  // Datos de ejemplo
  dataSource = [
    { id: 2, fecha: '2024-03-13', nombre: 'Ana López', producto: 'Café Robusta', cantidad: '300kg', estado: 'Completado' },
  ];
}
