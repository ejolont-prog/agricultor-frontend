import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportistaService } from '../../../services/transportista.service';
import { Observable } from 'rxjs';
// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-creartransportista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './creartransportista.component.html',
  styleUrl: './creartransportista.component.css'
})
export class CrearTransportistaComponent implements OnInit {
  private transportistaService = inject(TransportistaService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  transportistaForm!: FormGroup;
  maxFechaNac = new Date();
  tiposLicencia: any[] = [];

  ngOnInit(): void {
    this.cargarTiposLicencia();
    this.transportistaForm = this.fb.group({
      cui: ['', [
              Validators.required,
              Validators.pattern('^[0-9]{13}$')
            ]],
      nombreCompleto: ['', [Validators.required, this.validarNombreApellido()]],
      fechaNacimiento: ['', Validators.required],
      tipoLicencia: ['', Validators.required],
      fechaVencimientoLicencia: ['', Validators.required]
    });
  }

  validarNombreApellido(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value ? control.value.trim() : '';
      if (!valor) return null;

      // Dividimos por espacios y filtramos palabras que tengan 3 o más caracteres
      const palabras = valor.split(/\s+/).filter((p: string) => p.length >= 3);

      // Si hay menos de 2 palabras válidas, retornamos el error
      return palabras.length >= 2 ? null : { nombreInvalido: true };
    };
  }

  cargarTiposLicencia(): void {
    this.transportistaService.obtenerTiposLicencia().subscribe({
      next: (data) => {
        console.log('Licencias recibidas:', data);
        this.tiposLicencia = data;
      },
      error: (err) => {
        console.error('Error al cargar licencias', err);
      }
    });
  }

  onlyNumbers(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyLetters(event: KeyboardEvent) {
    // Permitir letras (mayúsculas y minúsculas), tildes, eñes y espacios
    const pattern = /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  filterDateInput(event: KeyboardEvent): void {
    // Teclas permitidas: Números, retroceso, tab, flechas, suprimir y los separadores / o -
    const allowedKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '/', '-'
    ];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  registrarTransportista() {
    if (this.transportistaForm.valid) {

      // --- 1. PREPARACIÓN DE DATOS (Mapeo para el Backend) ---
      const formValue = this.transportistaForm.value;

      // Buscamos el nombre de la licencia en la lista que cargamos del catálogo
      const licenciaSeleccionada = this.tiposLicencia.find(l => l.id === formValue.tipoLicencia);

      // Creamos el objeto exactamente como lo espera el DTO de Java
      const payload = {
        cui: formValue.cui,
        nombreCompleto: formValue.nombreCompleto,
        fechaNacimiento: formValue.fechaNacimiento,
        fechaVencimientoLicencia: formValue.fechaVencimientoLicencia,
        idTipoLicencia: formValue.tipoLicencia, // <--- ID para Agricultor
        nombreTipoLicencia: licenciaSeleccionada ? licenciaSeleccionada.nombre : null // <--- Texto para Beneficio
      };

      // 2. Loading inicial
      Swal.fire({
        title: 'Procesando registro',
        text: 'Comunicando con los servicios centrales...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // --- 3. ENVÍO DEL PAYLOAD (No el form.value directo) ---
      this.transportistaService.crearTransportista(payload).subscribe({
        next: (res) => {
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Se creó con éxito',
            text: 'El transportista se ha creado con éxito',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#2c3e50'
          }).then(() => {
            this.transportistaForm.reset();
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err) => {
          Swal.close();
          let titulo = 'Error';
          let mensaje = 'No se pudo completar el registro.';
          const errorBackend = err.error;

          if (typeof errorBackend === 'string') {
            mensaje = errorBackend;
          } else if (errorBackend && errorBackend.message) {
            mensaje = errorBackend.message;
          }

          Swal.fire({
            icon: 'error',
            title: titulo,
            text: mensaje,
            confirmButtonColor: '#2c3e50',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/transportista']);
            }
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Por favor, completa correctamente todos los campos obligatorios.',
        confirmButtonColor: '#2c3e50'
      });
    }
  }
  cancelar(): void {
    this.router.navigate(['/transportista']);
  }


}
