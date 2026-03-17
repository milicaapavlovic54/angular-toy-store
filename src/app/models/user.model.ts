import { ReservationModel } from "./reservation.model"
import { ReviewModel } from "./review.model"

export interface UserModel{
    firstName: string
    lastName: string
    email: string
    password: string
    favToyType: string[]
    address: string
    phone: string
    reservations: ReservationModel[]
    reviews: ReviewModel[] 
}