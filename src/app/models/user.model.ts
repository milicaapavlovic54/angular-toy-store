export interface UserModel{
    firstName: string
    lastName: string
    email: string
    password: string
    favToyType: string
    address: string
    phone: string
    orders: any[] // todo ovo treba orderModel kad se napravi
}