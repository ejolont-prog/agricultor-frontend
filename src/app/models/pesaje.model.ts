export interface Pesaje {
  idpesaje?: number;
  nocuenta: string;
  pesototalestimado: number;
  idunidadmedida: number;
  cantidadparcialidades: number;
  estado?: number;
  // Campos de auditoría (opcionales para el front, el back los llena)
  idperfilagricultor?: number;
  creadopor?: number;
  fechacreacion?: Date;
  eliminado?: boolean;
  nombreEstado?: string;
}
