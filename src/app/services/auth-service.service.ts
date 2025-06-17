import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      pseudo: string;
      first_name: string;
      last_name: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(pseudo: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { pseudo, password })
      .pipe(
        tap((response) => {
          if (response.success) {
            localStorage.setItem(this.tokenKey, response.data.token);
          }
        })
      );
  }

  getToken(): string | null {
    // Check if we are in a browser environment
    // and localStorage is available
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}