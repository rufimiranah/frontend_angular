import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss'],
})
export class HistoriqueComponent {
  rdvs: any[] = [];
  userId!: string;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.http
      .get('http://localhost:3000/historiques/rdvHistory/' + userId)
      .subscribe(
        (response: any) => {
          this.rdvs = response as any[]; // Utilisez l'opérateur de cast ici
        },
        (error) => {
          console.error(
            "Erreur lors de la récupération de l'historique des rendez-vous:",
            error
          );
        }
      );
  }

  hoveredRow: number | null = null;

  trackHoveredRow(index: number): void {
    this.hoveredRow = index;
  }

  resetHoveredRow(): void {
    this.hoveredRow = null;
  }

  // Fonction pour générer les étoiles en fonction du rating
  getStars(rating: number): number[] {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      // Remplir les étoiles en fonction du rating
      if (i < rating) {
        stars.push(i);
      } else {
        stars.push(-1); // Utilisez une valeur négative pour les étoiles vides
      }
    }
    return stars;
  }

  // Fonction pour définir le rating d'un rendez-vous
  /*  setRating(appointmentIndex: number, rating: number): void {
    this.appointmentHistory[appointmentIndex].rating = rating;
  }*/
}
