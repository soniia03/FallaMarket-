import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ApiResponse, Traje } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/v1/users';

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/get/all`);
  }

  // Obtener usuarios activos
  getActiveUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/get/active`);
  }

  // Obtener usuario por ID
  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/get/${id}`);
  }

  // Crear usuario
  createUser(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/post`, user);
  }

  // Actualizar usuario
  updateUser(id: string, user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/update/${id}`, user);
  }

  // Eliminar usuario
  deleteUser(id: string): Observable<ApiResponse<User>> {
    return this.http.delete<ApiResponse<User>>(`${this.apiUrl}/delete/${id}`);
  }

  // Buscar usuario por email
  getUserByEmail(email: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/email/${encodeURIComponent(email)}`);
  }

  // Obtener trajes de un usuario
  getUserProducts(id: string): Observable<ApiResponse<Traje[]>> {
    return this.http.get<ApiResponse<Traje[]>>(`${this.apiUrl}/products/${id}`);
  }

  // Desactivar usuario
  deactivateUser(id: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/deactivate/${id}`, {});
  }

  // Reactivar usuario
  reactivateUser(id: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/reactivate/${id}`, {});
  }
}