import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employe_model } from './employe.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  private apiUrl = 'http://localhost:3000/cart';
  constructor(private http: HttpClient) {}
  getAllEmploye(): Observable<Employe_model[]> {
    return this.http
      .get<{ Employe: Employe_model[] }>(`${this.apiUrl}/employe`)
      .pipe(
        map((response) => response.Employe) // Extrait le tableau d'employés de la réponse
      );
  }

  getEmployeById(id: string): Observable<Employe_model> {
    const url = `${this.apiUrl}/employe/${id}`;
    return this.http.get<Employe_model>(url);
  }
  getAvailableHours(employe: Employe_model, date: Date): string[] {
    // Convertir les heures de début et de fin en minutes
    const debutMinutes = employe.debutHeure * 60;
    const finMinutes = employe.finHeure * 60;

    // Créer un tableau pour stocker les horaires disponibles
    let horaires: string[] = [];

    // Parcourir chaque tranche de 15 minutes dans l'horaire de travail de l'employé
    for (let i = debutMinutes; i < finMinutes; i += 15) {
      // Convertir les minutes en format d'heure (HH:MM)
      const heures = Math.floor(i / 60);
      const minutes = i % 60;
      const horaire = `${heures.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;

      // Ajouter l'horaire à la liste des horaires disponibles
      horaires.push(horaire);
    }

    // TODO: Supprimer les horaires qui ne sont pas disponibles en raison des rendez-vous déjà pris

    return horaires;
  }
}
