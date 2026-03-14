import axios from "axios";
import { ToyModel } from "../models/toy.model";
import { ToyTypeModel } from "../models/toyType.model";
import { ToyAgeGroupModel } from "../models/toyAgeGroup.model";

const client = axios.create({
    baseURL: 'https://toy.pequla.com/api',
    headers:{
        'Accept' : 'application/json',
        'X-Name' : 'KVA_2026_2023203424/v1.0'
    },
    validateStatus(status){
        return status === 200 || status ===204
    }

})


export class ToyService{
    static async getToys() {
        return await client.get<ToyModel[]>('/toy')
    }

    static async getToyById(id: number){
        return await client.get<ToyModel>('/toy/'+ id)
    }

    static async getToyByPermalink(permalink: number){
        return await client.get<ToyModel>('/toy/permalink/'+ permalink)
    }

    static async getAgeGroups(){
        return await client.get<ToyAgeGroupModel[]>('/age-group')
    }

    static async getToyTypes(){
        return await client.get<ToyTypeModel[]>('/type')
    }

    static async getToysByIds(ids: number[]){
        return await client.request({
            url: '/toy/list',
            method: 'post',
            data: ids
        })
    }
}