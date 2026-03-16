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
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialog } from '../review-dialog/review-dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-cart',
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    DatePipe,
    MatDialogModule,
    MatDividerModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  clientWidth: number = document.documentElement.clientWidth
  displayedColumns: string[] = []
  reservedReservations: ReservationModel[] = [];
  paidReservations: ReservationModel[] = [];
  canceledReservations: ReservationModel[] = [];



  constructor(public router: Router, public utils: Utils, private dialog: MatDialog) {
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
      this.displayedColumns = ['slika', 'proizvod', 'opis', 'tip', 'uzrast', 'pol','datum_proizvodnje', 'cena', 'količina', 'ukupno','status' , 'opcije']
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
    this.reservedReservations = this.getReservedReservations();
    this.paidReservations = this.getPaidReservations ();
    this.canceledReservations = this.getCanceledReservations();
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

  payItem(reservation:ReservationModel) {
    Alerts.confirm(`Da li ste sigurni da želite da izvršite uplatu? Ukupan iznos za uplatu je ${this.calculateTotalByItem(reservation)} RSD!`, () => {
      AuthService.payReservation()
      this.reloadComponent()
    })
  }

  calculateTotalByItem(reservation: ReservationModel) {
    return this.utils.calculateTotal(reservation)
  }


  getStatusName(reservation:ReservationModel){
    if(reservation.state === 'r') return 'Rezervisano'
    if(reservation.state === 'p') return 'Pristiglo'
    return 'Otkazano'
  }
  getAllReservations(){
    return AuthService.getAllReservations()
  }

  getReservedReservations() {
    return AuthService.getReservationsByState('r')
  }

  getPaidReservations() {
    return AuthService.getReservationsByState('p')
  }

  getCanceledReservations() {
    return AuthService.getReservationsByState('c')
  }

  hasReview(toyId: number) {
    return AuthService.getMyReviewForToy(toyId) !== null
  }

  reviewToy(reservation: ReservationModel) {
    const existingReview = AuthService.getMyReviewForToy(reservation.toyId)

    const dialogRef = this.dialog.open(ReviewDialog, {
      width: '450px',
      data: {
        imageUrl: this.utils.getImageUrl(reservation),
        toyName: reservation.name,
        rating: existingReview?.rating ?? 0,
        comment: existingReview?.comment ?? ''
      }
  })

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    AuthService.addOrUpdateReview(
      reservation.toyId,
      result.rating,
      result.comment
    )

    this.reloadComponent();
  })
}
}
