import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transporte } from '../models/transporte.model'; // Importas el modelo

@Injectable({ providedIn: 'root' })
export class TransporteService {
  private apiUrl = 'http://localhost:8080/api/transportes';

  constructor(private http: HttpClient) { }

  getTransportes(): Observable<Transporte[]> {
    return this.http.get<Transporte[]>(this.apiUrl);
  }
}
