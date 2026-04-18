import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcialidad } from '../models/parcialidad.model';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class ParcialidadService {

  // La URL base combinada sería: http://localhost:8081/api/parcialidad
  private resourceUrl = `${API_BASE_URL}/parcialidades`;

  constructor(private http: HttpClient) { }

  // POST: /api/parcialidad/crear
  crear(parcialidad: Parcialidad): Observable<Parcialidad> {
    return this.http.post<Parcialidad>(`${this.resourceUrl}/crear`, parcialidad);
  }

  // GET: /api/parcialidad/pesaje/{idpesaje}
  listarPorPesaje(idpesaje: number): Observable<Parcialidad[]> {
    return this.http.get<Parcialidad[]>(`${this.resourceUrl}/pesaje/${idpesaje}`);
  }

  // GET: /api/parcialidad/{id}
  // Añadido para coincidir con tu obtenerPorId del backend
  obtenerPorId(id: number): Observable<Parcialidad> {
    return this.http.get<Parcialidad>(`${this.resourceUrl}/${id}`);
  }
}
