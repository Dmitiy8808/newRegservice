import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';





@NgModule({
  declarations: [
    DialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ReactiveFormsModule,
    DialogComponent
  ]
})
export class SharedModule { }
