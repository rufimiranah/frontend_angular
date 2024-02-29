import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/internal/operators/tap';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  userId = new BehaviorSubject<string | null>(null);

  logout() {
    localStorage.removeItem('token');
  }

  private baseUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  signUp(customerData: any) {
    return this.http.post(`${this.baseUrl}/signup`, customerData);
  }

  login(mail: string, mdp: string) {
    return this.http
      .post<{ token: string; userId: string }>(`${this.baseUrl}/login`, {
        mail,
        mdp,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.userId.next(response.userId);
        })
      );
  }

  getUserId(): Observable<string | null> {
    return this.userId.asObservable();
  }
}
