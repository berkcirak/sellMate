import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/user'

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<string>{
    return this.http.post(`${this.baseUrl}/login`, credentials, { responseType: 'text' });
  }

}
