import { Component, signal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ToyModel } from '../models/toy.model';
import { Utils } from '../utils';
import { ToyService } from '../services/toy.service';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Alerts } from '../alerts';
import { ReservationModel } from '../models/reservation.model';
import { ReviewModel } from '../models/review.model';

@Component({
  selector: 'app-details',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    DecimalPipe,
    MatButtonModule, 
    DatePipe
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  toy = signal<ToyModel | null>(null)
  public authService = AuthService
  reservation: Partial<ReservationModel>={
    count: 1
  }
  reviews: ReviewModel[]= []
  avgRating=0

  constructor(route: ActivatedRoute, public utils: Utils) {
    
    route.params.subscribe(params => {
      const permalink = params['permalink']
      ToyService.getToyByPermalink(permalink)
      .then(rsp => {
        this.toy.set(rsp.data)
        this.loadReviews()
      })
    })
    
  }

  placeReservation(){
    AuthService.createReservation(this.reservation, this.toy()!)
    Alerts.success(`Uspešno ste dodali "${this.toy()?.name}" u korpu`)
  }

  loadReviews(){
    this.reviews = AuthService.getReviewsForToy(this.toy()!.toyId)
    this.avgRating = AuthService.getAvgRatingForToy(this.toy()!.toyId)
  }
}
