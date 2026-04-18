import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pesaje } from '../models/pesaje.model';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class PesajeService {
  // Asegúrate de que coincida con tu @RequestMapping("/api/pesajes")
  private readonly URL = `${API_BASE_URL}/pesajes`;

  constructor(private http: HttpClient) {}

  obtenerMisPesajes(): Observable<Pesaje[]> {
    return this.http.get<Pesaje[]>(this.URL);
  }

  guardar(pesaje: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/pesajes/guardar`, pesaje);
  }
}
