import { Injectable } from '@angular/core';
import { ToyModel } from "./models/toy.model"


@Injectable({
  providedIn: 'root',
})

 export class Utils{

    getImageUrl(toy: ToyModel) {
        const fileName = toy.imageUrl
        return `https://toy.pequla.com${fileName}`
    }
 }
 
 