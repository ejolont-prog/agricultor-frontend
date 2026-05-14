import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransporteService } from '../../../services/transporte.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-transporte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './crear-transporte.component.html',
  styleUrls: ['./crear-transporte.component.css']
})
export class CrearTransporteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private transporteService = inject(TransporteService);

  transporteForm!: FormGroup;

  // Listas para los combos
  tiposPlacas: any[] = [];
  marcas: any[] = [];
  lineas: any[] = [];
  aniosModelo: number[] = []; // Lista generada dinámicamente
  colores: any[] = [];

  ngOnInit(): void {
    this.initForm();
    this.generarAnios();
    this.cargarCatalogosIniciales();
  }

  generarAnios(): void {
    const anioActual = new Date().getFullYear();
    const limiteAtras = 1980; // Límite mínimo solicitado

    this.aniosModelo = []; // Limpiamos el arreglo
    for (let i = anioActual; i >= limiteAtras; i--) {
      this.aniosModelo.push(i);
    }
  }

  // En Angular (crear-transporte.component.ts)
  initForm(): void {
    const anioActual = new Date().getFullYear();
    this.transporteForm = this.fb.group({
      placa: ['', [
                Validators.required,
                Validators.pattern(/^\d{3}[a-zA-Z]{3}$/)
              ]],
      idTipoPlaca: ['', Validators.required],
      idMarca: ['', Validators.required],
      idLinea: ['', Validators.required],
      idModelo: ['', [
            Validators.required,
            Validators.min(1980),
            Validators.max(anioActual)
          ]],
      idColor: ['', Validators.required]
    });
  }

  bloquearEspeciales(event: KeyboardEvent): boolean {
    // Solo permite números y letras
    const regExp = /[a-zA-Z0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!regExp.test(inputChar)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  cargarCatalogosIniciales(): void {
    // 185 = Catálogo de Placas que insertamos en SQL
    this.transporteService.obtenerCatalogos(185).subscribe({
      next: (data) => this.tiposPlacas = data,
      error: (err) => console.error('Error al cargar tipos de placa', err)
    });

    // 5 = Marcas, 8 = Colores
    this.transporteService.obtenerCatalogos(5).subscribe(data => this.marcas = data);
    this.transporteService.obtenerCatalogos(8).subscribe(data => this.colores = data);
  }

  // EVENTO: Cambio de Marca -> Carga Líneas
  onMarcaChange(idMarca: number): void {
    this.lineas = [];
    this.transporteForm.get('idLinea')?.reset();

    if (idMarca) {
      this.transporteService.obtenerCatalogos(6, idMarca).subscribe({
        next: (data) => {
          this.lineas = data;
          this.transporteForm.get('idLinea')?.enable();
        },
        error: (err) => console.error('Error al cargar líneas', err)
      });
    } else {
      this.transporteForm.get('idLinea')?.disable();
    }
  }

  guardar() {
    if (this.transporteForm.valid) {

      // --- 1. PREPARACIÓN DE DATOS (Mapeo idéntico al de transportistas) ---
      const formValues = this.transporteForm.value;

      const objetoMarca = this.marcas.find(m => (m.idmarca || m.idMarca || m.id) === formValues.idMarca);
      const objetoLinea = this.lineas.find(l => (l.idlinea || l.idLinea || l.id) === formValues.idLinea);
      const objetoColor = this.colores.find(c => (c.idcolor || c.idColor || c.id) === formValues.idColor);
      const objetoTipoPlaca = this.tiposPlacas.find(p => (p.id || p.idtipoplaca) === formValues.idTipoPlaca);

      // Construimos el payload exactamente como lo esperan los servicios
      const datosParaEnviar = {
        ...formValues,
        placa: formValues.placa.toUpperCase(),
        nombreMarca: objetoMarca?.nombre || objetoMarca?.descripcion || 'N/A',
        nombreLinea: objetoLinea?.nombre || objetoLinea?.descripcion || 'N/A',
        nombreColor: objetoColor?.nombre || objetoColor?.descripcion || 'N/A',
        nombreTipoPlaca: objetoTipoPlaca?.nombre || 'N/A'
      };

      // --- 2. LOADING INICIAL ---
      Swal.fire({
        title: 'Procesando registro',
        text: 'Comunicando con los servicios centrales...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // --- 3. ENVÍO DEL PAYLOAD ---
      this.transporteService.crearTransporte(datosParaEnviar).subscribe({
        next: (res) => {
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Se creó con éxito',
            text: 'El transporte se ha creado con éxito',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#2c3e50'
          }).then(() => {
            this.transporteForm.reset();
            this.router.navigate(['/dashboard']); // Redirección al listado
          });
        },
        error: (err) => {
          Swal.close();
          let mensaje = 'No se pudo completar el registro del transporte.';
          const errorBackend = err.error;

          // Manejo de errores de placa duplicada o validaciones de negocio
          if (typeof errorBackend === 'string') {
            mensaje = errorBackend;
          } else if (errorBackend && errorBackend.message) {
            mensaje = errorBackend.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonColor: '#2c3e50',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/transporte']);
            }
          });
        }
      });
    } else {
      // --- 4. VALIDACIÓN DE CAMPOS ---
      this.transporteForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Por favor, completa correctamente todos los campos obligatorios.',
        confirmButtonColor: '#2c3e50'
      });
    }
  }
  cancelar(): void {
    this.router.navigate(['/transporte']);
  }
}
