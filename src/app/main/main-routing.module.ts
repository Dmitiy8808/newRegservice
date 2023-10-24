import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report/report.component';
import { AdminComponent } from './admin/admin.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

const routes: Routes = [
  {path: '', component: MainLayoutComponent,
    children: [
      {path: '', redirectTo: 'requests', pathMatch: 'full'},
      {
        path: 'requests',
        loadChildren: () => import('./request/request.module').then(m => m.RequestModule)
      },
      {path: 'reports', component: ReportComponent},
      {path: 'admin', component: AdminComponent},
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
