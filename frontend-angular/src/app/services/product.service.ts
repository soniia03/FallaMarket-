import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { Traje, BackendResponse, MaterialInfo, TipoTrajeInfo } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TrajeService {
  private apiUrl = 'http://localhost:3000/api/v1/trajes';

  constructor(private http: HttpClient) { }

  // Obtener todos los trajes
  getAllTrajes(): Observable<Traje[]> {
    return this.http.get<BackendResponse<Traje[]>>(this.apiUrl).pipe(
      map(response => {
        // El backend devuelve {status: array_of_trajes}
        if (Array.isArray(response.status)) {
          return response.status;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error obteniendo trajes:', error);
        return [];
      })
    );
  }

  // Obtener traje por ID
  getTrajeById(id: string): Observable<Traje | null> {
    return this.http.get<BackendResponse<Traje>>(`${this.apiUrl}/traje/${id}`).pipe(
      map(response => {
        // El backend devuelve {status: 'mensaje', data: traje}
        if (response.data) {
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error obteniendo traje:', error);
        return [null];
      })
    );
  }

  // Crear nuevo traje
  createTraje(traje: Omit<Traje, '_id' | 'createdAt' | 'updatedAt'>): Observable<Traje | null> {
    return this.http.post<BackendResponse<Traje>>(`${this.apiUrl}/anadir`, traje).pipe(
      map(response => {
        // El backend devuelve {status: 'mensaje', data: traje}
        if (response.data) {
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error creando traje:', error);
        return [null];
      })
    );
  }

  // Actualizar traje
  updateTraje(id: string, traje: Omit<Traje, '_id' | 'createdAt' | 'updatedAt'>): Observable<Traje | null> {
    return this.http.put<BackendResponse<Traje>>(`${this.apiUrl}/editar/${id}`, traje).pipe(
      map(response => {
        // El backend devuelve {status: 'mensaje', data: traje}
        if (response.data) {
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error actualizando traje:', error);
        return [null];
      })
    );
  }

  // Eliminar traje
  deleteTraje(id: string): Observable<boolean> {
    return this.http.delete<BackendResponse<any>>(`${this.apiUrl}/eliminar/${id}`).pipe(
      map(response => {
        // El backend devuelve {status: 'Traje eliminado correctamente'}
        return typeof response.status === 'string' && response.status.includes('eliminado');
      }),
      catchError(error => {
        console.error('Error eliminando traje:', error);
        return [false];
      })
    );
  }

  // Obtener materiales disponibles para trajes falleros
  getMateriales(): MaterialInfo[] {
    return [
      { key: 'seda', label: 'Seda', icon: 'fas fa-gem', color: 'primary' },
      { key: 'brocado', label: 'Brocado', icon: 'fas fa-crown', color: 'warning' },
      { key: 'terciopelo', label: 'Terciopelo', icon: 'fas fa-star', color: 'info' },
      { key: 'raso', label: 'Raso', icon: 'fas fa-circle', color: 'success' },
      { key: 'tafetan', label: 'Tafetán', icon: 'fas fa-square', color: 'secondary' },
      { key: 'damasco', label: 'Damasco', icon: 'fas fa-diamond', color: 'danger' },
      { key: 'algodon', label: 'Algodón', icon: 'fas fa-leaf', color: 'light' },
      { key: 'lino', label: 'Lino', icon: 'fas fa-seedling', color: 'dark' },
      { key: 'otro', label: 'Otro', icon: 'fas fa-question', color: 'muted' }
    ];
  }

  // Obtener tipos de trajes (para clasificación)
  getTiposTraje(): TipoTrajeInfo[] {
    return [
      { key: 'fallero', label: 'Traje Fallero', class: 'bg-primary' },
      { key: 'fallera', label: 'Traje Fallera', class: 'bg-info' },
      { key: 'infantil', label: 'Traje Infantil', class: 'bg-success' },
      { key: 'regional', label: 'Traje Regional', class: 'bg-warning' },
      { key: 'historico', label: 'Traje Histórico', class: 'bg-secondary' }
    ];
  }

  // Buscar trajes por nombre
  searchTrajesByNombre(searchTerm: string): Observable<Traje[]> {
    return this.getAllTrajes().pipe(
      map(trajes => 
        trajes.filter(traje => 
          traje.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          traje.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
          traje.propietario.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  // Buscar trajes por material
  searchTrajesByMaterial(material: string): Observable<Traje[]> {
    return this.getAllTrajes().pipe(
      map(trajes => 
        trajes.filter(traje => 
          traje.material.toLowerCase().includes(material.toLowerCase())
        )
      )
    );
  }

  // Buscar trajes por propietario
  searchTrajesByPropietario(propietario: string): Observable<Traje[]> {
    return this.getAllTrajes().pipe(
      map(trajes => 
        trajes.filter(traje => 
          traje.propietario.toLowerCase().includes(propietario.toLowerCase())
        )
      )
    );
  }

  // Validar datos de traje
  validateTraje(traje: Partial<Traje>): string[] {
    const errors: string[] = [];

    if (!traje.nombre || traje.nombre.trim().length === 0) {
      errors.push('El nombre es obligatorio');
    } else if (traje.nombre.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    if (!traje.material || traje.material.trim().length === 0) {
      errors.push('El material es obligatorio');
    }

    if (!traje.propietario || traje.propietario.trim().length === 0) {
      errors.push('El propietario es obligatorio');
    }

    return errors;
  }
}