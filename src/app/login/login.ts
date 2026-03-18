import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Alerts } from '../alerts';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string ='user@example.com'
  password: string ='user123'

  constructor(private router: Router){
    if(AuthService.getActiveUser()){
      router.navigate(['/'])
    }
  }

  doLogin(){
    if(AuthService.login(this.email, this.password)){
      this.router.navigate(['/'])
      return
    }
    

    Alerts.error('Pogrešan email ili lozinka!')
    
  }
}
