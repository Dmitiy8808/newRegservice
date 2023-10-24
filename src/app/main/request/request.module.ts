import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { NewrequestsComponent } from './newrequests/newrequests.component';
import { InprogressComponent } from './inprogress/inprogress.component';
import { CompliteComponent } from './complite/complite.component';


@NgModule({
  declarations: [
    NewrequestsComponent,
    InprogressComponent,
    CompliteComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule
  ]
})
export class RequestModule { }
