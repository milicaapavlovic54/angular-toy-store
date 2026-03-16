import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ToyModel } from '../models/toy.model';
import { Utils } from '../utils';
import { ToyService } from '../services/toy.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ToyTypeModel } from '../models/toyType.model';
import { MatDivider } from "@angular/material/divider";
import { MatExpansionModule } from '@angular/material/expansion';
import { ToyAgeGroupModel } from '../models/toyAgeGroup.model';
import { AuthService } from '../services/auth.service';
import { MatSliderModule } from '@angular/material/slider';
import { DecimalPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


export interface FilterOption {
  id: number | string,
  name: string
}

export interface FilterGroup {
  items: FilterOption[]
  selectedIds: (number | string)[]
  showAll: boolean
}

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatSidenavModule,
    FormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatDivider,
    MatExpansionModule,
    MatSliderModule,
    DecimalPipe,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home {
  search = ''
  filteredToys = signal<ToyModel[]>([])
  toys = signal<ToyModel[]>([])
  toyTypes = signal<ToyTypeModel[]>([])
  toyAgeGroups = signal<ToyAgeGroupModel[]>([])
  public authService = AuthService
  selectedMinRating = 0

  minPrice = 0
  maxPrice = 0
  selectedMaxPrice = 0
  selectedMinPrice = 0

  sortBy = 'date_desc'

  toyTypeFilter: FilterGroup = {
    items: [],
    selectedIds: [],
    showAll: false
  }

  ageGroupFilter: FilterGroup = {
    items: [],
    selectedIds: [],
    showAll: false
  }
  targetGroupFilter: FilterGroup = {
    items: [
      { id: 'dečak', name: 'dečak' },
      { id: 'devojčica', name: 'devojčica' },
      { id: 'svi', name: 'univerzalno' }
    ],
    selectedIds: [],
    showAll: false
  }


  constructor(public utils: Utils, public router: Router) {
    ToyService.getToys()
      .then(rsp => {
        this.toys.set(rsp.data)
        this.filteredToys.set(rsp.data)

        const prices = rsp.data.map(t => t.price)
        this.maxPrice = Math.max(...prices)
        this.minPrice = Math.min(...prices)
        this.selectedMaxPrice = this.maxPrice
        this.selectedMinPrice = this.minPrice
      })

    ToyService.getToyTypes()
      .then(rsp => {
        this.toyTypes.set(rsp.data)
        this.toyTypeFilter.items = rsp.data.map(t => ({
          id: t.typeId,
          name: t.name
        }))
      })

    ToyService.getAgeGroups()
      .then(rsp => {
        this.toyAgeGroups.set(rsp.data)
        this.ageGroupFilter.items = rsp.data.map(a => ({
          id: a.ageGroupId,
          name: a.name
        }))
      })
  }

  getVisibleItems(group: FilterGroup) {
    return group.showAll ? group.items : group.items.slice(0, 5)
  }

  toggleShowAll(group: FilterGroup) {
    group.showAll = !group.showAll
  }

  isSelected(group: FilterGroup, id: number | string) {
    return group.selectedIds.includes(id)
  }

  onChange(group: FilterGroup, id: number | string, checked: boolean) {
    if (checked) {
      if (!group.selectedIds.includes(id)) {
        group.selectedIds = [...group.selectedIds, id]
      }
    } else {
      group.selectedIds = group.selectedIds.filter(selectedId => selectedId !== id)
    }

    this.filter()
  }


  filter() {
    let filtered = this.toys()
      .filter(t => {
        if (this.search == '') return true
        const q = this.search.toLowerCase()
        return t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.type.name.toLowerCase().includes(q) ||
          t.type.description.toLocaleLowerCase().includes(q)
      })
      .filter(t => {
        if (this.toyTypeFilter.selectedIds.length === 0) return true
        return this.toyTypeFilter.selectedIds.includes(t.type.typeId)
      })
      .filter(t => {
        if (this.ageGroupFilter.selectedIds.length === 0) return true
        return this.ageGroupFilter.selectedIds.includes(t.ageGroup.ageGroupId)
      })
      .filter(t => {
        if (this.targetGroupFilter.selectedIds.length === 0) return true;
        return this.targetGroupFilter.selectedIds.includes(t.targetGroup);
      })
      .filter(t => {
        if (this.selectedMinRating === 0) return true
        return this.authService.getAvgRatingForToy(t.toyId) >= this.selectedMinRating
      })
      .filter(t=>{
        return t.price>=this.selectedMinPrice && t.price<=this.selectedMaxPrice
      })


    this.filteredToys.set(filtered)

    filtered = filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date_asc':
          return new Date(a.productionDate).getTime() - new Date(b.productionDate).getTime()

        case 'date_desc':
          return new Date(b.productionDate).getTime() - new Date(a.productionDate).getTime()

        case 'name_asc':
          return a.name.localeCompare(b.name)

        case 'name_desc':
          return b.name.localeCompare(a.name)

        case 'price_asc':
          return a.price - b.price

        case 'price_desc':
          return b.price - a.price

        case 'rating_asc':
          return this.authService.getAvgRatingForToy(a.toyId) - this.authService.getAvgRatingForToy(b.toyId)

        case 'rating_desc':
          return this.authService.getAvgRatingForToy(b.toyId) - this.authService.getAvgRatingForToy(a.toyId)

        default:
          return 0
      }
    })

    this.filteredToys.set(filtered)
  }
}
