import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Utils } from '../utils';
import { AuthService } from '../services/auth.service';
import { ReservationModel } from '../models/reservation.model';
import { Alerts } from '../alerts';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  clientWidth: number = document.documentElement.clientWidth
  displayedColumns: string[] = []
  reservations: ReservationModel[] = [];



  constructor(public router: Router, public utils: Utils) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login'])
      return
    }

    this.resizeTable()
    this.loadReservations()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.clientWidth = (event.target as Window).document.documentElement.clientWidth;
    this.resizeTable()
  }

  resizeTable() {
    if (this.clientWidth >= 1010) {
      this.displayedColumns = ['slika', 'proizvod', 'opis', 'tip', 'uzrast', 'cena', 'količina', 'ukupno', 'opcije']
      return
    }

    if (this.clientWidth >= 840) {
      this.displayedColumns = ['slika', 'proizvod', 'opis', 'cena', 'količina', 'ukupno', 'opcije']
      return
    }

    if (this.clientWidth >= 580) {
      this.displayedColumns = ['proizvod', 'cena', 'količina', 'ukupno', 'opcije']
      return
    }

    if (this.clientWidth < 580) {
      this.displayedColumns = ['proizvod', 'ukupno', 'opcije']
    }
  }

  reloadComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/cart'])
      })
  }

  loadReservations() {
    this.reservations = AuthService.getReservationsByState('r');
  }

  increaseCount(reservation: ReservationModel) {
    AuthService.updateReservationCount(reservation.createdAt, reservation.count + 1);
    this.loadReservations();
  }

  decreaseCount(reservation: ReservationModel) {
    if (reservation.count <= 1) {
      this.removeReservation(reservation);
      return;
    }

    AuthService.updateReservationCount(reservation.createdAt, reservation.count - 1);
    this.loadReservations();
  }

  removeReservation(reservation: ReservationModel) {
    Alerts.confirm(`Da li ste sigurni da želite da uklonite ${reservation.count} proizvod${reservation.count > 1 ? 'a' : ''} iz korpe?`, () => {
      AuthService.cancelReservation(reservation.createdAt)
      this.reloadComponent()
    })
  }

  payAll() {
    Alerts.confirm(`Da li ste sigurni da želite da platite? Ukupan iznos za uplatu je ${this.calculateTotal()} RSD!`, () => {
      AuthService.payReservation()
      this.reloadComponent()
    })
  }

  calculateTotalByItem(reservation: ReservationModel) {
    return this.utils.calculateTotal(reservation)
  }

  calculateTotal() {
    let total = 0
    for (let reservation of this.getReservations()) {
      total += this.utils.calculateTotal(reservation)
    }

    return total
  }

  getReservations() {
    return AuthService.getReservationsByState('r')
  }

  getPaidReservations() {
    return AuthService.getReservationsByState('p')
  }

  getCanceledReservations() {
    return AuthService.getReservationsByState('c')
  }
}
