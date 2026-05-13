import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TransportistaService {

  private apiUrl = 'http://localhost:8081/api/transportistas';

  constructor(private http: HttpClient) { }

  listarTransportistas(): Observable<any[]> {
    const token = localStorage.getItem('session_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  obtenerTiposLicencia(): Observable<any[]> {
    const token = localStorage.getItem('session_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>('http://localhost:8081/api/catalogos/9', { headers });
  }

  crearTransportista(data: any): Observable<any> {
    const token = localStorage.getItem('session_token');

    // Forzamos los headers para que no haya duda
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, data, { headers });
  }

  listarTransportistasDisponibles(): Observable<any[]> {
    const token = localStorage.getItem('session_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/disponibles`, { headers });
  }



}
