import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QRCodeModule } from 'angularx-qrcode'; // <--- CAMBIO: Nombre correcto de la librería

@Component({
  selector: 'app-qr-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    QRCodeModule // Se mantiene igual aquí
  ],
  templateUrl: './qr-dialog.component.html',
  styles: [`
    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      text-align: center;
    }
    .info-resumen {
      margin-top: 15px;
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      width: 100%;
      border: 1px solid #ddd;
    }
    .info-resumen p {
      margin: 5px 0;
      font-size: 14px;
      color: #333;
    }
  `]
})
export class QrDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<QrDialogComponent>,
    // Recibimos los datos: qrData (el string JSON) e info (el objeto parcialidad)
    @Inject(MAT_DIALOG_DATA) public data: { qrData: string, info: any }
  ) {}

  imprimirQR() {
    // Esto abrirá el menú de impresión del navegador
    window.print();
  }
}
