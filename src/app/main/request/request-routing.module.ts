import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestComponent } from './request.component';
import { NewrequestsComponent } from './newrequests/newrequests.component';
import { InprogressComponent } from './inprogress/inprogress.component';
import { CompliteComponent } from './complite/complite.component';

const routes: Routes = [
  {
    path: '',
    component: RequestComponent
  },
  {
    path: 'new',
    component: NewrequestsComponent
  },
  {
    path: 'inprogress',
    component: InprogressComponent
  },
  {
    path: 'complite',
    component: CompliteComponent
  }
];

@NgModule({
  declarations: [
    RequestComponent
  ],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule { }
