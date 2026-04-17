import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../services/catalogo.service';
import { PesajeService } from '../../../services/pesaje.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-crear-pesaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  pesoIngresado: number = 0; // Para el input de "Peso Total Actual"
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
    // Validaciones mínimas antes de enviar
    if (!this.unidadSeleccionada) {
      alert('Debe seleccionar una unidad de medida');
      return;
    }
    if (this.pesoIngresado <= 0) {
      alert('El peso debe ser mayor a 0');
      return;
    }

    // 3. Mapeo del objeto según tu Entidad Java (Pesaje.java)
    const dataParaGuardar = {
      pesototalestimado: this.pesoIngresado,
      idunidadmedida: this.unidadSeleccionada,
      estado: this.estadoSeleccionado
      // Nota: creadopor, fechacreacion, idperfilagricultor, etc.,
      // los maneja el backend automáticamente con el token.
    };

    console.log('Enviando objeto al backend:', dataParaGuardar);

    // 4. Llamada al servicio para guardar
    this.pesajeService.guardar(dataParaGuardar).subscribe({
      next: (res) => {
        console.log('Pesaje guardado correctamente:', res);
        // Regresamos a la tabla de pesajes
        this.router.navigate(['/pesajes']);
      },
      error: (err) => {
        console.error('Error al guardar pesaje:', err);
        alert('Hubo un error al procesar el registro. Intente de nuevo.');
      }
    });
  }
}
