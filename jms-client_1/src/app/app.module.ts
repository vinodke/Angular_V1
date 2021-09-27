import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarnavComponent } from './core/sidebarnav/sidebarnav.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
