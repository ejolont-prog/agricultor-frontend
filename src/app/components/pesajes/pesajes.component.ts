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
    // La URL debe ser la misma que configuraste en el registerStompEndpoints del Backend
    const socket = new SockJS('http://localhost:8081/ws-agricultor');
    this.stompClient = Stomp.over(socket);

    // Opcional: Quitar los mensajes de debug en consola
    this.stompClient.debug = () => {};

    this.stompClient.connect({}, (frame: any) => {
      console.log('✅ Conectado al canal de actualizaciones de Agricultor');

      // Nos suscribimos al tópico que definimos en el Service de Java
      this.stompClient.subscribe('/topic/actualizacion-pesaje', (notificacion: any) => {
        const respuesta = JSON.parse(notificacion.body);
        const item = this.listado.find(p => p.idpesaje === respuesta.id);

        if (item) {
          item.nocuenta = respuesta.nocuenta;
          item.estado = respuesta.estado; // Aquí llega el 163
          item.nombreEstado = respuesta.nombreEstado; // Aquí llega "CUENTA ASIGNADA"
          console.log('Fila actualizada visualmente');
        }
      });
    }, (error: any) => {
      console.error('Error en WebSocket:', error);
      // Intento de reconexión automática a los 5 segundos
      setTimeout(() => this.conectarWebSocket(), 5000);
    });
  }
}
