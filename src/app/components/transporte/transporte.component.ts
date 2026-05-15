import { Component, OnInit, OnDestroy, inject } from '@angular/core'; // 1. Importamos OnDestroy
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TransporteService } from '../../services/transporte.service';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// Websockets
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.css']
})
export class TransporteComponent implements OnInit, OnDestroy { // 2. Implementar OnDestroy
  private transporteService = inject(TransporteService);
  private router = inject(Router);

  private stompClient: any; // 3. Cliente para WebSocket

  displayedColumns: string[] = [
    'placa',
    'marca',
    'color',
    'linea',
    'modelo',
    'estado',
    'disponible',
    'pesaje'
  ];

  dataSource: any[] = [];

  ngOnInit(): void {
    this.cargarTransportes();
    this.conectarWebSocket(); // 4. Iniciar escucha al cargar
  }

  ngOnDestroy(): void {
    // 5. Desconectar al salir para evitar fugas de memoria
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  cargarTransportes(): void {
    this.transporteService.listarTransportes().subscribe({
      next: (data: any[]) => {
        this.dataSource = data.map((t: any) => ({
          placa: t.placa,
          marca: t.marca || 'N/A',
          color: t.color || 'N/A',
          linea: t.linea || 'N/A',
          modelo: t.modelo || 'N/A',
          estado: t.estado || 'Pendiente',
          disponible: t.disponible ? 'Sí' : 'No',
          pesaje: t.nocuenta ? t.nocuenta : 'No'
        }));
      },
      error: (err: any) => console.error('Error al cargar transportes:', err)
    });
  }

  conectarWebSocket(): void {
    const socket = new SockJS('http://localhost:8081/ws-agricultor');
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = () => {}; // Desactiva logs molestos en consola

    this.stompClient.connect({}, (frame: any) => {
      console.log('✅ Conectado al canal de actualizaciones de Transportes');

      // 6. Suscribirse al tópico (Asegúrate que el back envíe a /topic/actualizacion-transporte)
      this.stompClient.subscribe('/topic/actualizacion-transporte', (notificacion: any) => {
        const respuesta = JSON.parse(notificacion.body);

        // Buscamos si el transporte existe en el listado actual por placa
        const item = this.dataSource.find(t => t.placa === respuesta.placa);

        if (item) {
          // Actualizamos los valores que vienen del socket
          item.estado = respuesta.estado || item.estado;
          item.disponible = respuesta.disponible !== undefined ? (respuesta.disponible ? 'Sí' : 'No') : item.disponible;
          item.pesaje = respuesta.nocuenta ? respuesta.nocuenta : item.pesaje;

          // Forzar refresco visual de la tabla
          this.dataSource = [...this.dataSource];
          console.log('Transporte actualizado vía WebSocket');
        } else {
          // Si no existe (es nuevo), podrías volver a cargar o añadirlo al array
          this.cargarTransportes();
        }
      });
    }, (error: any) => {
      console.error('Error en WebSocket Transportes:', error);
      setTimeout(() => this.conectarWebSocket(), 5000); // Reintento
    });
  }

  irACrear(): void {
    this.router.navigate(['/transporte/crear']);
  }

  regresar(): void {
    this.router.navigate(['/']);
  }
}
