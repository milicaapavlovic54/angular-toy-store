import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-about',
  imports: [MatCardModule, MatListModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {}
