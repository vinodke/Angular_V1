import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { SitemastergridComponent } from './core/sitemaster/sitemastergrid/sitemastergrid.component';
import { SitemasterformComponent } from './core/sitemaster/sitemasterform/sitemasterform.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { AuthGuard } from './_helpers';
import { SidebarnavComponent } from './core/sidebarnav/sidebarnav.component';
import { BuildingmasterformComponent } from './features/master/buildingmaster/buildingmasterform/buildingmasterform.component';
import { FloormasterformComponent } from './features/master/floormaster/floormasterform/floormasterform.component';
import { RoommasterformComponent } from './features/master/roommaster/roommasterform/roommasterform.component';
import { LocationmasterformComponent } from './features/master/locationmaster/locationmasterform/locationmasterform.component';
import { BuildingmastergridComponent } from './features/master/buildingmaster/buildingmastergrid/buildingmastergrid.component';
import { FloormastergridComponent } from './features/master/floormaster/floormastergrid/floormastergrid.component';
import { RoommastergridComponent } from './features/master/roommaster/roommastergrid/roommastergrid.component';
import { LocationmastergridComponent } from './features/master/locationmaster/locationmastergrid/locationmastergrid.component';
import { DepartmentmastergridComponent } from './features/master/departmentmaster/departmentmastergrid/departmentmastergrid.component';
import { DepartmentmasterformComponent } from './features/master/departmentmaster/departmentmasterform/departmentmasterform.component';
import { BrandmastergridComponent } from './features/master/brandmaster/brandmastergrid/brandmastergrid.component';
import { BrandmasterformComponent } from './features/master/brandmaster/brandmasterform/brandmasterform.component';
import { BrandmodelmastergridComponent } from './features/master/brandmodelmaster/brandmodelmastergrid/brandmodelmastergrid.component';
import { BrandmodelmasterformComponent } from './features/master/brandmodelmaster/brandmodelmasterform/brandmodelmasterform.component';
import { AssetcategorymastergridComponent } from './features/master/assetcategorymaster/assetcategorymastergrid/assetcategorymastergrid.component';
import { AssetcategorymasterformComponent } from './features/master/assetcategorymaster/assetcategorymasterform/assetcategorymasterform.component';
import { AssetsubcategorymastergridComponent } from './features/master/assetsubcategorymaster/assetsubcategorymastergrid/assetsubcategorymastergrid.component';
import { AssetsubcategorymasterformComponent } from './features/master/assetsubcategorymaster/assetsubcategorymasterform/assetsubcategorymasterform.component';
import { EmployeemastergridComponent } from './features/master/employeemaster/employeemastergrid/employeemastergrid.component';
import { EmployeemasterformComponent } from './features/master/employeemaster/employeemasterform/employeemasterform.component';
import { SuppliermastergridComponent } from './features/master/suppliermaster/suppliermastergrid/suppliermastergrid.component';
import { SuppliermasterformComponent } from './features/master/suppliermaster/suppliermasterform/suppliermasterform.component';
import { CommonvaluelistgridComponent } from './features/master/commonvaluelist/commonvaluelistgrid/commonvaluelistgrid.component';
import { CommonvaluelistformComponent } from './features/master/commonvaluelist/commonvaluelistform/commonvaluelistform.component';
import { ReceiptmasterformComponent } from './features/master/receiptmaster/receiptmasterform/receiptmasterform.component';
import { ProductmastergridComponent } from './features/master/productmaster/productmastergrid/productmastergrid.component';
import { ProductmasterformComponent } from './features/master/productmaster/productmasterform/productmasterform.component';
import { ReceiptmastergridComponent } from './features/master/receiptmaster/receiptmastergrid/receiptmastergrid.component'
import { CompanymastergridComponent } from './features/master/companymaster/companymastergrid/companymastergrid.component';
import { RegionmastergridComponent } from './features/master/regionmaster/regionmastergrid/regionmastergrid.component';
import { WarehousemastergridComponent } from './features/master/warehousemaster/warehousemastergrid/warehousemastergrid.component';
import { CompanymasterformComponent } from './features/master/companymaster/companymasterform/companymasterform.component';
import { RegionmasterformComponent } from './features/master/regionmaster/regionmasterform/regionmasterform.component';
import { WarehousemasterformComponent } from './features/master/warehousemaster/warehousemasterform/warehousemasterform.component';
import { KaratmastergridComponent } from './features/master/karatmaster/karatmastergrid/karatmastergrid.component';
import { KaratmasterformComponent } from './features/master/karatmaster/karatmasterform/karatmasterform.component';
import { CategorymastergridComponent } from './features/master/categorymaster/categorymastergrid/categorymastergrid.component';
import { CategorymasterformComponent } from './features/master/categorymaster/categorymasterform/categorymasterform.component';
import { SubcategorymastergridComponent } from './features/master/subcategorymaster/subcategorymastergrid/subcategorymastergrid.component';
import { SubcategorymasterformComponent } from './features/master/subcategorymaster/subcategorymasterform/subcategorymasterform.component';
import { ItembrandmastergridComponent } from './features/master/itembrandmaster/itembrandmastergrid/itembrandmastergrid.component';
import { ItembrandmasterformComponent } from './features/master/itembrandmaster/itembrandmasterform/itembrandmasterform.component';
import { ItemcollectionmasterformComponent } from './features/master/itemcollectionmaster/itemcollectionmasterform/itemcollectionmasterform.component';
import { ItemfamilymastergridComponent } from './features/master/itemfamilymaster/itemfamilymastergrid/itemfamilymastergrid.component';
import { ItemgroupmastergridComponent } from './features/master/itemgroupmaster/itemgroupmastergrid/itemgroupmastergrid.component';
import { ItemfamilymasterformComponent } from './features/master/itemfamilymaster/itemfamilymasterform/itemfamilymasterform.component';
import { ItemgroupmasterformComponent } from './features/master/itemgroupmaster/itemgroupmasterform/itemgroupmasterform.component';
import { BankmastergridComponent } from './features/master/bankmaster/bankmastergrid/bankmastergrid.component';
import { CashcountermastergridComponent } from './features/master/cashcountermaster/cashcountermastergrid/cashcountermastergrid.component';
import { ColormastergridComponent } from './features/master/colormaster/colormastergrid/colormastergrid.component';
import { SalesdivisionmastergridComponent } from './features/master/salesdivisionmaster/salesdivisionmastergrid/salesdivisionmastergrid.component';
import { UommastergridComponent } from './features/master/uommaster/uommastergrid/uommastergrid.component';
import { BankmasterformComponent } from './features/master/bankmaster/bankmasterform/bankmasterform.component';
import { CashcountermasterformComponent } from './features/master/cashcountermaster/cashcountermasterform/cashcountermasterform.component';
import { ColormasterformComponent } from './features/master/colormaster/colormasterform/colormasterform.component';
import { SalesdivisionmasterformComponent } from './features/master/salesdivisionmaster/salesdivisionmasterform/salesdivisionmasterform.component';
import { UommasterformComponent } from './features/master/uommaster/uommasterform/uommasterform.component';
import { ItemcollectionmastergridComponent } from './features/master/itemcollectionmaster/itemcollectionmastergrid/itemcollectionmastergrid.component';
import { CustomermastergridComponent } from './features/master/customermaster/customermastergrid/customermastergrid.component';
import { CustomermasterformComponent } from './features/master/customermaster/customermasterform/customermasterform.component';
import { ItemmastergridComponent } from './features/master/itemmaster/itemmastergrid/itemmastergrid.component';
import { ItemmasterformComponent } from './features/master/itemmaster/itemmasterform/itemmasterform.component';
import { PurchaseorderformComponent } from './features/transaction/purchaseorder/purchaseorderform/purchaseorderform.component';
import { TaxmastergridComponent } from './features/master/taxmaster/taxmastergrid/taxmastergrid.component';
import { TaxmasterformComponent } from './features/master/taxmaster/taxmasterform/taxmasterform.component';
import { PaymentmethodgridComponent } from './features/master/paymentmethod/paymentmethodgrid/paymentmethodgrid.component';
import { PaymentmethodformComponent } from './features/master/paymentmethod/paymentmethodform/paymentmethodform.component';
import { AuditmasterformComponent } from './features/master/auditmaster/auditmasterform/auditmasterform.component';
import { AuditmastergridComponent } from './features/master/auditmaster/auditmastergrid/auditmastergrid.component';


const routes: Routes = [
{ path: 'login', component: LoginComponent },
{ path: 'companymaster', component: CompanymastergridComponent, canActivate: [AuthGuard]},
{ path: 'regionmaster', component: RegionmastergridComponent, canActivate: [AuthGuard]},
{ path: 'warehousemaster', component: WarehousemastergridComponent, canActivate: [AuthGuard]},
{ path: 'karatmaster', component: KaratmastergridComponent, canActivate: [AuthGuard]},
{ path: 'categorymaster', component: CategorymastergridComponent, canActivate: [AuthGuard]},
{ path: 'subcategorymaster', component: SubcategorymastergridComponent, canActivate: [AuthGuard]},
{ path: 'itembrandmaster', component: ItembrandmastergridComponent, canActivate: [AuthGuard]},
{ path: 'itemcollectionmaster', component: ItemcollectionmastergridComponent, canActivate: [AuthGuard]},
{ path: 'itemfamilymaster', component: ItemfamilymastergridComponent, canActivate: [AuthGuard]},
{ path: 'itemgroupmaster', component: ItemgroupmastergridComponent, canActivate: [AuthGuard]},
{ path: 'bankmaster', component: BankmastergridComponent, canActivate: [AuthGuard]},
{ path: 'cashcountermaster', component: CashcountermastergridComponent, canActivate: [AuthGuard]},
{ path: 'colormaster', component: ColormastergridComponent, canActivate: [AuthGuard]},
{ path: 'salesdivisionmaster', component: SalesdivisionmastergridComponent, canActivate: [AuthGuard]},
{ path: 'uommaster', component: UommastergridComponent, canActivate: [AuthGuard]},
{ path: 'sitemaster', component: SitemastergridComponent, canActivate: [AuthGuard]},
{ path: 'buildingmaster', component: BuildingmastergridComponent, canActivate: [AuthGuard]},
{ path: 'floormaster', component: FloormastergridComponent, canActivate: [AuthGuard]},
{ path: 'roommaster', component: RoommastergridComponent, canActivate: [AuthGuard]},
  { path: 'locationmaster', component: LocationmastergridComponent, canActivate: [AuthGuard]},
{ path: 'departmentmaster', component: DepartmentmastergridComponent, canActivate: [AuthGuard]},
{ path: 'sidebarnav', component: SidebarnavComponent, canActivate: [AuthGuard]},
{ path: 'companymaster/add', component: CompanymasterformComponent, canActivate: [AuthGuard]},
{ path: 'companymaster/:state/:id', component: CompanymasterformComponent, canActivate: [AuthGuard]},
{ path: 'regionmaster/add', component: RegionmasterformComponent, canActivate: [AuthGuard]},
{ path: 'regionmaster/:state/:id', component: RegionmasterformComponent, canActivate: [AuthGuard]},
{ path: 'warehousemaster/add', component: WarehousemasterformComponent, canActivate: [AuthGuard]},
{ path: 'warehousemaster/:state/:id', component: WarehousemasterformComponent, canActivate: [AuthGuard]},
{ path: 'karatmaster/add', component: KaratmasterformComponent, canActivate: [AuthGuard]},
{ path: 'karatmaster/:state/:id', component: KaratmasterformComponent, canActivate: [AuthGuard]},
{ path: 'categorymaster/add', component: CategorymasterformComponent, canActivate: [AuthGuard]},
{ path: 'categorymaster/:state/:id', component: CategorymasterformComponent, canActivate: [AuthGuard]},
{ path: 'subcategorymaster/add', component: SubcategorymasterformComponent, canActivate: [AuthGuard]},
{ path: 'subcategorymaster/:state/:id', component: SubcategorymasterformComponent, canActivate: [AuthGuard]},
{ path: 'itembrandmaster/add', component: ItembrandmasterformComponent, canActivate: [AuthGuard]},
{ path: 'itembrandmaster/:state/:id', component: ItembrandmasterformComponent, canActivate: [AuthGuard]},
{ path: 'itemcollectionmaster/add', component: ItemcollectionmasterformComponent, canActivate: [AuthGuard]},
{ path: 'itemcollectionmaster/:state/:id', component: ItemcollectionmasterformComponent, canActivate: [AuthGuard]},
{ path: 'itemfamilymaster/add', component: ItemfamilymasterformComponent, canActivate: [AuthGuard]},
{ path: 'itemfamilymaster/:state/:id', component: ItemfamilymasterformComponent, canActivate: [AuthGuard]},
{ path: 'itemgroupmaster/add', component: ItemgroupmasterformComponent, canActivate: [AuthGuard]},
{ path: 'itemgroupmaster/:state/:id', component: ItemgroupmasterformComponent, canActivate: [AuthGuard]},
{ path: 'bankmaster/add', component: BankmasterformComponent, canActivate: [AuthGuard]},
{ path: 'bankmaster/:state/:id', component: BankmasterformComponent, canActivate: [AuthGuard]},
{ path: 'cashcountermaster/add', component: CashcountermasterformComponent, canActivate: [AuthGuard]},
{ path: 'cashcountermaster/:state/:id', component: CashcountermasterformComponent, canActivate: [AuthGuard]},
{ path: 'colormaster/add', component: ColormasterformComponent, canActivate: [AuthGuard]},
{ path: 'colormaster/:state/:id', component: ColormasterformComponent, canActivate: [AuthGuard]},
{ path: 'salesdivisionmaster/add', component: SalesdivisionmasterformComponent, canActivate: [AuthGuard]},
{ path: 'salesdivisionmaster/:state/:id', component: SalesdivisionmasterformComponent, canActivate: [AuthGuard]},
{ path: 'uommaster/add', component: UommasterformComponent, canActivate: [AuthGuard]},
{ path: 'uommaster/:state/:id', component: UommasterformComponent, canActivate: [AuthGuard]},
{ path: 'sitemaster/add', component: SitemasterformComponent, canActivate: [AuthGuard]},
{ path: 'sitemaster/:state/:id', component: SitemasterformComponent, canActivate: [AuthGuard]},
{ path: 'buildingmaster/add', component: BuildingmasterformComponent, canActivate: [AuthGuard]},
{ path: 'buildingmaster/:state/:id', component: BuildingmasterformComponent, canActivate: [AuthGuard]},
{ path: 'floormaster/add', component: FloormasterformComponent, canActivate: [AuthGuard]},
{ path: 'floormaster/:state/:id', component: FloormasterformComponent, canActivate: [AuthGuard]},
{ path: 'roommaster/add', component: RoommasterformComponent, canActivate: [AuthGuard]},
{ path: 'roommaster/:state/:id', component: RoommasterformComponent, canActivate: [AuthGuard]},
{ path: 'locationmaster/add', component: LocationmasterformComponent, canActivate: [AuthGuard]},
{ path: 'locationmaster/:state/:id', component: LocationmasterformComponent, canActivate: [AuthGuard]},
{ path: 'departmentmaster/add', component: DepartmentmasterformComponent, canActivate: [AuthGuard]},
{ path: 'departmentmaster/:state/:id', component: DepartmentmasterformComponent, canActivate: [AuthGuard]},
{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
{ path: 'brandmaster', component: BrandmastergridComponent, canActivate: [AuthGuard]},
{ path: 'brandmaster/add', component: BrandmasterformComponent, canActivate: [AuthGuard]},
{ path: 'brandmaster/:state/:id', component: BrandmasterformComponent, canActivate: [AuthGuard]},
{ path: 'modelmaster', component: BrandmodelmastergridComponent, canActivate: [AuthGuard]},
{ path: 'modelmaster/add', component: BrandmodelmasterformComponent, canActivate: [AuthGuard]},
{ path: 'modelmaster/:state/:id', component: BrandmodelmasterformComponent, canActivate: [AuthGuard]},
{ path: 'assetcategory', component: AssetcategorymastergridComponent, canActivate: [AuthGuard]},
{ path: 'assetcategory/add', component: AssetcategorymasterformComponent, canActivate: [AuthGuard]},
{ path: 'assetcategory/:state/:id', component: AssetcategorymasterformComponent, canActivate: [AuthGuard]},
{ path: 'assetsubcategory', component: AssetsubcategorymastergridComponent, canActivate: [AuthGuard]},
{ path: 'assetsubcategory/add', component: AssetsubcategorymasterformComponent, canActivate: [AuthGuard]},
{ path: 'assetsubcategory/:state/:id', component: AssetsubcategorymasterformComponent, canActivate: [AuthGuard]},
{ path: 'employeemaster', component: EmployeemastergridComponent, canActivate: [AuthGuard]},
{ path: 'employeemaster/add', component: EmployeemasterformComponent, canActivate: [AuthGuard]},
{ path: 'employeemaster/:state/:id', component: EmployeemasterformComponent, canActivate: [AuthGuard]},
{ path: 'suppliermaster', component: SuppliermastergridComponent, canActivate: [AuthGuard]},
{ path: 'suppliermaster/add', component: SuppliermasterformComponent, canActivate: [AuthGuard]},
{ path: 'suppliermaster/:state/:id', component: SuppliermasterformComponent, canActivate: [AuthGuard]},
{ path: 'customermaster', component: CustomermastergridComponent, canActivate: [AuthGuard]},
{ path: 'customermaster/add', component: CustomermasterformComponent, canActivate: [AuthGuard]},
{ path: 'customermaster/:state/:id', component: CustomermasterformComponent, canActivate: [AuthGuard]},
{ path: 'itemmaster', component: ItemmastergridComponent, canActivate: [AuthGuard]},
{ path: 'itemmaster/add', component: ItemmasterformComponent, canActivate: [AuthGuard]},
{ path: 'itemmaster/:state/:id', component: ItemmasterformComponent, canActivate: [AuthGuard]},
{ path: 'taxmaster', component: TaxmastergridComponent, canActivate: [AuthGuard]},
{ path: 'taxmaster/add', component: TaxmasterformComponent, canActivate: [AuthGuard]},
{ path: 'taxmaster/:state/:id', component: TaxmasterformComponent, canActivate: [AuthGuard]},
{ path: 'paymentmethod', component: PaymentmethodgridComponent, canActivate: [AuthGuard]},
{ path: 'paymentmethod/add', component: PaymentmethodformComponent, canActivate: [AuthGuard]},
{ path: 'paymentmethod/:state/:id', component: PaymentmethodformComponent, canActivate: [AuthGuard]},
//{ path: 'valuelist', component: AssetdisposalformComponent},
{ path: 'valuelist', component: CommonvaluelistgridComponent, canActivate: [AuthGuard]},
//{ path: 'valuelist', component: ProductmastergridComponent, canActivate: [AuthGuard]},
{ path: 'valuelist/add', component: CommonvaluelistformComponent, canActivate: [AuthGuard]},
//{ path: 'product/add', component: ProductmasterformComponent, canActivate: [AuthGuard]},
{ path: 'valuelist/:state/:id', component: CommonvaluelistformComponent, canActivate: [AuthGuard]},
{ path: 'productmaster', component: ProductmastergridComponent, canActivate: [AuthGuard]},
{ path: 'productmaster/add', component: ProductmasterformComponent, canActivate: [AuthGuard]},
{ path: 'productmaster/:state/:id', component: ProductmasterformComponent, canActivate: [AuthGuard]},
{ path: 'auditmaster', component: AuditmastergridComponent, canActivate: [AuthGuard]},
{ path: 'auditmaster/add', component: AuditmasterformComponent, canActivate: [AuthGuard]},
{ path: 'auditmaster/:state/:id', component: AuditmasterformComponent, canActivate: [AuthGuard]},
// { path: 'receipt', component: ReceiptmastergridComponent, canActivate: [AuthGuard]},
// { path: 'receipt/add', component: ReceiptmasterformComponent, canActivate: [AuthGuard]},
// { path: 'receipt/:state/:id', component: ReceiptmasterformComponent, canActivate: [AuthGuard]},
// { path: 'purchaseorder/add', component: ReceiptmasterformComponent, canActivate: [AuthGuard]},
// { path: 'purchaseorder/:state/:id', component: ReceiptmasterformComponent, canActivate: [AuthGuard]},
{
  path: 'master', loadChildren: () => import('./features/master/master.module').then(m => m.MasterModule)
},
{ path: 'transaction', loadChildren: () => import('./features/transaction/transaction.module').then(m => m.TransactionModule) },
{ path: '', redirectTo: 'login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
