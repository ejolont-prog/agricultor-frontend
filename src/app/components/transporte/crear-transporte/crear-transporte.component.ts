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

  // Genera años lógicos (Ej: 2027 a 1986)
  generarAnios(): void {
    const anioActual = new Date().getFullYear();
    const anioSiguiente = anioActual + 1;
    const limiteAtras = anioActual - 40;

    for (let i = anioSiguiente; i >= limiteAtras; i--) {
      this.aniosModelo.push(i);
    }
  }

  // En Angular (crear-transporte.component.ts)
  initForm(): void {
    this.transporteForm = this.fb.group({
      placa: ['', [
            Validators.required,
            Validators.pattern(/^[PCMAUTS]\d{3}[A-Z]{3}$/i) // 'i' para que no importe si es mayúscula o minúscula
          ]],
      idTipoPlaca: ['', Validators.required],
      idMarca: ['', Validators.required],
      idLinea: ['', Validators.required],
      idModelo: ['', Validators.required], // <--- Este nombre debe coincidir con el payload.get("idModelo") en Java
      idColor: ['', Validators.required]
    });
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
    if (this.transporteForm.invalid) {
      this.transporteForm.markAllAsTouched();
      return;
    }

    const formValues = this.transporteForm.value;

    // Intentamos buscar el nombre con diferentes variantes de propiedad comunes
    const objetoMarca = this.marcas.find(m => (m.idmarca || m.idMarca || m.id) === formValues.idMarca);
    const objetoLinea = this.lineas.find(l => (l.idlinea || l.idLinea || l.id) === formValues.idLinea);
    const objetoColor = this.colores.find(c => (c.idcolor || c.idColor || c.id) === formValues.idColor);

    const datosParaEnviar = {
      ...formValues,
      // Extraemos el nombre o descripcion, lo que exista
      nombreMarca: objetoMarca?.nombre || objetoMarca?.descripcion || 'N/A',
      nombreLinea: objetoLinea?.nombre || objetoLinea?.descripcion || 'N/A',
      nombreColor: objetoColor?.nombre || objetoColor?.descripcion || 'N/A'
    };

    console.log('DATOS QUE SALEN HACIA EL BACKEND:', datosParaEnviar);

    this.transporteService.crearTransporte(datosParaEnviar).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        alert('Transporte creado con éxito');
        this.router.navigate(['/transportes']);
      },
      error: (err) => {
        const mensaje = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        alert('Error al crear: ' + mensaje);
      }
    });
  }
  cancelar(): void {
    this.router.navigate(['/transporte']);
  }
}
