import { Component } from '@angular/core';
import { CartserviceService } from '../services/Cart_service/cartservice.service';
import { EmployeService } from '../services/Employe_service/employe.service';
import { PrestationService } from '../services/prestation_service/prestation.service';
//import { AuthService } from '../services/Auth_service/Auth.service';
import { Employe_model } from '../services/Employe_service/employe.model';
import { Sous_Services } from '../services/prestation_service/prestation.model';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.scss'],
})
export class PaiementComponent {
  prestationDetails: Sous_Services[] = []; // Les prestations sélectionnées
  employe!: Employe_model; // L'employé sélectionné
  date!: Date; // La date sélectionnée
  horaire!: string; // L'horaire sélectionné
  totalDuree!: number; // Total durée des prestations
  totalPrix!: number; // Total prix des prestations
  id_utilisateur!: string; // L'ID de l'utilisateur connecté
  totalPrice!: number;
  userId!: string;
  rdvData: any;
  // prestationDetails!: Sous_Services;
  cardCode!: number;
  prestationPrixDetail!: number;

  constructor(
    private employeService: EmployeService,
    private cartService: CartserviceService,
    private prestationService: PrestationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.rdvData = this.cartService.getRdvData();
    console.log('Données de rendez-vous:', this.rdvData);
    console.log('ID Utilisateur:', this.rdvData.id_utilisateur);
    console.log('ID Employé:', this.rdvData.id_employe);
    console.log('ID Détail:', this.rdvData.id_detail);
    console.log('Date et Heure RDV:', this.rdvData.dateHeureRDV);
    console.log('Statut:', this.rdvData.statut);
    console.log('_id:', this.rdvData._id);
    this.totalPrice = this.cartService.getTotalPrice();
    console.log('Prix total:', this.totalPrice);
    this.userId = this.rdvData.id_utilisateur;
    console.log('Utilisateur:', this.userId);
    this.employeService.getEmployeById(this.rdvData.id_employe).subscribe(
      (employe) => {
        console.log("Nom de l'employé:", employe.name);
      },
      (error) => {
        console.error(
          "Erreur lors de la récupération des détails de l'employé:",
          error
        );
      }
    );
    this.prestationService.getSousServiceByid(this.rdvData.id_detail).subscribe(
      (sousService) => {
        if (sousService) {
          this.prestationDetails = Array.isArray(sousService)
            ? sousService
            : [sousService];
          // Mettez à jour prestationPrixDetail avec le prix_detail de la première prestation
          this.prestationPrixDetail = this.prestationDetails[0].prix_detail;
        } else {
          console.error('Aucune sous-prestation trouvée');
        }
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des détails de la prestation:',
          error
        );
      }
    );

    this.prestationService.getSousServiceByid(this.rdvData.id_detail).subscribe(
      (sousService) => {
        // Assurez-vous que la sous-prestation est définie et non null
        if (sousService) {
          // Convertir sousService en tableau si ce n'est pas déjà le cas
          this.prestationDetails = Array.isArray(sousService)
            ? sousService
            : [sousService];
          let totalPrice = 0;
          this.prestationDetails.forEach((prestation) => {
            totalPrice += prestation.prix_detail;
          });
        } else {
          console.error('Aucune sous-prestation trouvée');
        }
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des détails de la prestation:',
          error
        );
      }
    );
  }

  submitPayment() {
    const paymentData = {
      cardCode: this.cardCode,
      rdvId: this.rdvData._id,
      userId: this.userId,
      prestationPrixDetail: this.prestationPrixDetail,
    };
    console.log(paymentData);
    this.http
      .post('http://localhost:3000/customers/paiement', paymentData)
      .subscribe(
        (response) => {
          console.log(
            'Les données de paiement ont été enregistrées avec succès:',
            response
          );
        },
        (error) => {
          console.error(
            "Erreur lors de l'enregistrement des données de paiement:",
            error
          );
        }
      );
  }
}
