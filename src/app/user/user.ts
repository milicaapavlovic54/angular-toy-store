import { Component, HostListener, signal } from '@angular/core';
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
import { ReservationModel } from '../models/reservation.model';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialog } from '../review-dialog/review-dialog';

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
    MatTableModule
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

  clientWidth: number = document.documentElement.clientWidth;
  displayedPaidColumns: string[] = [];
  paidReservations: ReservationModel[] = [];

  constructor(private router: Router, public utils: Utils, private dialog: MatDialog) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login'])
    }

    ToyService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data.map(t => t.name)))

    this.resizeTable();
    this.loadPaidReservations();

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.clientWidth = (event.target as Window).document.documentElement.clientWidth
    this.resizeTable()
  }

  resizeTable() {
    if (this.clientWidth >= 1010) {
      this.displayedPaidColumns = ['slika', 'proizvod', 'opis', 'tip', 'uzrast', 'cena', 'količina', 'ukupno', 'opcije']
      return;
    }

    if (this.clientWidth >= 840) {
      this.displayedPaidColumns = ['slika', 'proizvod', 'opis', 'cena', 'količina', 'ukupno', 'opcije']
      return;
    }

    if (this.clientWidth >= 580) {
      this.displayedPaidColumns = ['proizvod', 'cena', 'količina', 'ukupno', 'opcije']
      return;
    }

    this.displayedPaidColumns = ['proizvod', 'ukupno', 'opcije']
  }

  loadPaidReservations() {
    this.paidReservations = AuthService.getReservationsByState('p')
  }

  calculateTotalByItem(reservation: ReservationModel) {
    return this.utils.calculateTotal(reservation);
  }

  calculatePaidTotal() {
    let total = 0;
    for (let reservation of this.paidReservations) {
      total += this.calculateTotalByItem(reservation)
    }
    return total;
  }

  updateUser() {
    Alerts.confirm('Da li ste sigurni da želite da izmenite korisničke podatke?', () => {
      AuthService.updateActiveUser(this.activeUser!)
      Alerts.success('Korisnički podaci su uspešno promenjeni!')
    })

  }

  updatePassword() {
    Alerts.confirm('Da li ste sigurni da želite da promenite lozinku?', () => {
      if (this.oldPassword != this.activeUser?.password) {
        Alerts.error('Netačna stara lozinka')
        return
      }

      if (this.newPassword.length < 6) {
        Alerts.error('Lozinka mora imati minimum 6 karaktera')
        return
      }

      if (this.newPassword != this.passRepeat) {
        Alerts.error('Lozinke se ne poklapaju')
        return
      }

      if (this.newPassword == this.oldPassword) {
        Alerts.error('Nova lozinka ne može biti ista kao stara')
        return
      }

      AuthService.updateActiveUserPassword(this.newPassword)
      Alerts.success('Lozinka uspešno promenjena')
      AuthService.logout()
      this.router.navigate(['/login'])
    })
  }

  getAvatarUrl() {
    return `https://ui-avatars.com/api/?name=${this.activeUser?.firstName}+${this.activeUser?.lastName}`
  }

  reloadComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/user'])
      })
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



