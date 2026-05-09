import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../services/catalogo.service';
import { PesajeService } from '../../../services/pesaje.service';
import Swal, { SweetAlertResult } from 'sweetalert2'; // Importamos el tipo para evitar errores de TS

@Component({
  selector: 'app-crear-pesaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-pesaje.component.html',
  styleUrls: ['./crear-pesaje.component.css']
})
export class CrearPesajeComponent implements OnInit {
  unidadesMedida: any[] = [];
  estadosPesaje: any[] = [];

  unidadSeleccionada: any = null;
  estadoSeleccionado: any = null;
  pesoIngresado: number = 0;
  fechaActual: string = '';

  constructor(
    private router: Router,
    private catalogoService: CatalogoService,
    private pesajeService: PesajeService
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaActual = hoy.toISOString().split('T')[0];
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.catalogoService.getUnidadesMedida().subscribe({
      next: (data) => this.unidadesMedida = data,
      error: (err) => console.error('Error al cargar unidades', err)
    });

    this.catalogoService.getEstadosPesaje().subscribe({
      next: (data) => {
        this.estadosPesaje = data;
        const estadoDefault = data.find(e => e.nombre === 'Sin Cuenta Creada');
        if (estadoDefault) this.estadoSeleccionado = estadoDefault.id;
      },
      error: (err) => console.error('Error al cargar estados', err)
    });
  }

  // MÉTODO ÚNICO: Se eliminó la copia duplicada que causaba el error
  cancelar(): void {
    this.router.navigate(['/pesajes']);
  }

  crearPesaje(): void {
    if (!this.unidadSeleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar una unidad de medida',
        confirmButtonColor: '#3d2314'
      });
      return;
    }

    if (this.pesoIngresado <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Peso inválido',
        text: 'El peso total debe ser mayor a 0',
        confirmButtonColor: '#3d2314'
      });
      return;
    }

    Swal.fire({
      title: 'Guardando registro',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const dataParaGuardar = {
      pesototalestimado: this.pesoIngresado,
      idunidadmedida: this.unidadSeleccionada,
      estado: this.estadoSeleccionado
    };

    this.pesajeService.guardar(dataParaGuardar).subscribe({
      next: (res) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: '¡Completado!',
          text: 'El pesaje se ha creado con éxito',
          confirmButtonColor: '#3d2314',
          confirmButtonText: 'OK'
        }).then((result: SweetAlertResult) => { // Tipado explícito para corregir error TS7006
          if (result.isConfirmed) {
            this.router.navigate(['/pesajes']);
          }
        });
      },
      error: (err) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'Hubo un problema al procesar el registro. Intente de nuevo.',
          confirmButtonColor: '#2c3e50',
          confirmButtonText: 'OK'
        });
        console.error('Error al guardar:', err);
      }
    });
  }
}
