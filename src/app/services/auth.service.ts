import { ReservationModel } from "../models/reservation.model"
import { ToyModel } from "../models/toy.model"
import { UserModel } from "../models/user.model"

const USERS = 'users'
const ACTIVE = 'active'

export class AuthService {

    //------------------    USERS - LOGIN  ------------------------------------
    static getUsers(): UserModel[] {
        const baseUser: UserModel = {
            firstName: 'User',
            lastName: 'Example',
            email: 'user@example.com',
            password: 'user123',
            favToyType: 'Slagalica',
            address: 'Danijelova 32',
            phone: '0644569276',
            reservations: [],
            reviews: []
        }

        if (localStorage.getItem(USERS) == null) {
            localStorage.setItem(USERS, JSON.stringify([baseUser]))
        }

        return JSON.parse(localStorage.getItem(USERS)!)
    }

    static login(email: string, password: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === email && u.password === password) {
                localStorage.setItem(ACTIVE, email)
                return true
            }
        }

        return false
    }

    static getActiveUser(): UserModel | null {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                return u
            }
        }

        return null
    }

    static updateActiveUser(newUserData: UserModel) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.firstName = newUserData.firstName
                u.lastName = newUserData.lastName
                u.address = newUserData.address
                u.phone = newUserData.phone
                u.favToyType = newUserData.favToyType
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))

        return null
    }

    static updateActiveUserPassword(newPassword: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.password = newPassword
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static logout() {
        localStorage.removeItem(ACTIVE)
    }

    //------------------    CART - RESERVATIONS    ------------------------------------

    static createReservation(reservation: Partial<ReservationModel>, toy: ToyModel) {


        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                const existing = u.reservations.find(r => r.state === 'r' && r.toyId === toy.toyId)
                if (existing) {
                    existing.count += reservation.count ?? 1
                } else {
                    reservation.state = 'r'
                    reservation.toyId = toy.toyId
                    reservation.permalink = toy.permalink
                    reservation.description = toy.description
                    reservation.imageUrl = toy.imageUrl
                    reservation.ageGroup = toy.ageGroup
                    reservation.type = toy.type
                    reservation.name = toy.name
                    reservation.price = toy.price
                    reservation.targetGroup = toy.targetGroup
                    reservation.createdAt = new Date().toISOString()

                    u.reservations.push(reservation as ReservationModel)
                }
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static updateReservationCount(createdAt: string, newCount: number) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                for (let r of u.reservations) {
                    if (r.state === 'r' && r.createdAt === createdAt) {
                        r.count = newCount
                    }
                }
            }
        }

        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static getReservationsByState(state: 'r' | 'p' | 'c') {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                return u.reservations.filter((r) => r.state === state)
            }
        }

        return []
    }

    static cancelReservation(createdAt: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                for (let r of u.reservations) {
                    if (r.state == 'r' && r.createdAt == createdAt) {
                        r.state = 'c'
                    }
                }
            }
        }

        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static payReservation() {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                for (let o of u.reservations) {
                    if (o.state == 'r') {
                        o.state = 'p'
                    }
                }
            }
        }

        localStorage.setItem(USERS, JSON.stringify(users))
    }

    //------------------    REVIEW    ------------------------------------

    static getMyReviewForToy(toyId: number){
        const user = this.getActiveUser()
        if(!user) return null
        return user.reviews.find(r=>r.toyId===toyId) || null
    }

    static addOrUpdateReview(toyId:number, rating: number, comment: string){
        const users = this.getUsers()
        for(let u of users){
            if(u.email===localStorage.getItem(ACTIVE)){
                const existing=u.reviews.find(r=>r.toyId===toyId)
                if(existing){
                    existing.rating=rating
                    existing.comment=comment
                    existing.createdAt=new Date().toISOString()
                }else{
                    u.reviews.push({
                        toyId,
                        rating,
                        comment,
                        createdAt: new Date().toISOString(),
                        userEmail: u.email,
                        userName: `${u.firstName} ${u.lastName}`
                    })
                }
            }
        }
        localStorage.setItem(USERS,JSON.stringify(users))
    }

    static getReviewsForToy(toyId:number){
        const users = this.getUsers()
        let reviews = []
        for(let u of users){
            if(u.reviews && u.reviews.length>0){
                reviews.push(...u.reviews.filter(r=>r.toyId===toyId))
            }
        }
        return reviews
    }

    static getAvgRatingForToy(toyId: number){
        const reviews = this.getReviewsForToy(toyId)
        if(reviews.length===0) return 0
        let total = 0
        for(let r of reviews){
            total+=r.rating
        }
        return total/reviews.length

    }

    //------------------------  SIGNUP  --------------------------
    static createUser(user: Partial<UserModel>) {
        const users = this.getUsers()
        user.reservations = []
        user.reviews =[]
        users.push(user as UserModel)
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static existsByEmail(email: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === email) return true
        }

        return false
    }
}