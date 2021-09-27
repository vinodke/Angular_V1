import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SitemastergridComponent } from './sitemaster/sitemastergrid/sitemastergrid.component';
import { SitemasterformComponent } from './sitemaster/sitemasterform/sitemasterform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
//import { GridComponent } from '../shared/component/grid/grid.component';
import { SidebarnavComponent } from './sidebarnav/sidebarnav.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GridComponent } from '../shared/component/grid/grid.component';
import { ModalModule } from './_modal';
import { TransactionModule } from '../features/transaction/transaction.module';


@NgModule({
  declarations: [SidebarnavComponent, LoginComponent, SitemastergridComponent, SitemasterformComponent, DashboardComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule,
    TransactionModule
  ],
  exports: [SidebarnavComponent]
})
export class CoreModule { }
