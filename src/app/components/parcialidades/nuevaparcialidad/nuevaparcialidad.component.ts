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
import { CatalogoService } from '../../../services/catalogo.service';
// Asegúrate de que la ruta hacia tu servicio sea la correcta
import { TransportistaService } from '../../../services/transportista.service';
import {TransporteService} from "../../../services/transporte.service";

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
  unidadesMedida: any[] = [];
  transportistas: any[] = [];
  transportes: any[] = [];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private catalogoService: CatalogoService,
    private parcialidadService: ParcialidadService,
    private transportistaService: TransportistaService,
    private transporteService: TransporteService
  ) {
    this.parcialidadForm = this.fb.group({
      idpesaje: ['', Validators.required],
      idtransporte: ['', Validators.required],
      idtransportista: ['', Validators.required],
      tipomedida: ['', Validators.required],
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
    this.cargarCatalogos();
    this.cargarTransportistas();
    this.cargarTransportes();
  }

  cargarTransportistas() {
    // Usamos el método filtrado que creamos anteriormente
    this.transportistaService.listarTransportistasDisponibles().subscribe({
      next: (data) => {
        this.transportistas = data;
        console.log('Transportistas disponibles cargados:', data);
      },
      error: (err) => console.error('Error al cargar transportistas', err)
    });
  }


  cargarTransportes() {
    // Usamos el método filtrado que creamos anteriormente
    this.transporteService.listarTransporteDisponibles().subscribe({
      next: (data) => {
        this.transportes = data;
        console.log('Transportes disponibles cargados:', data);
      },
      error: (err) => console.error('Error al cargar trnsportes', err)
    });
  }

  cargarCatalogos() {
    // Consumimos el metodo que acabas de crear
    this.catalogoService.getUnidadesMedida().subscribe({
      next: (data) => {
        this.unidadesMedida = data;
        console.log('Unidades de medida cargadas:', data);
      },
      error: (err) => console.error('Error cargando unidades:', err)
    });

  }

  crearParcialidad() {
    console.log('--- Datos enviados ---');
    console.log(this.parcialidadForm.value);

    if (this.parcialidadForm.valid) {
      this.parcialidadService.crear(this.parcialidadForm.value).subscribe({
        next: () => {
          alert('¡Parcialidad guardada con éxito!');
          this.router.navigate(['/pesajes']);
        },
        error: (err) => {
          console.error('Error del servidor:', err);
          alert('Error al guardar: ' + err.message);
        }
      });
    } else {
      console.warn('--- El formulario es INVÁLIDO ---');
      Object.keys(this.parcialidadForm.controls).forEach(key => {
        const controlErrors = this.parcialidadForm.get(key)?.errors;
        if (controlErrors != null) {
          console.log(`Campo "${key}" con errores:`, controlErrors);
        }
      });
      alert('Por favor, completa todos los campos requeridos.');
    }
  }
  regresar() {
    this.router.navigate(['/pesajes']);
  }
}
