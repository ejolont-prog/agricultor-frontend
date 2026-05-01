import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {
  // Usamos el puerto 8081 que descubrimos en tu properties
  private apiUrl = 'http://localhost:8081/api/transportes';

  constructor(private http: HttpClient) { }

  // Método para obtener el token (centralizado para no repetir código)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('session_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  obtenerCatalogos(idCatalogo: number, transicion?: number): Observable<any[]> {
    let params = new HttpParams().set('idCatalogo', idCatalogo.toString());
    if (transicion) {
      params = params.set('transicion', transicion.toString());
    }
    // Enviamos los headers manualmente como en transportistas
    return this.http.get<any[]>(`${this.apiUrl}/catalogos-jerarquia`, {
      headers: this.getHeaders(),
      params
    });
  }

  listarTransportes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-transportes`, {
      headers: this.getHeaders()
    });
  }

  crearTransporte(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, data, {
      headers: this.getHeaders()
    });
  }

  listarTransporteDisponibles(): Observable<any[]> {
    const token = localStorage.getItem('session_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/disponibles`, { headers });
  }
}
