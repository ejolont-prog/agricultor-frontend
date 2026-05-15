import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Esto permite que el servicio sea inyectable en toda la app
})
export class AgricultorService {
  // Ajusta el puerto según tu backend de AGRICULTOR
  private API_URL = 'http://localhost:8081/api/usuarios';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any[]> {
    // Asegúrate de que esta URL sea la de AGRICULTOR
    return this.http.get<any[]>('http://localhost:8081/api/usuarios/roles');
  }

  crearAgricultorSincronizado(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/crear-sincronizado`, data);
  }
}
