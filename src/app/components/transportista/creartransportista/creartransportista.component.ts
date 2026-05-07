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
     return;
   }

   const formValues = this.transportistaForm.value;

   // CORRECCIÓN: Usamos 'tipoLicencia' que es el nombre que pusiste en el fb.group
   const idSeleccionado = formValues.tipoLicencia;

   // Buscamos el nombre en la lista
   const licenciaEncontrada = this.tiposLicencia.find(l =>
     (l.id == idSeleccionado) || (l.idcatalogo == idSeleccionado)
   );

   const datosParaEnviar = {
     cui: formValues.cui,
     nombreCompleto: formValues.nombreCompleto,
     fechaNacimiento: formValues.fechaNacimiento,
     idTipoLicencia: idSeleccionado, // Ahora sí llevará el ID numérico
     nombreTipoLicencia: licenciaEncontrada ? licenciaEncontrada.nombre : 'No especificada',
     fechaVencimientoLicencia: formValues.fechaVencimientoLicencia
   };

   console.log('Datos enviados:', datosParaEnviar);

   this.transportistaService.crearTransportista(datosParaEnviar).subscribe({
     next: (res: any) => {
       alert('Transportista creado exitosamente');
       this.router.navigate(['/transportistas']);
     },
     error: (err: any) => {
       const mensaje = typeof err.error === 'string' ? err.error : 'Error de validación';
       alert(mensaje);
     }
   });
 }

  cancelar(): void {
    this.router.navigate(['/transportista']);
  }


}
