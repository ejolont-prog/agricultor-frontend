import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ParcialidadService } from '../../services/parcialidad.service';
import { Parcialidad } from '../../models/parcialidad.model';



@Component({
  selector: 'app-parcialidades',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './parcialidades.component.html',
  styleUrls: ['./parcialidades.component.css']
})
export class ParcialidadesComponent implements OnInit {
  // Columnas que pide tu Caso de Uso (Paso 2 del FA01)
  displayedColumns: string[] = ['idparcialidad', 'idtransporte', 'idtransportista','tipomedida' , 'peso', 'fecha', 'acciones'];
  dataSource: Parcialidad[] = [];
  idPesajePadre!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parcialidadService: ParcialidadService
  ) {}

  ngOnInit(): void {
    // Obtenemos el ID del pesaje de los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.idPesajePadre = +params['idPesaje'];
      if (this.idPesajePadre) {
        this.cargarParcialidades();
      }
    });
  }

  cargarParcialidades() {
    this.parcialidadService.listarPorPesaje(this.idPesajePadre).subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: (err) => console.error('Error al cargar detalle:', err)
    });
  }

  irANuevaParcialidad() {
    // Navegamos al formulario pasando el ID del pesaje actual
    this.router.navigate(['/parcialidades/nueva'], {
      queryParams: { idPesaje: this.idPesajePadre }
    });
  }

  regresar() {
    this.router.navigate(['/pesajes']);
  }
}
