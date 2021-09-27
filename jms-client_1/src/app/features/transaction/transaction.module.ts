import { NgModule } from '@angular/core';
import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { SharedModule } from '../../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MasterRoutingModule } from '../master/master-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { FileUploadModule } from 'ng2-file-upload';
import { TreeviewModule } from 'ngx-treeview';
import { PurchaseorderformComponent } from './purchaseorder/purchaseorderform/purchaseorderform.component';
import { PurchaseordergridComponent } from './purchaseorder/purchaseordergrid/purchaseordergrid.component';
import { CommonModule } from '@angular/common';
import { ReceiptformComponent } from './receipt/receiptform/receiptform.component';
import { ReceiptgridComponent } from './receipt/receiptgrid/receiptgrid.component';
import { ModalModule } from '../../core/_modal';
// import { CoreModule } from '../../core/core.module';
import { WarehousemasterformComponent } from '../master/warehousemaster/warehousemasterform/warehousemasterform.component';
import { MasterModule } from '../master/master.module';
import { SaleformComponent } from './sale/saleform/saleform.component';
import { TagprintformComponent } from './tagprint/tagprintform/tagprintform.component';


@NgModule({
  declarations: [ TransactionComponent, PurchaseorderformComponent, PurchaseordergridComponent, ReceiptformComponent, ReceiptgridComponent, SaleformComponent, TagprintformComponent],
  imports: [
    TransactionRoutingModule,
    SharedModule,
    BrowserModule,
    MasterModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    FileUploadModule,
    ModalModule,
    AgGridModule.withComponents([]),
    TreeviewModule.forRoot()
  ],
  exports: [
    
  ]
})
export class TransactionModule { }
