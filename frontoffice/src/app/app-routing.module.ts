import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { SignupComponent } from './signup/signup.component';
import { HistoriqueComponent } from './historique/historique.component';
import { NotificationComponent } from './notification/notification.component';
import { PrestationComponent } from './prestation/prestation.component';
import { CartComponent } from './cart/cart.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { LogoutComponent } from './logout/logout.component';
import { PaiementComponent } from './paiement/paiement.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  //Customer
  { path: 'login', component: LoginpageComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'historique', component: HistoriqueComponent },
  {
    path: 'notification',
    component: NotificationComponent,
  },
  {
    path: 'prestation',
    component: PrestationComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'datepicker',
    component: DatePickerComponent,
  },
  { path: 'logout', component: LogoutComponent },
  { path: 'paiement', component: PaiementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
