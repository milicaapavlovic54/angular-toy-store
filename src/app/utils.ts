import { Injectable } from '@angular/core';
import { ToyModel } from "./models/toy.model"
import { ReservationModel } from './models/reservation.model';


@Injectable({
  providedIn: 'root',
})

export class Utils{

  getImageUrl(toy: ToyModel | ReservationModel) {
      const fileName = toy.imageUrl
      return `https://toy.pequla.com${fileName}`
  }

  calculateTotal(reservation: ReservationModel) {
    return (reservation.price * reservation.count) 
  }
}
 
 