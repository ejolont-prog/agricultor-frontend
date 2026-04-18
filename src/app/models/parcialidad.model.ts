export interface Parcialidad {
  idparcialidad?: number;
  idpesaje: number;
  idtransporte: number;
  idtransportista: number;
  pesoestimadoparcialidad: number;
  estadoparcialidad: number;
  textorechazado?: string;
  tipomedida?: string;
  qr?: string;
  faltante?: number;
  sobrante?: number;
  fechacreacion?: string | Date; // <--- Agrega esta línea
  eliminado?: boolean;
}
