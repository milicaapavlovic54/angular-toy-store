import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ToyModel } from '../models/toy.model';
import { Utils } from '../utils';
import { ToyService } from '../services/toy.service';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    DecimalPipe,
    MatButtonModule
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  toy = signal<ToyModel | null>(null)
  constructor(route: ActivatedRoute, public utils: Utils) {
    route.params.subscribe(params => {
      const permalink = params['permalink']
      ToyService.getToyByPermalink(permalink)
      .then(rsp => this.toy.set(rsp.data))
    })
    
  }
}
