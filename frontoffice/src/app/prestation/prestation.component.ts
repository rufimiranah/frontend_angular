import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PrestationService } from '../services/prestation_service/prestation.service';
import {
  Services,
  Sous_Services,
} from '../services/prestation_service/prestation.model';
import { CartserviceService } from '../services/Cart_service/cartservice.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-prestation',
  templateUrl: './prestation.component.html',
  styleUrls: ['./prestation.component.scss'],
})
export class PrestationComponent implements OnInit {
  loading = false;
  prestations: Services[] = [];
  sousPrestations: Sous_Services[] = [];

  images: string[] = [
    './assets/images/image1.png',
    './assets/images/image2.png',
    './assets/images/image3.png',
    './assets/images/image4.png',
  ];
  i: any;
  selectedPrestation!: Services;
  selectedSousPrestations: Sous_Services[] = [];
  // Assurez-vous que prestations est un tableau

  constructor(
    private prestationService: PrestationService,
    private cartService: CartserviceService,
    private cd: ChangeDetectorRef,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getPrestations();

    const savedCartItems = this.cookieService.get('cartItems');
    if (savedCartItems) {
      this.selectedSousPrestations = JSON.parse(savedCartItems);
    }
  }

  getPrestations(): void {
    this.prestationService.getAllPrestations().subscribe((response: any) => {
      this.prestations = response.prestations;
      console.log('Response from API:', response);
    });
  }

  selectPrestation(prestation: Services): void {
    this.selectedPrestation = prestation;
    this.loadSousPrestations(prestation._id);
  }

  loadSousPrestations(id_service: string): void {
    this.prestationService
      .getSousPrestations(id_service)
      .subscribe((response: any) => {
        this.sousPrestations = response.map((item: any) => ({
          ...item,
          inCart: false,
        }));
        this.sousPrestations = response; // affecter directement la réponse de l'API à sousPrestations
        this.cd.detectChanges();
        console.log('Response from API:', response);
        console.log('sousPrestations:', this.sousPrestations);
      });
  }
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
  addToCart(sousPrestation: Sous_Services): void {
    if (sousPrestation.inCart) {
      sousPrestation.inCart = false;
      this.cartService.removeFirstFromCart();
    } else {
      sousPrestation.inCart = true;
      this.cartService.addToCart(sousPrestation);
    }
    const cartItems = this.cartService.getCart(); // Obtenez les articles du panier
    this.cookieService.set('cartItems', JSON.stringify(cartItems)); // Sauvegardez les articles du panier dans un cookie
    console.log(this.cartService.getCart());
  }
}
