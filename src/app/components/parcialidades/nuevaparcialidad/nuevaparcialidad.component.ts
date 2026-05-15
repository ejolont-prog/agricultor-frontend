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
import Swal from 'sweetalert2';

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
    // DENTRO DEL CONSTRUCTOR O DONDE DEFINES EL FORMULARIO:
    this.parcialidadForm = this.fb.group({
      idpesaje: ['', Validators.required],
      // Usamos null en lugar de '' para que el mat-option de selección funcione mejor
      idtransporte: [null, Validators.required],
      idtransportista: [null, Validators.required],
      tipomedida: [null, Validators.required],
      // Peso: Mínimo 1. Si está en null o 0, el formulario será INVÁLIDO.
      pesoestimadoparcialidad: [null, [Validators.required, Validators.min(1)]],
      estadoparcialidad: [1]
    });
  }

  soloNumeros(event: any): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      // Permitir números (48-57) y el punto decimal (46)
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
        return false;
      }
      return true;
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
      if (this.parcialidadForm.invalid) {
        Swal.fire({
          icon: 'warning',
          title: 'Formulario Incompleto',
          text: 'Por favor, llena todos los campos correctamente.',
          confirmButtonColor: '#2b170e'
        });
        return;
      }

      // --- LOADING ---
      Swal.fire({
        title: 'Registrando Parcialidad',
        text: 'Validando datos enviados',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.parcialidadService.crear(this.parcialidadForm.value).subscribe({
        next: () => {
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Se creó con éxito',
            text: 'La parcialidad se ha creado con éxito',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#c6a47e'
          }).then(() => {
            // Regresamos al detalle del pesaje padre
            this.router.navigate(['/pesajes'], {
              queryParams: { idPesaje: this.idPesajeSeleccionado }
            });
          });
        },
        error: (err) => {
          Swal.close();
          console.error('Error del servidor:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: err.error?.message || 'Hubo un problema con la conexión al servidor.',
            confirmButtonColor: '#2b170e'
          });
        }
      });
    }

  regresar() {
    this.router.navigate(['/pesajes']);
  }
}
