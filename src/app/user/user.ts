import { Component, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Alerts } from '../alerts';
import { MatListModule } from '@angular/material/list';
import { Utils } from '../utils';
import { UserModel } from '../models/user.model';
import { ToyService } from '../services/toy.service';
import { ToyTypeModel } from '../models/toyType.model';

@Component({
  selector: 'app-user',
  imports: [MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatListModule,
    RouterLink,
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

  public activeUser = AuthService.getActiveUser()
  toyTypes = signal<string[]>([])
  newPassword = ''
  passRepeat = ''
  oldPassword = ''

  constructor(private router: Router, public utils: Utils) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login'])
    }

    ToyService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data.map(t=>t.name)))

  }

  updateUser() {
    Alerts.confirm('Are you sure you want ot update user info?', () => {
      AuthService.updateActiveUser(this.activeUser!)
      Alerts.success('User updated successfuly!')
    })

  }

  updatePassword() {
    Alerts.confirm('Are you sure you want ot change password?', () => {
      if (this.oldPassword != this.activeUser?.password) {
        Alerts.error('Invalid old password')
        return
      }

      if (this.newPassword.length < 6) {
        Alerts.error('Password must be at least 6 characters long')
        return
      }

      if (this.newPassword != this.passRepeat) {
        Alerts.error('Password doesn\'t match')
        return
      }

      if (this.newPassword == this.oldPassword) {
        Alerts.error('New password can\'t be the same as the old one')
        return
      }

      AuthService.updateActiveUserPassword(this.newPassword)
      Alerts.success('Password updated successfuly')
      AuthService.logout()
      this.router.navigate(['/login'])
    })
  }

  getAvatarUrl() {
    return `https://ui-avatars.com/api/?name=${this.activeUser?.firstName}+${this.activeUser?.lastName}`
  }
}



