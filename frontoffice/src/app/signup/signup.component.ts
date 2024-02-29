import { Component } from '@angular/core';
import { CustomerService } from '../services/Customer_service/customer-service.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  // Déclaration des propriétés
  name: string = '';
  sexe: string = '';
  mail: string = '';
  mdp: string = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  signUp(form: NgForm): void {
    console.log('Hello');
    if (form.valid) {
      console.log('Hello 2.0');
      const formData = form.value;
      console.log(formData);

      const customerData = {
        name: formData.name,
        sexe: formData.sexe,
        mail: formData.mail,
        mdp: formData.mdp,
      };
      this.customerService.signUp(customerData).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          // Ajoutez une redirection ou toute autre logique après une inscription réussie
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error("Erreur lors de l'inscription", error);
          // Gérer l'erreur ici
        },
      });
    } else {
      console.error("Le formulaire n'est pas valide");
      // Gérer le cas où le formulaire n'est pas valide
    }
  }
}
