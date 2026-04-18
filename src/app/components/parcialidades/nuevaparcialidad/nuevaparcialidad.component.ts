import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para pipes y directivas básicas

// --- IMPORTA ESTOS MÓDULOS DE MATERIAL ---
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { ParcialidadService } from '../../../services/parcialidad.service';

@Component({
  selector: 'app-nuevaparcialidad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './nuevaparcialidad.component.html',
  styleUrls: ['./nuevaparcialidad.component.css']
})
export class NuevaparcialidadComponent implements OnInit {
  parcialidadForm: FormGroup;
  idPesajeSeleccionado!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private parcialidadService: ParcialidadService
  ) {
    this.parcialidadForm = this.fb.group({
      idpesaje: ['', Validators.required],
      idtransporte: ['', Validators.required],
      idtransportista: ['', Validators.required],
      pesoestimadoparcialidad: [0, [Validators.required, Validators.min(0.1)]],
      estadoparcialidad: [1]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idPesajeSeleccionado = +params['idPesaje'];
      if (this.idPesajeSeleccionado) {
        this.parcialidadForm.patchValue({ idpesaje: this.idPesajeSeleccionado });
      }
    });
  }

  // --- CAMBIA EL NOMBRE AQUÍ PARA QUE COINCIDA CON EL HTML (o viceversa) ---
  crearParcialidad() {
    if (this.parcialidadForm.valid) {
      this.parcialidadService.crear(this.parcialidadForm.value).subscribe({
        next: () => {
          alert('¡Parcialidad guardada con éxito!');
          this.router.navigate(['/pesajes']);
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  regresar() {
    this.router.navigate(['/pesajes']);
  }
}
