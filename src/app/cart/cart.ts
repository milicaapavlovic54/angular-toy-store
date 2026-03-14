import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from '../utils';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

   displayedColumns =
    ['slika', 'proizvod', 'cena', 'količina', 'ukupno']

  constructor(public router: Router, public utils: Utils){
    if(!AuthService.getActiveUser()){
      router.navigate(['/login'])
      return
    }
  }

  reloadComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/cart'])
      })
  }
}
