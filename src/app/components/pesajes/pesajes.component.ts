import { Component, OnInit, OnDestroy } from '@angular/core'; // Añadimos OnDestroy
import { CommonModule } from '@angular/common';
import { PesajeService } from '../../services/pesaje.service';
import { Pesaje } from '../../models/pesaje.model';
import { RouterModule } from '@angular/router';
import { MatButton, MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

// Instalación previa: npm install sockjs-client stompjs
// Cambia los imports actuales por estos
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-pesajes',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButton, MatIcon, MatFabButton],
  templateUrl: './pesajes.component.html',
  styleUrl: './pesajes.component.css'
})
export class PesajesComponent implements OnInit, OnDestroy {
  listado: Pesaje[] = [];
  private stompClient: any;

  constructor(private pesajeService: PesajeService) {}

  ngOnInit(): void {
    this.obtenerDatos();
    this.conectarWebSocket(); // Iniciamos la escucha
  }

  ngOnDestroy(): void {
    // Cerramos la conexión al salir del componente para evitar fugas de memoria
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  obtenerDatos(): void {
    this.pesajeService.obtenerMisPesajes().subscribe({
      next: (data) => {
        this.listado = data;
        console.log('Pesajes cargados:', this.listado);
      },
      error: (err) => {
        console.error('Error al recuperar pesajes', err);
      }
    });
  }

  conectarWebSocket(): void {
    const socket = new SockJS('http://localhost:8081/ws-agricultor');
    this.stompClient = Stomp.over(socket);

    this.stompClient.debug = () => {};

    this.stompClient.connect({}, (frame: any) => {
      console.log('✅ Conectado al canal de actualizaciones de Agricultor');

      this.stompClient.subscribe('/topic/actualizacion-pesaje', (notificacion: any) => {
        const respuesta = JSON.parse(notificacion.body);
        console.log('Datos en tiempo real recibidos por Socket:', respuesta);

        // CORRECCIÓN MULTI-CRITERIO: Busca de forma segura si viene como idpesaje, id, o usando el nocuenta
        const item = this.listado.find(p =>
          (respuesta.idpesaje && p.idpesaje === respuesta.idpesaje) ||
          (respuesta.id && p.idpesaje === respuesta.id) ||
          (respuesta.nocuenta && p.nocuenta === respuesta.nocuenta)
        );

        if (item) {
          // Actualizamos todas las propiedades de la fila dinámicamente
          if (respuesta.nocuenta) item.nocuenta = respuesta.nocuenta;

          // Mapeamos el estado numérico (atrapando el alias 'estado' o el alias devuelto)
          item.estado = respuesta.estado !== undefined ? respuesta.estado : item.estado;

          // Mapeamos el texto descriptivo del estado
          item.nombreEstado = respuesta.nombreEstado || item.nombreEstado;

          console.log('¡Fila encontrada y actualizada visualmente en tiempo real!');
        } else {
          console.warn('Se recibió la notificación por Socket, pero no se encontró la fila en el listado actual.');
        }
      });
    }, (error: any) => {
      console.error('Error en WebSocket:', error);
      setTimeout(() => this.conectarWebSocket(), 5000);
    });
  }
}
