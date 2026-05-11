import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ParcialidadService } from '../../services/parcialidad.service';
import { PesajeService } from '../../services/pesaje.service'; // Importante para validar
import { Parcialidad } from '../../models/parcialidad.model';
import { Pesaje } from '../../models/pesaje.model';

@Component({
  selector: 'app-parcialidades',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './parcialidades.component.html',
  styleUrls: ['./parcialidades.component.css']
})
export class ParcialidadesComponent implements OnInit {
  displayedColumns: string[] = ['idparcialidad', 'idtransporte', 'idtransportista', 'tipomedida', 'peso', 'fecha', 'acciones'];
  dataSource: Parcialidad[] = [];
  idPesajePadre!: number;

  // Variables de control de seguridad
  estadoPesajePadre: number = 0;
  cargandoInfo: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parcialidadService: ParcialidadService,
    private pesajeService: PesajeService // Inyectado para verificar el estado
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idPesajePadre = +params['idPesaje'];
      if (this.idPesajePadre) {
        this.cargarDatosYValidarEstado();
      }
    });
  }

  cargarDatosYValidarEstado() {
    this.cargandoInfo = true;

    // 1. Cargar el listado de parcialidades
    this.parcialidadService.listarPorPesaje(this.idPesajePadre).subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: (err) => console.error('Error al cargar parcialidades:', err)
    });

    // 2. Validar el estado del pesaje padre
    this.pesajeService.obtenerMisPesajes().subscribe({
      next: (pesajes: Pesaje[]) => {
        const pesajeActual = pesajes.find(p => p.idpesaje === this.idPesajePadre);

        // Usamos el operador ?. y || 0 para evitar errores de "undefined"
        this.estadoPesajePadre = pesajeActual?.estado || 0;

        this.cargandoInfo = false;
        console.log('Estado del pesaje validado:', this.estadoPesajePadre);
      },
      error: (err) => {
        console.error('Error al validar estado:', err);
        this.cargandoInfo = false;
      }
    });
  }

  irANuevaParcialidad() {
    // Seguridad nivel 1: No permitir navegación si el estado es 162
    if (this.estadoPesajePadre === 162) {
      console.warn('Acción bloqueada: El pesaje ya está finalizado.');
      return;
    }

    this.router.navigate(['/parcialidades/nueva'], {
      queryParams: { idPesaje: this.idPesajePadre }
    });
  }

  regresar() {
    this.router.navigate(['/pesajes']);
  }
}
