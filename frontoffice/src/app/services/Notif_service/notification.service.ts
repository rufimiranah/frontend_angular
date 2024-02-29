import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}
  getOffers() {
    return this.http.get('http://localhost:3000/notif/offres');
  }

  getRdvs(userId: string) {
    return this.http.get('http://localhost:3000/notif/rdvs/' + userId);
  }
}
