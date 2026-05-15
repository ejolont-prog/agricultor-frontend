import { Component, OnInit, OnDestroy } from '@angular/core'; // 1. Añadimos OnDestroy
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransportistaService } from '../../services/transportista.service';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// Websockets
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-transportista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './transportista.component.html',
  styleUrls: ['./transportista.component.css']
})
export class TransportistaComponent implements OnInit, OnDestroy { // 2. Implementamos OnDestroy

  private stompClient: any; // 3. Cliente WebSocket

  displayedColumns: string[] = [
    'cui',
    'nombre',
    'tipoLicencia',
    'fechaVencimiento',
    'estado',
    'disponible',
    'pesaje'
  ];

  dataSource: any[] = [];

  constructor(private transportistaService: TransportistaService) {}

  ngOnInit(): void {
    this.cargarTransportistas();
    this.conectarWebSocket(); // 4. Iniciar escucha
  }

  ngOnDestroy(): void {
    // 5. Limpieza al cerrar componente
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  cargarTransportistas(): void {
    this.transportistaService.listarTransportistas().subscribe({
      next: (data: any[]) => {
        this.dataSource = data.map(t => ({
          cui: t.cui,
          nombre: t.nombrecompleto,
          tipoLicencia: t.nombre_licencia,
          fechaVencimiento: t.fechavencimientolicencia,
          estado: t.nombre_estado,
          disponible: t.disponible ? 'Sí' : 'No',
          pesaje: t.nocuenta ? t.nocuenta : 'No'
        }));
      },
      error: (err) => console.error('Error al cargar transportistas:', err)
    });
  }

  conectarWebSocket(): void {
    const socket = new SockJS('http://localhost:8081/ws-agricultor');
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = () => {};

    this.stompClient.connect({}, (frame: any) => {
      console.log('✅ Conectado al canal de actualizaciones de Transportistas');

      // 6. Suscribirse al tópico de transportistas
      this.stompClient.subscribe('/topic/actualizacion-transportista', (notificacion: any) => {
        const respuesta = JSON.parse(notificacion.body);

        // Buscamos por CUI
        const index = this.dataSource.findIndex(t => t.cui === respuesta.cui);

        if (index !== -1) {
          // Actualizar datos existentes
          if (respuesta.nombreEstado) this.dataSource[index].estado = respuesta.nombreEstado;
          if (respuesta.disponible !== undefined) this.dataSource[index].disponible = respuesta.disponible ? 'Sí' : 'No';
          if (respuesta.nocuenta) this.dataSource[index].pesaje = respuesta.nocuenta;

          // Refrescar tabla
          this.dataSource = [...this.dataSource];
          console.log('Transportista actualizado en tiempo real');
        } else {
          // Si es nuevo o no está en la lista, recargamos
          this.cargarTransportistas();
        }
      });
    }, (error: any) => {
      console.error('Error WebSocket Transportistas:', error);
      setTimeout(() => this.conectarWebSocket(), 5000);
    });
  }
}
