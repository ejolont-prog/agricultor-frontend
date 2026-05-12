export interface Parcialidad {
  idparcialidad?: number;
  idpesaje: number;
  idtransporte: number;
  idtransportista: number;

  // Agrega estos dos objetos para que el HTML los reconozca
  transporte?: {
    idtransporte: number;
    placa: string;
  };
  transportista?: {
    idtransportista: number;
    nombreCompleto: string;
    cui: string;
  };

  pesoestimadoparcialidad: number;
  estadoparcialidad: number;
  textorechazado?: string;
  tipomedida?: string;
  fechacreacion?: string | Date;
  eliminado?: boolean;
}
