import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Imprescindible para directivas como *ngFor
import { PesajeService } from '../../services/pesaje.service';
import { Pesaje } from '../../models/pesaje.model';
import { RouterModule } from '@angular/router';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-pesajes',
  standalone: true,
  // Agregamos CommonModule y RouterModule aquí
  imports: [CommonModule, RouterModule, MatButton, MatIcon],
  templateUrl: './pesajes.component.html',
  styleUrl: './pesajes.component.css'
})
export class PesajesComponent implements OnInit {
  listado: Pesaje[] = [];

  constructor(private pesajeService: PesajeService) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.pesajeService.obtenerMisPesajes().subscribe({
      next: (data) => {
        this.listado = data;
        console.log('Pesajes cargados:', this.listado);
      },
      error: (err) => {
        console.error('Error al recuperar pesajes', err);
      }
    });
  }
}
