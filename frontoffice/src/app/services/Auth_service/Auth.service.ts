import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userId: string | undefined;
  private token!: string;

  constructor(private jwtHelper: JwtHelperService) {}

  // Méthode pour enregistrer l'ID de l'utilisateur lors de la connexion

  login(userId: string, token: string): void {
    this.userId = userId;
    this.token = token;
  }
  // Méthode pour obtenir l'ID de l'utilisateur
  getUserId(): string | undefined {
    return this.userId;
  }
  getUserIdFromToken(token: string): string | undefined {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken ? decodedToken.userId : undefined;
  }
  getToken(): string | undefined {
    return this.token;
  }
}
