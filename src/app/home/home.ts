import { Component, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ToyModel } from '../models/toy.model';
import { Utils } from '../utils';
import { ToyService } from '../services/toy.service';

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  toys = signal<ToyModel[]>([])
  constructor (public utils: Utils){
    ToyService.getToys()
    .then(rsp=> this.toys.set(rsp.data))
  }
}
