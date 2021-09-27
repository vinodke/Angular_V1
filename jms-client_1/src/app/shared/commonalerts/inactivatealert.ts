import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { AuditmasterService } from "src/app/core/service/auditmaster.service";
import Swal from "sweetalert2";
import { AssetCategoryMasterService } from '../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../core/service/assetsubcategorymaster.service';
import { AssetVerificationService } from '../../core/service/assetverification.service';
import { bankmasterservice } from "../../core/service/bankmaster.service";
import { BrandmasterService } from '../../core/service/brandmaster.service';
import { BrandmodelmasterService } from '../../core/service/brandmodelmaster.service';
import { BuildingmasterService } from '../../core/service/buildingmaster.service';
import { cashcountermasterservice } from "../../core/service/cashcountermaster.service";
import { categorymasterservice } from "../../core/service/categorymaster.service";
import { colormasterservice } from "../../core/service/colormaster.service";
import { CommonValueListService } from '../../core/service/commonlistvalue.service';
import { companymasterservice } from "../../core/service/companymaster.service";
import { customerMasterService } from "../../core/service/customermaster.service";
import { DepartmentmasterService } from '../../core/service/departmentmaster.service';
import { EmployeeMasterService } from '../../core/service/employeemaster.service';
import { FloormasterService } from '../../core/service/floormaster.service';
import { itembrandmasterservice } from "../../core/service/itembrandmaster.service";
import { itemcollectionmasterservice } from "../../core/service/itemcollectionmaster.service";
import { itemfamilymasterservice } from "../../core/service/itemfamilymaster.service";
import { itemgroupmasterservice } from "../../core/service/itemgroupmaster.service";
import { itemMasterService } from "../../core/service/itemmaster.service";
import { karatmasterservice } from "../../core/service/karatmaster.service";
import { LocationmasterService } from '../../core/service/locationmaster.service';
import { paymentmethodService } from "../../core/service/paymentmethod.service";
import { ProductMasterService } from '../../core/service/productmaster.service';
import { purchaseorderService } from "../../core/service/purchaseorder.service";
import { receiptService } from "../../core/service/receipt.service";
//import { ReceiptMasterService } from '../../core/service/purchaseorder.service';
import { regionmasterservice } from "../../core/service/regionmaster.service";
import { RoommasterService } from '../../core/service/roommaster.service';
import { salesdivisionmasterservice } from "../../core/service/salesdivisionmaster.service";
import { SitemasterService } from '../../core/service/sitemaster.service';
import { subcategorymasterservice } from "../../core/service/subcategorymaster.service";
import { SupplierMasterService } from '../../core/service/suppliermaster.service';
import { taxmasterService } from "../../core/service/taxmaster.service";
import { uommasterservice } from "../../core/service/uommaster.service";
import { warehousemasterservice } from "../../core/service/warehousemaster.service";

@Injectable({
  providedIn: 'root'
})

export class InactivateAlert {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private companymasterService: companymasterservice,
    private regionmasterService: regionmasterservice,
    private warehousemasterService: warehousemasterservice,
    private karatmasterService: karatmasterservice,
    private categorymasterService: categorymasterservice,
    private subcategorymasterService: subcategorymasterservice,
    private itembrandmasterService: itembrandmasterservice,
    private itemfamilymasterService: itemfamilymasterservice,
    private itemgroupmasterService: itemgroupmasterservice,
    private itemcollectionmasterService: itemcollectionmasterservice,
    private bankmasterService: bankmasterservice,
    private cashCountermasterService: cashcountermasterservice,
    private colormasterService: colormasterservice,
    private salesDivisionmasterService: salesdivisionmasterservice,
    private uommasterService: uommasterservice,
    private itemMasterService: itemMasterService,
    private sitemasterService: SitemasterService,
    private buildingMasterService: BuildingmasterService,
    private floorMasterService: FloormasterService,
    private roomMasterService: RoommasterService,
    private locationMasterService: LocationmasterService,
    private departmentMasterService: DepartmentmasterService,
    private brandMasterService: BrandmasterService,
    private brandmodelMasterService: BrandmodelmasterService,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private employeeMasterService: EmployeeMasterService,
    private commonValueListService: CommonValueListService,
    private supplierMasterService: SupplierMasterService,
    private customerMasterService: customerMasterService,
    private purchaseorderService: purchaseorderService,
    private receiptService: receiptService,
    private taxmasterService: taxmasterService,
    private paymentmethodserice: paymentmethodService,
    //private receiptMasterService: ReceiptMasterService,
    private productMasterService: ProductMasterService,
    private assetRegisterService: AssetRegisterService,
    private auditmasterService: AuditmasterService,
    private assetVerificationService: AssetVerificationService) { }

  InactivateConfirmBox(Id: string, entityName: string) {
    let deleteResponse: Observable<any>;


    Swal.fire({
      title: 'Are you sure you want to Inactivate?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        deleteResponse = this.CallApiMethodToInactivate(Id, entityName) as Observable<any>;
        deleteResponse.subscribe(
          result => {
            this.CallServiceToInactivateFromCache(Id, entityName);
            this.SuccessMessage();
            this.reload(entityName);
          },
          err => {
            Swal.fire(
              'Error',
              err.error,
              'error'
            )

          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled'
        )
      }
    })
  }


  // ------------------------------- Release Popup-------------------------------


  ReleaseConfirmBox(Id: any, entityName: string) {
    let releaseResponse: Observable<any>



    Swal.fire({
      title: 'Are you sure you want to Release?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        releaseResponse = this.CallApiMethodToRelease(Id, entityName) as Observable<any>;
        releaseResponse.subscribe(
          result => {
            this.SuccessMessage();
            this.auditmasterService.refreshClickevent.next()
            //this.reload(entityName);
          },
          err => {
            Swal.fire(
              'Error',
              err.error,
              'error'
            )

          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled'
        )
      }
    })
  }

  VerifyConfirmBox(Id: string, Locations: any) {
    let releaseResponse: Observable<any>

    Swal.fire({
      title: 'Are you sure you want to Verify?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        debugger
        releaseResponse = this.CallApiMethodToVerify(Id, Locations) as Observable<any>;
        releaseResponse.subscribe(
          result => {
            this.SuccessMessage();
            //this.auditmasterService.refreshClickevent.next()
            //this.reload(entityName);
          },
          err => {
            Swal.fire(
              'Error',
              err.error,
              'error'
            )

          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled'
        )
      }
    })
  }

  reload(entityName: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./' + entityName], { relativeTo: this.route });
  }

  SuccessReleaseMessage() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    Toast.fire({
      icon: 'success',
      title: 'Successfully Released!!!'
    });
  }

  SuccessMessage() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    Toast.fire({
      icon: 'success',
      title: 'Successfully Inactivated!!!'
    });
  }

  CallApiMethodToRelease(Id: any, entityName: string) {
    switch (entityName) {

      case 'auditmaster': {
        return this.auditmasterService.releaseAuditmaster(Id);
      }
      default: {
        return null;
        break;
      }
    }
  }

  CallApiMethodToVerify(Id: string, Locations: any) {

    return this.auditmasterService.veridyAuditmaster(Id, Locations);

  }

  CallApiMethodToInactivate(Id: string, entityName: string) {
    switch (entityName) {
      case 'paymentmethod': {
        return this.paymentmethodserice.DeletePaymentMethod(parseInt(Id));
      }
      case 'taxmaster': {
        return this.taxmasterService.DeleteTaxMaster(parseInt(Id));
      }
      case 'receipt': {
        return this.receiptService.DeleteReceipt(Id);
      }
      case 'purchaseorder': {
        return this.purchaseorderService.DeletePO(Id);
      }
      case 'companymaster': {
        return this.companymasterService.DeleteMaster(Id);
      }
      case 'regionmaster': {
        return this.regionmasterService.DeleteMaster(parseInt(Id));
      }
      case 'warehousemaster': {
        return this.warehousemasterService.DeleteMaster(parseInt(Id));
      }
      case 'karatmaster': {
        return this.karatmasterService.DeleteMaster(parseInt(Id));
      }
      case 'categorymaster': {
        return this.categorymasterService.DeleteMaster(parseInt(Id));
      }
      case 'subcategorymaster': {
        return this.subcategorymasterService.DeleteMaster(parseInt(Id));
      }
      case 'itembrandmaster': {
        return this.itembrandmasterService.DeleteMaster(parseInt(Id));
      }
      case 'itemcollectionmaster': {
        return this.itemcollectionmasterService.DeleteMaster(parseInt(Id));
      }
      case 'itemfamilymaster': {
        return this.itemfamilymasterService.DeleteMaster(parseInt(Id));
      }
      case 'itemgroupmaster': {
        return this.itemgroupmasterService.DeleteMaster(parseInt(Id));
      }
      case 'bankmaster': {
        return this.bankmasterService.DeleteMaster(parseInt(Id));
      }
      case 'cashcountermaster': {
        return this.cashCountermasterService.DeleteMaster(parseInt(Id));
      }
      case 'colormaster': {
        return this.colormasterService.DeleteMaster(parseInt(Id));
      }
      case 'salesdivisionmaster': {
        return this.salesDivisionmasterService.DeleteMaster(parseInt(Id));
      }
      case 'uommaster': {
        return this.uommasterService.DeleteMaster(parseInt(Id));
      }
      case 'customermaster': {
        return this.customerMasterService.DeleteCustomerMaster(parseInt(Id));
      }
      case 'itemmaster': {
        return this.itemMasterService.DeleteItemMaster(parseInt(Id));
      }
      case 'sitemaster': {
        return this.sitemasterService.DeleteSiteMaster(parseInt(Id));
      }
      case 'buildingmaster': {
        return this.floorMasterService.DeleteFloorMaster(parseInt(Id));
        break;
      }
      case 'roommaster': {
        return this.roomMasterService.DeleteRoomMaster(parseInt(Id));
        break;
      }
      case 'locationmaster': {
        return this.locationMasterService.DeleteLocationMaster(parseInt(Id));
        break;
      }
      case 'departmentmaster': {
        return this.departmentMasterService.DeleteDepartmentMaster(parseInt(Id));
        break;
      }
      case 'brandmaster': {
        return this.brandMasterService.DeleteBrandMaster(parseInt(Id));
        break;
      }
      case 'modelmaster': {
        return this.brandmodelMasterService.DeleteBrandmodelMaster(parseInt(Id));
        break;
      }
      case 'assetcategory': {
        return this.assetCategoryMasterService.DeleteAssetCategoryMaster(parseInt(Id));
        break;
      }
      case 'assetsubcategory': {
        return this.assetSubCategoryMasterService.DeleteAssetSubCategoryMaster(parseInt(Id));
        break;
      }
      case 'employeemaster': {
        return this.employeeMasterService.DeleteEmployeeMaster(parseInt(Id));
        break;
      }
      // case 'commonvaluelistmaster' : {
      //   return this.commonValueListService.de();
      //   break;
      // }
      case 'suppliermaster': {
        return this.supplierMasterService.DeleteSupplierMaster(parseInt(Id));
        break;
      }
      // case 'receiptmaster' : {
      //   return this.receiptMasterService.onRefreshReceiptMaster();
      //   break;
      // }
      case 'productmaster': {
        return this.productMasterService.DeleteProductMaster(parseInt(Id));
        break;
      }
      case 'auditmaster': {
        return this.auditmasterService.DeleteAuditMaster(Id);
        break;
      }
      // case 'assetregister' : {
      //   return this.assetRegisterService.onRefreshAssetRegister();
      //   break;
      // }
      // case 'assetverification' : {
      //   return this.assetVerificationService.onRefreshAssetVerification();
      //   break;
      // }
      default: {
        return null;
        break;
      }
    }
  }


  CallServiceToInactivateFromCache(Id: string, entityName: string) {
    switch (entityName) {
      case 'paymentmethod': {
        this.paymentmethodserice.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'taxmaster': {
        this.taxmasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'companymaster': {
        this.companymasterService.DeleteFromCache(Id);
        break;
      }
      case 'regionmaster': {
        this.regionmasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'warehousemaster': {
        this.warehousemasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'karatmaster': {
        this.karatmasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'categorymaster': {
        this.categorymasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'subcategorymaster': {
        this.subcategorymasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'itembrandmaster': {
        this.itembrandmasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'itemcollectionmaster': {
        this.itemcollectionmasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'itemfamilymaster': {
        this.itemfamilymasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'itemgroupmaster': {
        this.itemgroupmasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'bankmaster': {
        this.bankmasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'cashcountermaster': {
        this.cashCountermasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'colormaster': {
        this.colormasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'salesdivisionmaster': {
        this.salesDivisionmasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'uommaster': {
        this.uommasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'customermaster': {
        this.customerMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'itemmaster': {
        this.itemMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'sitemaster': {
        this.sitemasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'buildingmaster': {
        return this.buildingMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'floormaster': {
        return this.floorMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'roommaster': {
        return this.roomMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'locationmaster': {
        return this.locationMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'departmentmaster': {
        return this.departmentMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'brandmaster': {
        return this.brandMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'modelmaster': {
        return this.brandmodelMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'assetcategory': {
        return this.assetCategoryMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'assetsubcategory': {
        return this.assetSubCategoryMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'employeemaster': {
        return this.employeeMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      // case 'commonvaluelistmaster' : {
      //   return this.commonValueListService.DeleteFromCache(Id);
      //   break;
      // }
      case 'suppliermaster': {
        return this.supplierMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      // case 'receiptmaster' : {
      //   return this.receiptMasterService.DeleteFromCache(Id);
      //   break;
      // }
      case 'productmaster': {
        return this.productMasterService.DeleteFromCache(parseInt(Id));
        break;
      }
      case 'auditmaster': {
        return this.auditmasterService.DeleteFromCache(Id);
        break;
      }
      // case 'assetregister' : {
      //   return this.assetRegisterService.DeleteFromCache(Id);
      //   break;
      // }
      // case 'assetverification' : {
      //   return this.assetVerificationService.DeleteFromCache(Id);
      //   break;
      // }
      default: {
        return null;
        break;
      }
    }
  }
}
