import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './admin/admin.component';
import { ReportComponent } from './report/report.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { BodyComponent } from './body/body.component';
import { SublevelMenuComponent } from './sidenav/sublevel-menu/sublevel-menu.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { HttpClientModule } from '@angular/common/http';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../components/input/input.component';
import { InnMaskDirective } from '../directives/inn-mask.directive';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { NgxMaskDirective } from 'ngx-mask';




@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    AdminComponent,
    ReportComponent,
    SidenavComponent,
    MainLayoutComponent,
    BodyComponent,
    SublevelMenuComponent,
    PaginationComponent,
    InputComponent,
    InnMaskDirective,
    RequestDetailComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    OverlayModule,
    CdkMenuModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective

  ],
  providers: [

  ]
})
export class MainModule { }
