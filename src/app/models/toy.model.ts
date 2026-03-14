export interface ToyModel{
    toyId: number
    name: string
    permalink: string
    description: string
    targetGroup: 'dečak' | 'devojčica' | 'svi'
    productionDate: string
    price: number
    imageUrl: string
    ageGroup: {
      ageGroupId: number
      name: string
      description: string
    }
    type: {
      typeId: number
      name: string
      description: string
    }
}