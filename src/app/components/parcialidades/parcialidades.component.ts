import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ParcialidadService } from '../../services/parcialidad.service';
import { PesajeService } from '../../services/pesaje.service';
import { Parcialidad } from '../../models/parcialidad.model';
import { Pesaje } from '../../models/pesaje.model';

// AGREGADO: Importaciones de Material Dialog
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QrDialogComponent } from '../qr-dialog/qr-dialog.component';

@Component({
  selector: 'app-parcialidades',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatDialogModule // AGREGADO: Importante para que el diálogo funcione
  ],
  templateUrl: './parcialidades.component.html',
  styleUrls: ['./parcialidades.component.css']
})
export class ParcialidadesComponent implements OnInit {
  displayedColumns: string[] = ['idparcialidad', 'idtransporte', 'idtransportista', 'tipomedida', 'peso', 'fecha', 'acciones'];
  dataSource: Parcialidad[] = [];
  idPesajePadre!: number;

  estadoPesajePadre: number = 0;
  cargandoInfo: boolean = true;
  noCuentaPadre: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parcialidadService: ParcialidadService,
    private pesajeService: PesajeService,
    private dialog: MatDialog // AGREGADO: Inyección del servicio de diálogo
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idPesajePadre = +params['idPesaje'];
      if (this.idPesajePadre) {
        this.cargarDatosYValidarEstado();
      }
    });
  }

  cargarDatosYValidarEstado() {
    this.cargandoInfo = true;

    // 1. Cargar parcialidades (esto ya lo tienes)
    this.parcialidadService.listarPorPesaje(this.idPesajePadre).subscribe({
      next: (data) => { this.dataSource = data; },
      error: (err) => console.error('Error al cargar parcialidades:', err)
    });

    // 2. BUSCAR EL PESAJE PARA SACAR EL NO. CUENTA
    this.pesajeService.obtenerMisPesajes().subscribe({
      next: (pesajes: Pesaje[]) => {
        const pesajeActual = pesajes.find(p => p.idpesaje === this.idPesajePadre);

        if (pesajeActual) {
          this.estadoPesajePadre = pesajeActual.estado || 0;
          // CAPTURAMOS EL NO. CUENTA QUE VIENE DE LA VISTA ANTERIOR
          this.noCuentaPadre = pesajeActual.nocuenta || 'Pendiente';
        }

        this.cargandoInfo = false;
      },
      error: (err) => {
        console.error('Error al validar estado:', err);
        this.cargandoInfo = false;
      }
    });
  }

  irANuevaParcialidad() {
    if (this.estadoPesajePadre === 162) {
      console.warn('Acción bloqueada: El pesaje ya está finalizado.');
      return;
    }
    this.router.navigate(['/parcialidades/nueva'], {
      queryParams: { idPesaje: this.idPesajePadre }
    });
  }

  regresar() {
    this.router.navigate(['/pesajes']);
  }

  generarQR(parcialidad: Parcialidad) {
    const datosQR = {
      idParcialidad: parcialidad.idparcialidad,
      idPesaje: parcialidad.idpesaje,
      noCuenta: this.noCuentaPadre, // <--- AHORA EL QR LLEVA EL NO. CUENTA
      placa: (parcialidad as any).placa || 'Sin placa',
      pesoDeclarado: parcialidad.pesoestimadoparcialidad
    };

    this.dialog.open(QrDialogComponent, {
      data: {
        qrData: JSON.stringify(datosQR),
        info: {
          ...parcialidad,
          noCuenta: this.noCuentaPadre // También lo pasamos para mostrarlo en el texto del diálogo
        }
      },
      width: '400px'
    });
  }
}
