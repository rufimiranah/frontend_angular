import { Component } from '@angular/core';
import { CustomerService } from '../services/Customer_service/customer-service.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss'],
})
export class LoginpageComponent {
  mail: string = '';
  mdp: string = '';
  loginError: string = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  login(form: NgForm): void {
    if (form.valid) {
      const formData = form.value;
      console.log('mail inserted:', formData.mail); // Afficher l'mail inséré
      console.log('mdp inserted:', formData.mdp); // Afficher le mot de passe inséré
      this.customerService.login(formData.mail, formData.mdp).subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token); // Stockez le token JWT dans le stockage local
          localStorage.setItem('userId', response.userId);
          this.router.navigate(['/historique']);
        },
        error: (error: any) => {
          console.error('Error during login', error);
          if (error.status === 500) {
            this.loginError =
              'Une erreur interne est survenue. Veuillez réessayer plus tard.';
          } else if (error.status === 401 || error.status === 404) {
            this.loginError = 'Adresse e-mail ou mot de passe incorrect.';
          } else {
            this.loginError =
              'Une erreur inattendue est survenue. Veuillez réessayer plus tard.';
          }
        },
      });
    } else {
      console.error('Invalid form');
      this.loginError =
        'Le formulaire est invalide. Veuillez vérifier votre mail et votre mot de passe.';
    }
  }
}
