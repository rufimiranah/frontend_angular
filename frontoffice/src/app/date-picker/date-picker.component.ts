import { Component } from '@angular/core';
import { CartserviceService } from '../services/Cart_service/cartservice.service';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  selectedDate!: Date;
  cartItems: import('d:/Meanm1/Meanm1/Frontend/Frontoffice/frontoffice/src/app/services/prestation_service/prestation.model').Sous_Services[] =
    [];

  //employeSelectionne: any;
  constructor(private cartService: CartserviceService) {}
  week: Date[] = [];
  appointments: any[] = [];

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
  }
  // Propriété pour stocker l'identifiant de l'employé sélectionné
  /*employes = [
    { id: 1, nom: 'Jean Dupont' },
    { id: 2, nom: 'Marie Martin' },
    { id: 3, nom: 'Pierre Durand' },
    // Ajoutez d'autres employés si nécessaire
  ];*/

  submitForm(): void {
    console.log('Employé sélectionné :', this.employeSelectionne);
    // Vous pouvez utiliser this.employeSelectionne pour accéder à l'identifiant de l'employé sélectionné et le traiter dans votre logique métier
  }
  prestations = [
    { nom: 'Prestation 1', description: 'Description de la prestation 1' },
    { nom: 'Prestation 2', description: 'Description de la prestation 2' },
    { nom: 'Prestation 3', description: 'Description de la prestation 3' },
  ];

  employes = [
    { id: 1, nom: 'Employé 1' },
    { id: 2, nom: 'Employé 2' },
    { id: 3, nom: 'Employé 3' },
  ];

  employeSelectionne!: number;
  dateSelectionnee!: Date;

  validerRendezVous(): void {
    // Effectuez les vérifications nécessaires
    console.log('Employé sélectionné :', this.employeSelectionne);
    console.log('Date sélectionnée :', this.dateSelectionnee);
  }
}
