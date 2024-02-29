import { Component } from '@angular/core';
import { CustomerService } from '../services/Customer_service/customer-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.customerService.logout();
    localStorage.removeItem('cart'); // Supprime les données du panier
    this.router.navigate(['/']); // Déconnexion lors de l'initialisation du composant
  }
}
