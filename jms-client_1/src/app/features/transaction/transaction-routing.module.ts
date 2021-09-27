import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_helpers';
import { PurchaseorderformComponent } from './purchaseorder/purchaseorderform/purchaseorderform.component';
import { PurchaseordergridComponent } from './purchaseorder/purchaseordergrid/purchaseordergrid.component';
import { ReceiptformComponent } from './receipt/receiptform/receiptform.component';
import { ReceiptgridComponent } from './receipt/receiptgrid/receiptgrid.component';
import { SaleformComponent } from './sale/saleform/saleform.component';
import { TagprintformComponent } from './tagprint/tagprintform/tagprintform.component';
import { TransactionComponent } from './transaction.component';

const routes: Routes = [{ path: '', component: TransactionComponent },
{ path: 'purchaseorder', component: PurchaseorderformComponent, canActivate: [AuthGuard]},
{ path: 'purchaseorder/:state', component: PurchaseordergridComponent, canActivate: [AuthGuard]},
{ path: 'purchaseorder/:state/:id', component: PurchaseorderformComponent, canActivate: [AuthGuard]},
{ path: 'purchaseorderapprove', component: PurchaseordergridComponent, canActivate: [AuthGuard]},
{ path: 'purchaseorderapprove/:state/:id', component: PurchaseorderformComponent, canActivate: [AuthGuard]},
{ path: 'receipt', component: ReceiptformComponent, canActivate: [AuthGuard]},
{ path: 'receipt/:state', component: ReceiptgridComponent, canActivate: [AuthGuard]},
{ path: 'receipt/:state/:id', component: ReceiptformComponent, canActivate: [AuthGuard]},
{ path: 'receiptapprove', component: ReceiptgridComponent, canActivate: [AuthGuard]},
{ path: 'receiptapprove/:state/:id', component: ReceiptformComponent, canActivate: [AuthGuard]},
{ path: 'sale', component: SaleformComponent, canActivate: [AuthGuard]},
{ path: 'tagprint', component: TagprintformComponent, canActivate: [AuthGuard]},
// { path: 'assetregister/add', component: AssetregisterformComponent, canActivate: [AuthGuard] },
// { path: 'assetregister/:state/:id', component: AssetregisterformComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class TransactionRoutingModule { }
