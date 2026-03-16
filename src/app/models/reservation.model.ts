import { ToyAgeGroupModel } from "./toyAgeGroup.model"
import { ToyTypeModel } from "./toyType.model"

export interface ReservationModel{
    toyId: number
    name: string
    permalink: string
    description: string
    targetGroup: 'dečak' | 'devojčica' | 'svi'
    price: number
    imageUrl: string
    productionDate:string
    ageGroup: ToyAgeGroupModel
    type: ToyTypeModel
    state: 'r' | 'p' | 'c'
    count: number
    createdAt: string
}