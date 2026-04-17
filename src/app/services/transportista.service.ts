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
    // 1. Recuperamos el token del Local Storage (donde lo guarda tu Login)
    const token = localStorage.getItem('session_token');

    // 2. Creamos los encabezados con el Bearer Token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Hacemos la petición GET enviando los headers
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  obtenerTiposLicencia(): Observable<any[]> {
    const token = localStorage.getItem('session_token');

    // LOG PARA DEPURAR: Abre la consola y verifica que no salga "null" o "undefined"
    console.log('Token enviado al catálogo:', token);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>('http://localhost:8081/api/catalogos/9', { headers });
  }

  crearTransportista(data: any) {
    const token = localStorage.getItem('session_token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
}
