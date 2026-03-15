import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from "@angular/router";
import { MatSelectModule } from '@angular/material/select';
import { Alerts } from '../alerts';
import { UserModel } from '../models/user.model';
import { ToyService } from '../services/toy.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-signup',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    MatSelectModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  user: Partial<UserModel> = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    password: '',
    favToyType: ''
  }

  repeat: string = ''
  toyTypes = signal<string[]>([])

  constructor(public router: Router) {
    ToyService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data.map(t => t.name)))
  }

  doSignup() {
    if (AuthService.existsByEmail(this.user.email!)) {
      Alerts.error('Email je već registrovan')
      return
    }

    if (this.user.email == '' || this.user.firstName == '' || this.user.lastName == '' || this.user.address == '' || this.user.favToyType == '' || this.user.phone == '') {
      Alerts.error('Sva polja moraju biti popunjena')
      return
    }

    if (this.user.password!.length < 6) {
      Alerts.error('Lozinka mora imati barem 6 karaktera')
      return
    }

    if (this.user.password !== this.repeat) {
      Alerts.error('Lozinke se ne poklapaju')
      return
    }

    console.log(this.user)
    AuthService.createUser(this.user)
    this.router.navigate(['/login'])
  }
}
