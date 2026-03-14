import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
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
    MatExpansionModule
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


  constructor(public utils: Utils) {
    ToyService.getToys()
      .then(rsp => {
        this.toys.set(rsp.data)
        this.filteredToys.set(rsp.data)
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
    const filtered = this.toys()
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


    this.filteredToys.set(filtered)
  }
}
