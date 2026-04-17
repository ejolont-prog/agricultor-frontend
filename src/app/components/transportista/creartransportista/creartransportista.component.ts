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
      nombreCompleto: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      tipoLicencia: ['', Validators.required],
      fechaVencimientoLicencia: ['', Validators.required]
    });
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

  crearTransportista() {
    if (this.transportistaForm.invalid) {
      this.transportistaForm.markAllAsTouched();
      return; // Este return es para detener la función si el formulario es inválido
    }

    const datosTransportista = this.transportistaForm.value;

    this.transportistaService.crearTransportista(datosTransportista).subscribe({
      next: (res) => {
        console.log('¡Transportista guardado!', res);
        alert('Transportista creado exitosamente');
        // Si quieres limpiar el formulario después de guardar:
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Capturamos el mensaje de nuestras excepciones (CUI, Edad, Licencia)
        let mensajeError = 'Ocurrió un error al procesar la solicitud';

        if (typeof err.error === 'string') {
          mensajeError = err.error;
        } else if (err.error && err.error.message) {
          mensajeError = err.error.message;
        }

        alert(mensajeError);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/transportista']);
  }


}
