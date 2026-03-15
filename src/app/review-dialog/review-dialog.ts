import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReviewModel } from '../models/review.model';
import { Utils } from '../utils';
import { MatIcon } from "@angular/material/icon";

export interface ReviewDialogData {
  imageUrl: string
  toyName: string
  rating: number
  comment: string
}

@Component({
  selector: 'app-review-dialog',
  imports: [
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIcon
],
  templateUrl: './review-dialog.html',
  styleUrl: './review-dialog.css',
})
export class ReviewDialog {
  rating =0
  comment =''
  stars = [1,2,3,4,5]

  constructor(
    public dialogRef: MatDialogRef<ReviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData,
    public utils: Utils
  ){
    this.rating = data.rating
    this.comment = data.comment
  }

  setRating(value: number){
    this.rating=value
  }

  save(){
    if(!this.rating) return
    this.dialogRef.close({
      rating: this.rating,
      comment:this.comment.trim()
    })
  }

  close() {
    this.dialogRef.close();
  }
}
