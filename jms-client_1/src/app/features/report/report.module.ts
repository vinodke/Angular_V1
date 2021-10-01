import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { AuditreportComponent } from './auditreport/auditreport.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MasterModule } from '../master/master.module';
import { MasterRoutingModule } from '../master/master-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalModule } from 'src/app/core/_modal';
import { AgGridModule } from 'ag-grid-angular';
import { TreeviewModule } from 'ngx-treeview';


@NgModule({
  declarations: [
    AuditreportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    BrowserModule,
    MasterModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    FileUploadModule,
    ModalModule,
    AgGridModule.withComponents([]),
    TreeviewModule.forRoot()
  ]
})
export class ReportModule { }
