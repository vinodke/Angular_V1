import { NgModule } from '@angular/core';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { SharedModule } from '../../shared/shared.module';
import { CompanyComponent } from './company/company.component';
import { BuildingmasterformComponent } from './buildingmaster/buildingmasterform/buildingmasterform.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FloormasterformComponent } from './floormaster/floormasterform/floormasterform.component';
import { RoommasterformComponent } from './roommaster/roommasterform/roommasterform.component';
import { LocationmasterformComponent } from './locationmaster/locationmasterform/locationmasterform.component';
import { BuildingmastergridComponent } from './buildingmaster/buildingmastergrid/buildingmastergrid.component';
import { AgGridModule } from 'ag-grid-angular';
import { FloormastergridComponent } from './floormaster/floormastergrid/floormastergrid.component';
import { RoommastergridComponent } from './roommaster/roommastergrid/roommastergrid.component';
import { LocationmastergridComponent } from './locationmaster/locationmastergrid/locationmastergrid.component';
import { DepartmentmasterformComponent } from './departmentmaster/departmentmasterform/departmentmasterform.component';
import { DepartmentmastergridComponent } from './departmentmaster/departmentmastergrid/departmentmastergrid.component';
import { BrandmasterformComponent } from './brandmaster/brandmasterform/brandmasterform.component';
import { BrandmastergridComponent } from './brandmaster/brandmastergrid/brandmastergrid.component';
import { BrandmodelmasterformComponent } from './brandmodelmaster/brandmodelmasterform/brandmodelmasterform.component';
import { BrandmodelmastergridComponent } from './brandmodelmaster/brandmodelmastergrid/brandmodelmastergrid.component';
import { AssetcategorymasterformComponent } from './assetcategorymaster/assetcategorymasterform/assetcategorymasterform.component';
import { AssetcategorymastergridComponent } from './assetcategorymaster/assetcategorymastergrid/assetcategorymastergrid.component';
import { AssetsubcategorymasterformComponent } from './assetsubcategorymaster/assetsubcategorymasterform/assetsubcategorymasterform.component';
import { AssetsubcategorymastergridComponent } from './assetsubcategorymaster/assetsubcategorymastergrid/assetsubcategorymastergrid.component';
import { EmployeemasterformComponent } from './employeemaster/employeemasterform/employeemasterform.component';
import { EmployeemastergridComponent } from './employeemaster/employeemastergrid/employeemastergrid.component';
import { CommonvaluelistgridComponent } from './commonvaluelist/commonvaluelistgrid/commonvaluelistgrid.component';
import { CommonvaluelistformComponent } from './commonvaluelist/commonvaluelistform/commonvaluelistform.component';
import { SuppliermasterformComponent } from './suppliermaster/suppliermasterform/suppliermasterform.component';
import { SuppliermastergridComponent } from './suppliermaster/suppliermastergrid/suppliermastergrid.component';
import { ReceiptmasterformComponent } from './receiptmaster/receiptmasterform/receiptmasterform.component';
import { ReceiptmastergridComponent } from './receiptmaster/receiptmastergrid/receiptmastergrid.component';
import { ProductmasterformComponent } from './productmaster/productmasterform/productmasterform.component';
import { ProductmastergridComponent } from './productmaster/productmastergrid/productmastergrid.component';
import { CompanymasterformComponent } from './companymaster/companymasterform/companymasterform.component';
import { CompanymastergridComponent } from './companymaster/companymastergrid/companymastergrid.component';
import { RegionmasterformComponent } from './regionmaster/regionmasterform/regionmasterform.component';
import { RegionmastergridComponent } from './regionmaster/regionmastergrid/regionmastergrid.component';
import { WarehousemasterformComponent } from './warehousemaster/warehousemasterform/warehousemasterform.component';
import { WarehousemastergridComponent } from './warehousemaster/warehousemastergrid/warehousemastergrid.component';
import { KaratmasterformComponent } from './karatmaster/karatmasterform/karatmasterform.component';
import { KaratmastergridComponent } from './karatmaster/karatmastergrid/karatmastergrid.component';
import { CategorymasterformComponent } from './categorymaster/categorymasterform/categorymasterform.component';
import { CategorymastergridComponent } from './categorymaster/categorymastergrid/categorymastergrid.component';
import { SubcategorymasterformComponent } from './subcategorymaster/subcategorymasterform/subcategorymasterform.component';
import { SubcategorymastergridComponent } from './subcategorymaster/subcategorymastergrid/subcategorymastergrid.component';
import { ItembrandmasterformComponent } from './itembrandmaster/itembrandmasterform/itembrandmasterform.component';
import { ItembrandmastergridComponent } from './itembrandmaster/itembrandmastergrid/itembrandmastergrid.component';
import { ItemcollectionmasterformComponent } from './itemcollectionmaster/itemcollectionmasterform/itemcollectionmasterform.component';
import { ItemcollectionmastergridComponent } from './itemcollectionmaster/itemcollectionmastergrid/itemcollectionmastergrid.component';
import { ItemfamilymasterformComponent } from './itemfamilymaster/itemfamilymasterform/itemfamilymasterform.component';
import { ItemfamilymastergridComponent } from './itemfamilymaster/itemfamilymastergrid/itemfamilymastergrid.component';
import { ItemgroupmasterformComponent } from './itemgroupmaster/itemgroupmasterform/itemgroupmasterform.component';
import { ItemgroupmastergridComponent } from './itemgroupmaster/itemgroupmastergrid/itemgroupmastergrid.component';
import { BankmasterformComponent } from './bankmaster/bankmasterform/bankmasterform.component';
import { BankmastergridComponent } from './bankmaster/bankmastergrid/bankmastergrid.component';
import { CashcountermasterformComponent } from './cashcountermaster/cashcountermasterform/cashcountermasterform.component';
import { CashcountermastergridComponent } from './cashcountermaster/cashcountermastergrid/cashcountermastergrid.component';
import { ColormasterformComponent } from './colormaster/colormasterform/colormasterform.component';
import { ColormastergridComponent } from './colormaster/colormastergrid/colormastergrid.component';
import { SalesdivisionmasterformComponent } from './salesdivisionmaster/salesdivisionmasterform/salesdivisionmasterform.component';
import { SalesdivisionmastergridComponent } from './salesdivisionmaster/salesdivisionmastergrid/salesdivisionmastergrid.component';
import { UommasterformComponent } from './uommaster/uommasterform/uommasterform.component';
import { UommastergridComponent } from './uommaster/uommastergrid/uommastergrid.component';
import { CustomermasterformComponent } from './customermaster/customermasterform/customermasterform.component';
import { CustomermastergridComponent } from './customermaster/customermastergrid/customermastergrid.component';
import { ItemmasterformComponent } from './itemmaster/itemmasterform/itemmasterform.component';
import { ItemmastergridComponent } from './itemmaster/itemmastergrid/itemmastergrid.component';
import { ModalModule } from '../../core/_modal';
import { TaxmasterformComponent } from './taxmaster/taxmasterform/taxmasterform.component';
import { TaxmastergridComponent } from './taxmaster/taxmastergrid/taxmastergrid.component';
import { PaymentmethodformComponent } from './paymentmethod/paymentmethodform/paymentmethodform.component';
import { PaymentmethodgridComponent } from './paymentmethod/paymentmethodgrid/paymentmethodgrid.component';
import { AuditmasterformComponent } from './auditmaster/auditmasterform/auditmasterform.component';
import { AuditmastergridComponent } from './auditmaster/auditmastergrid/auditmastergrid.component';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [MasterComponent, CompanyComponent, BuildingmasterformComponent, FloormasterformComponent, RoommasterformComponent, LocationmasterformComponent, BuildingmastergridComponent, FloormastergridComponent, RoommastergridComponent, LocationmastergridComponent, DepartmentmasterformComponent, DepartmentmastergridComponent, BrandmasterformComponent, BrandmastergridComponent, BrandmodelmasterformComponent, BrandmodelmastergridComponent, AssetcategorymasterformComponent, AssetcategorymastergridComponent, AssetsubcategorymasterformComponent, AssetsubcategorymastergridComponent, EmployeemasterformComponent, EmployeemastergridComponent, CommonvaluelistgridComponent, CommonvaluelistformComponent, SuppliermasterformComponent, SuppliermastergridComponent, ReceiptmasterformComponent, ReceiptmastergridComponent, ProductmasterformComponent, ProductmastergridComponent, CompanymasterformComponent, CompanymastergridComponent, RegionmasterformComponent, RegionmastergridComponent, WarehousemasterformComponent, WarehousemastergridComponent, KaratmasterformComponent, KaratmastergridComponent, CategorymasterformComponent, CategorymastergridComponent, SubcategorymasterformComponent, SubcategorymastergridComponent, ItembrandmasterformComponent, ItembrandmastergridComponent, ItemcollectionmasterformComponent, ItemcollectionmastergridComponent, ItemfamilymasterformComponent, ItemfamilymastergridComponent, ItemgroupmasterformComponent, ItemgroupmastergridComponent, BankmasterformComponent, BankmastergridComponent, CashcountermasterformComponent, CashcountermastergridComponent, ColormasterformComponent, ColormastergridComponent, SalesdivisionmasterformComponent, SalesdivisionmastergridComponent, UommasterformComponent, UommastergridComponent, CustomermasterformComponent, CustomermastergridComponent, ItemmasterformComponent, ItemmastergridComponent, TaxmasterformComponent, TaxmastergridComponent, PaymentmethodformComponent, PaymentmethodgridComponent, AuditmasterformComponent, AuditmastergridComponent],
  imports: [
    SharedModule,
    BrowserModule,
    MasterRoutingModule,
    ModalModule,
    ReactiveFormsModule,
    NgSelectModule,
    AgGridModule.withComponents([])
  ],
  providers:[DatePipe],
  exports:[WarehousemasterformComponent,SuppliermasterformComponent,CustomermasterformComponent,ItemmasterformComponent,CategorymasterformComponent,SubcategorymasterformComponent]

})
export class MasterModule { }
