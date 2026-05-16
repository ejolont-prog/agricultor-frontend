import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Necesario para el *ngFor
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

// Imports de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AgricultorService } from '../../services/agricultor.service';

@Component({
  selector: 'app-crear-agricultor',
  standalone: true, // Asegúrate de que esto esté si usas Standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './crear-agricultor.component.html',
  styleUrls: ['./crear-agricultor.component.css']
})
export class CrearAgricultorComponent implements OnInit {
  agricultorForm: FormGroup;
  roles: any[] = [];
  hide = true;

  constructor(
      private fb: FormBuilder,
      private agricultorService: AgricultorService,
      private snackBar: MatSnackBar,
      private router: Router // <-- Inyectamos el Router aquí
    ) {
      this.agricultorForm = this.fb.group({
        // Validators.pattern restringe que solo se guarden letras/espacios o solo números al enviar
        usuario: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)]],
        correo: ['', [Validators.required, Validators.email]],
        contrasena: ['', Validators.required],
        nit: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        idrol: [null, Validators.required]
      });
    }

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles() {
    this.agricultorService.getRoles().subscribe((data: any) => {
      this.roles = data;
    });
  }

  guardar() {
      if (this.agricultorForm.valid) {

        // 1. MOSTRAR LOADING DE PROCESAMIENTO SINCRÓNICO
        Swal.fire({
          title: 'Sincronizando Sistemas',
          text: 'Validando credenciales con Beneficio central...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // 2. ENVIAR PETICIÓN AL BACKEND
        this.agricultorService.crearAgricultorSincronizado(this.agricultorForm.value).subscribe({
          next: (res: any) => {
            Swal.close(); // Cerrar loading

            // Mensaje de éxito Premium
            Swal.fire({
              icon: 'success',
              title: '¡Usuario Creado!',
              text: 'El agricultor se registró y sincronizó en Beneficio correctamente.',
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#2b170e' // Color café oscuro de tu paleta
            }).then(() => {
              this.agricultorForm.reset();
              // Opcional: Redirigir al listado
              // this.router.navigate(['/usuarios']);
            });
          },
          error: (err: any) => {
            Swal.close(); // Cerrar loading

            // Extraer el mensaje de error estructurado del backend
            let mensajeError = 'No se pudo completar la sincronización.';
            if (err.error && err.error.error) {
              mensajeError = err.error.error;
            } else if (typeof err.error === 'string') {
              mensajeError = err.error;
            }

            // Mensaje de Error
            Swal.fire({
              icon: 'error',
              title: 'Validación Fallida',
              text: mensajeError,
              confirmButtonColor: '#2b170e',
              confirmButtonText: 'Corregir Datos'
            });
          }
        });

      } else {
        this.agricultorForm.markAllAsTouched();
        Swal.fire({
          icon: 'warning',
          title: 'Formulario Incompleto',
          text: 'Por favor rellene todos los campos requeridos antes de guardar.',
          confirmButtonColor: '#2b170e'
        });
      }
    }


    // Navega hacia la vista anterior de usuarios
      regresar() {
        this.router.navigate(['/usuarios']);
      }

      // Cancela la operación limpiando el formulario por completo
      cancelar() {
        this.agricultorForm.reset();
        this.router.navigate(['/usuarios']);
      }

      // Bloquea las teclas no deseadas en tiempo real
      filtrarEntrada(event: KeyboardEvent, esNumerico: boolean): void {
        const regex = esNumerico ? /[0-9]/ : /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]/;
        if (!regex.test(event.key)) {
          event.preventDefault();
        }
      }
}
