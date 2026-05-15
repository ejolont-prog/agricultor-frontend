import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../services/catalogo.service';
import { PesajeService } from '../../../services/pesaje.service'; // Asegúrate de que la ruta sea correcta
import { MatIcon } from "@angular/material/icon";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-pesaje',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './crear-pesaje.component.html',
  styleUrls: ['./crear-pesaje.component.css']
})
export class CrearPesajeComponent implements OnInit {
  // 1. Listas para los combos
  unidadesMedida: any[] = [];
  estadosPesaje: any[] = [];

  // 2. Variables para el formulario (ngModel)
  unidadSeleccionada: any = null;
  estadoSeleccionado: any = null;
  pesoIngresado: number | null = null; // Para el input de "Peso Total Actual"
  fechaActual: string = '';

  constructor(
    private router: Router,
    private catalogoService: CatalogoService,
    private pesajeService: PesajeService // Inyectamos el servicio de pesajes
  ) {}

  ngOnInit(): void {
    // Inicializa la fecha de hoy para mostrarla en el input readonly
    const hoy = new Date();
    this.fechaActual = hoy.toISOString().split('T')[0];

    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    // Cargar Unidades de Medida
    this.catalogoService.getUnidadesMedida().subscribe({
      next: (data) => {
        this.unidadesMedida = data;
      },
      error: (err) => console.error('Error al cargar unidades', err)
    });

    // Cargar Estados y seleccionar el default
    this.catalogoService.getEstadosPesaje().subscribe({
      next: (data) => {
        this.estadosPesaje = data;
        const estadoDefault = data.find(e => e.nombre === 'Sin Cuenta Creada');
        if (estadoDefault) {
          this.estadoSeleccionado = estadoDefault.id;
        }
      },
      error: (err) => console.error('Error al cargar estados', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/pesajes']);
  }

  crearPesaje(): void {
      // 1. VALIDACIÓN INICIAL
      if (!this.unidadSeleccionada || this.pesoIngresado === null || this.pesoIngresado <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Por favor, completa todos los campos con valores válidos antes de continuar.',
          confirmButtonColor: '#2b170e' // Color café de tu paleta
        });
        return;
      }

      // 2. PREPARACIÓN DE DATOS
      const dataParaGuardar = {
        pesototalestimado: this.pesoIngresado,
        idunidadmedida: this.unidadSeleccionada,
        estado: this.estadoSeleccionado
      };

      // 3. MOSTRAR LOADING (Igual que en transportes)
      Swal.fire({
        title: 'Procesando registro',
        text: 'Solicitando creacion de cuenta',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // 4. LLAMADA AL SERVICIO
      this.pesajeService.guardar(dataParaGuardar).subscribe({
        next: (res) => {
          Swal.close(); // Cerramos el loading

          Swal.fire({
            icon: 'success',
            title: 'Se creó con éxito',
            text: 'El pesaje se ha creado con éxito',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#c6a47e' // Tu color accent-gold
          }).then(() => {
            // Redirección al listado después de que el usuario dé clic en OK
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err) => {
          Swal.close(); // Cerramos el loading
          console.error('Error al guardar pesaje:', err);

          // Intentar extraer mensaje de error del backend
          let mensajeError = 'No se pudo completar el registro del pesaje.';
          if (err.error && typeof err.error === 'string') {
            mensajeError = err.error;
          } else if (err.error && err.error.message) {
            mensajeError = err.error.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error en el sistema',
            text: mensajeError,
            confirmButtonColor: '#2b170e',
            confirmButtonText: 'Reintentar'
          });
        }
      });
    }
}
