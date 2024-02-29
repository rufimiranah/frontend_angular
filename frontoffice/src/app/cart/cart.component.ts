import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CartserviceService } from '../services/Cart_service/cartservice.service';
import { EmployeService } from '../services/Employe_service/employe.service';
import { NgModel } from '@angular/forms';
import { Employe_model } from '../services/Employe_service/employe.model';
import { HttpClient } from '@angular/common/http';
import { Sous_Services } from '../services/prestation_service/prestation.model';
import { CookieService } from 'ngx-cookie-service';
import { Rdv_model } from '../services/Rdv_service/Rdv.model';
import { AuthService } from '../services/Auth_service/Auth.service';
import { CustomerService } from '../services/Customer_service/customer-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  employes: Employe_model[] = [];
  placeholder = 'Une employée';
  selectedDate!: Date; // Pour stocker la date sélectionnée
  horaires: string[] = [];
  selectedSousPrestations: Sous_Services[] = [];
  CartserviceService: any;
  minDate: Date;
  selectedEmploye: Employe_model = {
    _id: '',
    id_role: '',
    name: '',
    mail: '',
    password: '',
    debutHeure: 0,
    finHeure: 0,
    description: '',
  };
  rdvs: Rdv_model[] = [];
  selectedEmployeId!: string; // Initialisez selectedEmployeId avec une valeur par défaut
  isEmployeSelected: boolean = false;
  userId!: string | null;
  cartData: any; // Ajoutez cette ligne
  horaire!: number;

  constructor(
    private http: HttpClient,
    private employeService: EmployeService,
    private cartService: CartserviceService,
    ///private cookieService: CookieService,
    /// private authService: AuthService,
    /// private customerService: CustomerService,
    private router: Router
  ) {
    this.selectedDate = new Date(); // Initialisez selectedDate avec la date actuelle
    this.minDate = new Date(); // Initialisez minDate avec la date actuelle
    if (this.selectedHoraire !== undefined) {
      this.horaire = parseInt(this.selectedHoraire);
    } else {
      // Gérer le cas où selectedHoraire est undefined
    }
    // Utilisez this.horaire au lieu de this.selectedHoraire
  }

  ngOnInit(): void {
    console.log('Initialisation de la composante cart');
    this.getAllEmploye();
    this.selectedSousPrestations = this.cartService.getCart();
    //this.customerService.getUserId().subscribe((userId) => {
    this.userId = localStorage.getItem('userId');
    console.log('Id du client:', this.userId);
    // });
    this.cartData = this.cartService.getCart();
    console.log('Données du panier : ', this.cartData);
  }

  getAllEmploye(): void {
    console.log('Récupération de tous les employés');
    this.employeService.getAllEmploye().subscribe(
      (employes) => {
        this.employes = employes.filter(
          (employe) => employe.id_role === '65d80ee3399e76ad23c88924'
        );
        console.log('Employés récupérés avec succès :', this.employes);
      },
      (error) => {
        console.error('Erreur lors de la récupération des Employe :', error);
      }
    );
  }
  //Affichage fotsiny
  convertMinutesToHours(minutes: number): string {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;
    if (hours === 0) {
      return remainingMinutes + ' min';
    } else if (remainingMinutes === 0) {
      return hours + ' h ';
    } else {
      return hours + ' h  ' + remainingMinutes + ' min ';
    }
  }
  ///Raha hanao annulation, tsy mitovy amin'ny clear
  removeFirstFromCart(): void {
    this.cartService.removeFirstFromCart();
    this.selectedSousPrestations = this.cartService.getCart();
  }
  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }
  //Date sélectionnée front
  onDateChange(event: any) {
    console.log('Date sélectionnée:', event);
    this.selectedDate = event;
    this.updateHoraires();
  }

  updateHoraires() {
    console.log(
      "Mise à jour des horaires pour l'employé:",
      this.selectedEmploye
    );
    this.horaires = [];
    this.horaire = 0; // Initialiser this.horaire avec une valeur par défaut
    let heure = this.selectedEmploye.debutHeure;
    while (heure < this.selectedEmploye.finHeure) {
      let rdvExist = this.rdvs.find(
        (rdv: Rdv_model) =>
          rdv.id_employe === this.selectedEmploye._id &&
          rdv.dateRdv.getHours() === heure
      );

      if (!rdvExist) {
        this.horaires.push(this.formatHeure(heure));
        // Mettre à jour this.horaire avec la première heure disponible
        if (this.horaire === 0) {
          this.horaire = heure;
        }
      }
      heure += 0.25; // Ajoute 15 minutes
    }
    console.log('Horaires disponibles:', this.horaires);

    // Mettre à jour this.selectedDate avec la date actuelle si elle n'est pas définie
    if (this.selectedDate === null) {
      this.selectedDate = new Date();
    }
  }

  formatHeure(heure: number): string {
    let h = Math.floor(heure);
    let m = (heure - h) * 60;
    return `${h}:${m < 10 ? '0' : ''}${m}`;
  }

  onEmployeChange(event: any) {
    console.log('Employé sélectionné:', this.selectedEmploye);
    this.isEmployeSelected = event !== null && event !== undefined;
    this.updateHoraires();
  }
  selectedHoraire: string | undefined;

  selectHoraire(horaire: string) {
    console.log('Horaire sélectionné:', horaire);
    this.selectedHoraire = horaire;
    console.log('type de horaire', typeof this.horaire);
  }

  confirmRdvForPrestation(prestation: Sous_Services) {
    // Vérifier si l'ID et la durée sont définis pour la prestation actuelle
    if (!prestation._id || !prestation.delai_detail) {
      console.error('ID ou durée de la prestation non défini');
      return;
    }

    // Convertir selectedHoraire en nombre si c'est une chaîne de caractères
    let horaireHeure, horaireMinute;
    if (typeof this.selectedHoraire === 'string') {
      [horaireHeure, horaireMinute] = this.selectedHoraire
        .split(':')
        .map(Number);
    } else {
      console.error("L'horaire est invalide");
      return;
    }

    this.cartService.setPaymentData({
      userId: this.userId,
      cartData: prestation, // Utiliser la prestation actuelle
      selectedDate: new Date(
        this.selectedDate.setHours(horaireHeure, horaireMinute)
      ), // Utilisez horaireHeure et horaireMinute ici
      horaire: horaireHeure + horaireMinute / 60, // Et ici
      selectedEmploye: this.selectedEmploye,
    });
    console.log(this.cartService.getPaymentData().selectedDate);

    console.log(this.cartService.getPaymentData());

    // Retourner horaireHeure et horaireMinute
    return { horaireHeure, horaireMinute };
  }

  // Ensuite, dans votre méthode confirmRdv :

  confirmRdv() {
    // Définir l'heure de début initiale
    let debutHeure: string = this.selectedHoraire || '0';
    this.selectedSousPrestations.forEach((prestation: Sous_Services) => {
      // Prendre rendez-vous pour la prestation actuelle
      const result = this.confirmRdvForPrestation(prestation);

      // Vérifier si le résultat est défini
      if (!result) {
        console.error(
          'Erreur lors de la prise de rendez-vous pour la prestation'
        );
        return;
      }

      const { horaireHeure, horaireMinute } = result;

      // Mettre à jour l'heure de début pour la prochaine prestation
      let debutHeureNumber = Number(debutHeure.split(':')[0]);
      debutHeureNumber += prestation.delai_detail;
      debutHeure = debutHeureNumber.toString() + ':00';
      console.log(this.selectedDate);
      console.log(horaireHeure, horaireMinute);

      /*   // Vérifier si this.selectedDate est défini
      if (!this.selectedDate) {
        this.selectedDate = new Date(); // Utiliser la date actuelle si elle n'est pas définie
      }*/

      // Créer les données du rendez-vous
      const selectedDate = new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth(),
        this.selectedDate.getDate(),
        horaireHeure,
        horaireMinute
      );
      console.log('ity eo amle be zesta', this.selectedDate);
      // Convertir la date en format ISO sans convertir en UTC
      // Ajouter 3 heures à selectedDate
      selectedDate.setHours(selectedDate.getHours() + 3);
      const isoStringDate = selectedDate.toISOString();

      // Convertir la date en format local
      const dateRdv = selectedDate.toLocaleString();

      const rdvData = {
        id_detail: prestation._id,
        id_utilisateur: this.userId,
        id_employe: this.selectedEmploye._id,
        dateHeureRDV: isoStringDate,
        statut: 'Termine',
      };

      console.log('Rdvdata', rdvData);
      console.log('SelectedDate', this.selectedDate);
      console.log('HoraireHeure et HoraireMinute', horaireHeure, horaireMinute);
      console.log('dateHeureRDV', rdvData.dateHeureRDV);

      // Créer le rendez-vous dia videna le panier
      this.cartService.createRdv(rdvData).subscribe(
        (response) => {
          console.log('Rdv créé avec succès:', response);
          this.cartService.setRdvData(response);
          this.router.navigate(['/paiement']);
          this.cartService.clearCart();
        },
        (error) => {
          console.error('Erreur lors de la création du Rdv:', error);
        }
      );
    });
  }
}
