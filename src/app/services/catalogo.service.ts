import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config'; // <-- Importa tu configuración

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  // Construimos la URL usando la base de la configuración
  private readonly endpoint = `${API_BASE_URL}/catalogos`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene las unidades de medida (idcatalogo = 11)
   */
  getUnidadesMedida(): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/unidades-medida`);
  }

  /**
   * Obtiene los estados de pesaje (idcatalogo = 12)
   */
  getEstadosPesaje(): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/estados-pesaje`);
  }
}
