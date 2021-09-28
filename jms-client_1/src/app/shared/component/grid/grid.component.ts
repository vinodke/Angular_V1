import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { Subscription } from 'rxjs';
import { companymasterservice } from '../../../core/service/companymaster.service';
import { AdditionalCostDetailsService } from '../../../core/service/additionalcostdetails.service';
import { AssetCategoryMasterService } from '../../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../core/service/assetsubcategorymaster.service';
import { AssetVerificationService } from '../../../core/service/assetverification.service';
import { BrandmasterService } from '../../../core/service/brandmaster.service';
import { BrandmodelmasterService } from '../../../core/service/brandmodelmaster.service';
import { BuildingmasterService } from '../../../core/service/buildingmaster.service';
import { CommonValueListService } from '../../../core/service/commonlistvalue.service';
import { DepartmentmasterService } from '../../../core/service/departmentmaster.service';
import { EmployeeMasterService } from '../../../core/service/employeemaster.service';
import { FloormasterService } from '../../../core/service/floormaster.service';
import { InsuranceDetailsService } from '../../../core/service/insurancedetails.service';
import { LocationmasterService } from '../../../core/service/locationmaster.service';
import { ProductMasterService } from '../../../core/service/productmaster.service';
//import { ReceiptMasterService } from '../../../core/service/purchaseorder.service';
import { RoommasterService } from '../../../core/service/roommaster.service';
import { SitemasterService } from '../../../core/service/sitemaster.service';
import { SupplierMasterService } from '../../../core/service/suppliermaster.service';
import { WarrantyDetailsService } from '../../../core/service/warrantydetails.service';
import { regionmasterservice } from '../../../core/service/regionmaster.service';
import { warehousemasterservice } from '../../../core/service/warehousemaster.service';
import { karatmasterservice } from '../../../core/service/karatmaster.service';
import { categorymasterservice } from '../../../core/service/categorymaster.service';
import { subcategorymasterservice } from '../../../core/service/subcategorymaster.service';
import { itembrandmasterservice } from '../../../core/service/itembrandmaster.service';
import { itemcollectionmasterservice } from '../../../core/service/itemcollectionmaster.service';
import { itemfamilymasterservice } from '../../../core/service/itemfamilymaster.service';
import { itemgroupmasterservice } from '../../../core/service/itemgroupmaster.service';
import { bankmasterservice } from '../../../core/service/bankmaster.service';
import { cashcountermasterservice } from '../../../core/service/cashcountermaster.service';
import { colormasterservice } from '../../../core/service/colormaster.service';
import { salesdivisionmasterservice } from '../../../core/service/salesdivisionmaster.service';
import { uommasterservice } from '../../../core/service/uommaster.service';
import { customerMasterService } from '../../../core/service/customermaster.service';
import { itemMasterService } from '../../../core/service/itemmaster.service';
import { taxmasterService } from '../../../core/service/taxmaster.service';
import { paymentmethodService } from '../../../core/service/paymentmethod.service';
import { AuditmasterService } from 'src/app/core/service/auditmaster.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'org-fat-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @Input() entity: string = '';
  isRowUnSelected: boolean = true;
  public auditDataInRow:any
  rowData: any;
  columnDefs: any;
  public gridApi: any
  @Output() auditRowData = new EventEmitter()
  subscription!: Subscription;
  auditID: string = '';
  constructor(private router: Router,
    private companyMasterService: companymasterservice,
    private auditMasterService: AuditmasterService,
    private regionMasterService: regionmasterservice,
    private warehouseMasterService: warehousemasterservice,
    private karatMasterService: karatmasterservice,
    private categoryasterService: categorymasterservice,
    private subcategoryasterService: subcategorymasterservice,
    private itembrandasterService: itembrandmasterservice,
    private itemcollectionasterService: itemcollectionmasterservice,
    private itemfamilymasterservice: itemfamilymasterservice,
    private itemgroupmasterservice: itemgroupmasterservice,
    private bankmasterservice: bankmasterservice,
    private cashcountermasterservice: cashcountermasterservice,
    private colormasterservice: colormasterservice,
    private salesdivisionmasterservice: salesdivisionmasterservice,
    private uommasterservice: uommasterservice,
    private itemMasterService: itemMasterService,
    private siteMasterService: SitemasterService,
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
    private taxmasterservice: taxmasterService,
    private paymentmethodService: paymentmethodService,
    //private receiptMasterService: ReceiptMasterService,
    private productMasterService: ProductMasterService,
    private assetRegisterService: AssetRegisterService,
    private assetVerificationService: AssetVerificationService,
    private warrantyDetailsService: WarrantyDetailsService,
    private insuranceDetailsService: InsuranceDetailsService,
    private additionalCostDetailsService: AdditionalCostDetailsService,
    private datepipe: DatePipe,
    private route: ActivatedRoute) {
    this.subscription = new Subscription;
  }




  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.auditID= params.id;
    });
    //this.agGrid.api.sizeColumnsToFit();
    
    switch (this.entity) {
      case 'companymaster': {
        this.columnDefs = [
          { field: 'companyCode', sortable: true, filter: true },
          { field: 'companyName', sortable: true, filter: true },
          { field: 'address1', sortable: true, filter: true },
          { field: 'address2', sortable: true, filter: true },
          { field: 'city', sortable: true, filter: true },
          { field: 'state', sortable: true, filter: true },
          { field: 'country', sortable: true, filter: true },
          { field: 'contactNumber', sortable: true, filter: true },
          { field: 'contactEmail', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.companyMasterService.getCompanyMaster();

        this.subscription = this.companyMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'paymentmethod': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { headerName: 'Store/Warehouse', field: 'warehouseName', sortable: true, filter: true },
          { headerName: 'Payment Method Name', field: 'paymentMethodName', sortable: true, filter: true },
          { headerName: 'Reference Number', field: 'referenceNumber', sortable: true, filter: true },
          { headerName: 'Reference URL', field: 'referenceURL', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.paymentmethodService.getPaymentMethod();

        this.subscription = this.paymentmethodService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'taxmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { headerName: 'Category Name', field: 'categoryName', sortable: true, filter: true },
          { headerName: 'UOM Name', field: 'uomName', sortable: true, filter: true },
          { headerName: 'Karat Name', field: 'karatName', sortable: true, filter: true },
          { headerName: 'Item Tax', field: 'itemTax', sortable: true, filter: true },
          { headerName: 'Labour Tax', field: 'labourTax', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.taxmasterservice.getTaxMaster();

        this.subscription = this.taxmasterservice.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'regionmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'regionCode', sortable: true, filter: true },
          { field: 'regionName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.regionMasterService.getRegionMaster();

        this.subscription = this.regionMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'warehousemaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'regionName', sortable: true, filter: true },
          { field: 'warehouseCode', sortable: true, filter: true },
          { field: 'warehouseName', sortable: true, filter: true },
          { field: 'address1', sortable: true, filter: true },
          { field: 'address2', sortable: true, filter: true },
          { field: 'city', sortable: true, filter: true },
          { field: 'state', sortable: true, filter: true },
          { field: 'contactNumber', sortable: true, filter: true },
          { field: 'contactEmail', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.warehouseMasterService.getWarehouseMaster();

        this.subscription = this.warehouseMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'departmentmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'departmentCode', sortable: true, filter: true, resizable: true },
          { field: 'departmentName', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.departmentMasterService.getDepartmentMaster();

        this.subscription = this.departmentMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'auditmasterverify': {
        debugger
  //       this.route.queryParams
  //   .subscribe(params => {
  //     console.log(params); // { orderby: "price" }
  //     this.auditID = params.auditID;
  //   }
  // );

        this.columnDefs = [
          { field: 'auditID', sortable: true, filter: true, resizable: true },
          { field: 'systemLocationCode', sortable: true, filter: true, resizable: true },
          
          { field: 'scanLocationCode', sortable: true, filter: true, resizable: true },

          { field: 'serialNumber', sortable: true, filter: true, resizable: true },
          { field: 'statusText', sortable: true, filter: true, resizable: true },
          { field: 'itemCode', sortable: true, filter: true, resizable: true },
          { field: 'itemName', sortable: true, filter: true, resizable: true },
        ];
debugger
        this.rowData = await this.auditMasterService.getAuditVerifyReport(this.auditID);
        this.rowData = this.rowData.locationMismatch;
        // this.subscription = this.auditMasterService.refreshClickevent.subscribe((e) => {
        //   console.log(e)
        //   this.OnRefreshCick();
        // });
        break;
      }


      case 'auditmaster': {
        const cellClassRules = {
          "status": (params: any) => {
            if (params.status == 40) {
              "Released" 
            } else if (params.status == 30) {
               "Created"
            }
            
          }
        
        };

        this.columnDefs = [
          { field: 'auditID', sortable: true, filter: true, resizable: true },
          { field: 'createdBy', sortable: true, filter: true, resizable: true },
          // { field: 'Status', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Status', field: 'status', sortable: true, filter: true, resizable: true,
            cellRenderer: (data: any): any => {
              console.log(data)
              if (data.data.status == 40) {
               return  "Released"
              } else if(data.data.status == 30) {
                return "Created"
              }
            
            }
          },
          { field: 'warehouseCode', sortable: true, filter: true, resizable: true },

          { field: 'warehouseName', sortable: true, filter: true, resizable: true },
          { field: 'remark', sortable: true, filter: true, resizable: true },
          {
            headerName: 'To be Audited On', field: 'toBeAuditedOn', sortable: true, filter: true, resizable: true,
            cellRenderer: (data: any) => {
              return this.datepipe.transform(data.value, 'dd MMM yyyy');
            }
          }
        ];

        this.rowData = await this.auditMasterService.getAuditMaster();
        this.subscription = this.auditMasterService.refreshClickevent.subscribe((e) => {
          console.log(e)
          this.OnRefreshCick();
        });
        break;
      }

      case 'employeemaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'employeeCode', sortable: true, filter: true, resizable: true },
          { field: 'employeeName', sortable: true, filter: true, resizable: true },
          { field: 'departmentName', sortable: true, filter: true, resizable: true },
          { field: 'designation', sortable: true, filter: true, resizable: true },
          { field: 'contactNumber', sortable: true, filter: true, resizable: true },
          { field: 'mailID', sortable: true, filter: true, resizable: true },
          { field: 'address1', sortable: true, filter: true, resizable: true },
          { field: 'address2', sortable: true, filter: true, resizable: true },
          { field: 'city', sortable: true, filter: true, resizable: true },
          { field: 'country', sortable: true, filter: true, resizable: true },
          { field: 'warehouseName', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.employeeMasterService.getEmployeeMaster();

        this.subscription = this.employeeMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'karatmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'karatCode', sortable: true, filter: true },
          { field: 'karatName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.karatMasterService.getKaratMaster();

        this.subscription = this.karatMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'categorymaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'categoryCode', sortable: true, filter: true },
          { field: 'categoryName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.categoryasterService.getCategoryMaster();

        this.subscription = this.categoryasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'subcategorymaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'subCategoryCode', sortable: true, filter: true },
          { field: 'subCategoryName', sortable: true, filter: true },
          { field: 'categoryName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.subcategoryasterService.getSubCategoryMaster();

        this.subscription = this.subcategoryasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'itembrandmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'itemBrandCode', sortable: true, filter: true },
          { field: 'itemBrandName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.itembrandasterService.getItemBrandMaster();

        this.subscription = this.itembrandasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'itemcollectionmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'itemCollectionCode', sortable: true, filter: true },
          { field: 'itemCollectionName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.itemcollectionasterService.getItemCollectionMaster();

        this.subscription = this.itemcollectionasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'itemfamilymaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'itemFamilyCode', sortable: true, filter: true },
          { field: 'itemFamilyName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.itemfamilymasterservice.getItemFamilyMaster();

        this.subscription = this.itemfamilymasterservice.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'itemgroupmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'itemGroupCode', sortable: true, filter: true },
          { field: 'itemGroupName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.itemgroupmasterservice.getItemGroupMaster();

        this.subscription = this.itemgroupmasterservice.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }


      case 'bankmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'bankName', sortable: true, filter: true },
          { field: 'accountNumber', sortable: true, filter: true },
          { field: 'accountHolderName', sortable: true, filter: true },
          { field: 'branchName', sortable: true, filter: true },
          { field: 'address1', sortable: true, filter: true },
          { field: 'address2', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.bankmasterservice.getBankMaster();

        this.subscription = this.bankmasterservice.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'cashcountermaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'cashCounterName', sortable: true, filter: true },
          { field: 'warehouseName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.cashcountermasterservice.getCashCounterMaster();

        this.subscription = this.cashcountermasterservice.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }


      case 'colormaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'colorCode', sortable: true, filter: true },
          { field: 'colorName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.colormasterservice.getColorMaster();

        this.subscription = this.colormasterservice.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }


      case 'salesdivisionmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'salesDivisionName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.salesdivisionmasterservice.getSalesDivisionMaster();

        this.subscription = this.salesdivisionmasterservice.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }


      case 'uommaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, checkboxSelection: false },
          { field: 'uomCode', sortable: true, filter: true },
          { field: 'uomName', sortable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.uommasterservice.getUOMMaster();

        this.subscription = this.uommasterservice.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'sitemaster': {
        this.columnDefs = [
          { field: 'siteID', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'siteCode', sortable: true, filter: true, resizable: true },
          { field: 'siteName', sortable: true, filter: true, resizable: true },
          { field: 'addressLine1', sortable: true, filter: true, resizable: true },
          { field: 'addressLine2', sortable: true, filter: true, resizable: true },
          { field: 'city', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.siteMasterService.getSiteMaster();

        this.subscription = this.siteMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'buildingmaster': {
        this.columnDefs = [
          { field: 'buildingID', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'buildingCode', sortable: true, filter: true, resizable: true },
          { field: 'buildingName', sortable: true, filter: true, resizable: true },
          { field: 'siteCode', sortable: true, filter: true, resizable: true },
          { field: 'siteName', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.buildingMasterService.getBuildingMaster();

        this.subscription = this.buildingMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'floormaster': {
        this.columnDefs = [
          { field: 'floorID', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'floorCode', sortable: true, filter: true, resizable: true },
          { field: 'floorName', sortable: true, filter: true, resizable: true },
          { field: 'siteCode', sortable: true, filter: true, resizable: true },
          { field: 'siteName', sortable: true, filter: true, resizable: true },
          { field: 'buildingCode', sortable: true, filter: true, resizable: true },
          { field: 'buildingName', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.floorMasterService.getFloorMaster();

        this.subscription = this.floorMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'roommaster': {
        this.columnDefs = [
          { field: 'roomID', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'roomCode', sortable: true, filter: true, resizable: true },
          { field: 'roomName', sortable: true, filter: true, resizable: true },
          { field: 'siteCode', sortable: true, filter: true, resizable: true },
          { field: 'siteName', sortable: true, filter: true, resizable: true },
          { field: 'buildingCode', sortable: true, filter: true, resizable: true },
          { field: 'buildingName', sortable: true, filter: true, resizable: true },
          { field: 'floorCode', sortable: true, filter: true, resizable: true },
          { field: 'floorName', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.roomMasterService.getRoomMaster();

        this.subscription = this.roomMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'locationmaster': {
        this.columnDefs = [
          { field: 'locationID', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'locationCode', sortable: true, filter: true, resizable: true },
          { field: 'locationName', sortable: true, filter: true, resizable: true },
          { field: 'siteCode', sortable: true, filter: true, resizable: true },
          { field: 'siteName', sortable: true, filter: true, resizable: true },
          { field: 'buildingCode', sortable: true, filter: true, resizable: true },
          { field: 'buildingName', sortable: true, filter: true, resizable: true },
          { field: 'floorCode', sortable: true, filter: true, resizable: true },
          { field: 'floorName', sortable: true, filter: true, resizable: true },
          { field: 'roomCode', sortable: true, filter: true, resizable: true },
          { field: 'roomName', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.locationMasterService.getLocationMaster();

        this.subscription = this.locationMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'brandmaster': {
        this.columnDefs = [
          { field: 'brandID', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'brandCode', sortable: true, filter: true, resizable: true },
          { field: 'brandName', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.brandMasterService.getBrandMaster();

        this.subscription = this.brandMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'modelmaster': {
        this.columnDefs = [
          { field: 'modelID', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'modelCode', sortable: true, filter: true, resizable: true },
          { field: 'modelName', sortable: true, filter: true, resizable: true },
          { field: 'brandCode', sortable: true, filter: true, resizable: true },
          { field: 'brandName', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.brandmodelMasterService.getBrandmodelMaster();

        this.subscription = this.brandmodelMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'assetcategorymaster': {
        this.columnDefs = [
          { headerName: 'Category ID', field: 'assetCategoryId', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { headerName: 'Category Code', field: 'assetCategoryCode', sortable: true, filter: true, resizable: true },
          { headerName: 'Category Name', field: 'assetCategoryName', sortable: true, filter: true, resizable: true },
          { headerName: 'Category Short Code', field: 'assetCategoryShortCode', sortable: true, filter: true, resizable: true },
          { headerName: 'Depreciation Period', field: 'categoryDepreciationPeriod', sortable: true, filter: true, resizable: true },
          { headerName: 'Depreciation Percent', field: 'categoryDepreciationPercent', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetCategoryMasterService.getAssetCategoryMaster();

        this.subscription = this.assetCategoryMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'assetsubcategorymaster': {
        this.columnDefs = [
          { headerName: 'Sub Category ID', field: 'assetSubCategoryId', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { headerName: 'Sub Category Code', field: 'assetSubCategoryCode', sortable: true, filter: true, resizable: true },
          { headerName: 'Sub Category Name', field: 'assetSubCategoryName', sortable: true, filter: true, resizable: true },
          { headerName: 'Sub Category Short Code', field: 'assetSubCategoryShortCode', sortable: true, filter: true, resizable: true },
          { headerName: 'Category Code', field: 'assetCategory.assetCategoryCode', sortable: true, filter: true, resizable: true },
          { headerName: 'Category Name', field: 'assetCategory.assetCategoryName', sortable: true, filter: true, resizable: true },
          { headerName: 'Category Short Code', field: 'assetCategory.assetCategoryShortCode', sortable: true, filter: true, resizable: true },
          { headerName: 'Depreciation Period', field: 'subCategoryDepreciationPeriod', sortable: true, filter: true, resizable: true },
          { headerName: 'Depreciation Percent', field: 'subCategoryDepreciationPercent', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();

        this.subscription = this.assetSubCategoryMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'commonvaluelistmaster': {
        this.columnDefs = [
          { field: 'listName', sortable: true, filter: true, resizable: true, checkboxSelection: false },
          { field: 'value', sortable: true, filter: true, resizable: true },
          { field: 'displayText', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.commonValueListService.getCommonValueListMaster();

        this.subscription = this.commonValueListService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'suppliermaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'supplierCode', sortable: true, filter: true, resizable: true },
          { field: 'supplierName', sortable: true, filter: true, resizable: true },
          { field: 'address1', sortable: true, filter: true, resizable: true },
          { field: 'address2', sortable: true, filter: true, resizable: true },
          { field: 'city', sortable: true, filter: true, resizable: true },
          { field: 'country', sortable: true, filter: true, resizable: true },
          { headerName: 'Country Code', field: 'countryCode', sortable: true, filter: true, resizable: true },
          { headerName: 'Contact Person', field: 'contactPerson', sortable: true, filter: true, resizable: true },
          { headerName: 'Contact Number', field: 'contactNumber', sortable: true, filter: true, resizable: true },
          { headerName: 'Email ID', field: 'emailID', sortable: true, filter: true, resizable: true },
          { headerName: 'Vat Number', field: 'vatNumber', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.supplierMasterService.getSupplierMaster();

        this.subscription = this.supplierMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'customermaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'customerCode', sortable: true, filter: true, resizable: true },
          { field: 'customerName', sortable: true, filter: true, resizable: true },
          { field: 'address1', sortable: true, filter: true, resizable: true },
          { field: 'address2', sortable: true, filter: true, resizable: true },
          { field: 'city', sortable: true, filter: true, resizable: true },
          { field: 'country', sortable: true, filter: true, resizable: true },
          { headerName: 'Contact Number', field: 'contactNumber', sortable: true, filter: true, resizable: true },
          { headerName: 'Email ID', field: 'emailID', sortable: true, filter: true, resizable: true },
          { headerName: 'Vat Number', field: 'vatNumber', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.customerMasterService.getCustomerMaster();

        this.subscription = this.customerMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'itemmaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'itemCode', sortable: true, filter: true, resizable: true },
          { field: 'itemName', sortable: true, filter: true, resizable: true },
          { field: 'itemDesc', sortable: true, filter: true, resizable: true },
          { field: 'uomName', sortable: true, filter: true, resizable: true },
          { headerName: 'Category Name', field: 'categoryName', sortable: true, filter: true, resizable: true },
          { headerName: 'Sub Category Name', field: 'subCategoryName', sortable: true, filter: true, resizable: true },
          { headerName: 'Karat Name', field: 'karatName', sortable: true, filter: true, resizable: true },
          { headerName: 'Color Name', field: 'colorName', sortable: true, filter: true, resizable: true },
          { headerName: 'Gender', field: 'gender', sortable: true, filter: true, resizable: true },
          { headerName: 'Item Collection Name', field: 'itemCollectionName', sortable: true, filter: true, resizable: true },
          { headerName: 'Item Family Name', field: 'itemFamilyName', sortable: true, filter: true, resizable: true },
          { headerName: 'Item Group Name', field: 'itemGroupName', sortable: true, filter: true, resizable: true },
          { headerName: 'Item Brand Name', field: 'itemBrandName', sortable: true, filter: true, resizable: true },
          { headerName: 'Labour Charge', field: 'labourCharge', sortable: true, filter: true, resizable: true },
          { headerName: 'Making Charge Min', field: 'makingChargeMin', sortable: true, filter: true, resizable: true },
          { headerName: 'Making Charge Max', field: 'makingChargeMax', sortable: true, filter: true, resizable: true },
          { headerName: 'Emarlad Weight', field: 'emarladWeight', sortable: true, filter: true, resizable: true },
          { headerName: 'Gross Weight', field: 'grossWeight', sortable: true, filter: true, resizable: true },
          { headerName: 'Stone Weight', field: 'stoneWeight', sortable: true, filter: true, resizable: true },
          { headerName: 'MRP', field: 'mrp', sortable: true, filter: true, resizable: true },
          { headerName: 'Remarks', field: 'remarks', sortable: true, filter: true, resizable: true },
          { headerName: 'Item Req Qty', field: 'itemReqQty', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.itemMasterService.getItemMaster();

        this.subscription = this.itemMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'receiptmaster': {
        this.columnDefs = [
          { field: 'receiptId', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 150 },
          { field: 'refDocumentType', sortable: true, filter: true, resizable: true },
          { field: 'refDocumentNo', sortable: true, filter: true, resizable: true },
          { field: 'refDocumentDate', sortable: true, filter: true, resizable: true },
          { field: 'receiptDate', sortable: true, filter: true, resizable: true },
          { field: 'supplierCode', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        // this.rowData =  await this.receiptMasterService.getReceiptMaster();

        // this.subscription = this.receiptMasterService.refreshClickevent.subscribe((e) => {
        //     this.OnRefreshCick();
        // });
        break;
      }
      case 'productmaster': {
        this.columnDefs = [
          { field: 'productId', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100 },
          { field: 'productCode', sortable: true, filter: true, resizable: true },
          { field: 'productName', sortable: true, filter: true, resizable: true },
          { field: 'productDescription', sortable: true, filter: true, resizable: true },
          { field: 'uomId', sortable: true, filter: true, resizable: true },
          { headerName: 'Category Code', field: 'assetCategoryCode', sortable: true, filter: true, resizable: true },
          { headerName: 'Category Name', field: 'assetCategoryName', sortable: true, filter: true, resizable: true },
          { headerName: 'Sub Category Code', field: 'assetSubCategoryCode', sortable: true, filter: true, resizable: true },
          { headerName: 'Sub Category Name', field: 'assetSubCategoryName', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.productMasterService.getProductMaster();

        this.subscription = this.productMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'assetregister': {
        this.columnDefs = [
          //   { field: 'assetActive', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
          //   cellRenderer: this.booleanActualCellRenderer
          // },
          //   { field: 'isDepreciationRequired', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
          //   cellRenderer: this.booleanActualCellRenderer
          // },
          //   { field: 'serialNo', sortable: true, filter: true, resizable: true },
          //   { field: 'supplierCode', sortable: true, filter: true, resizable: true },
          //   { field: 'productDescription', sortable: true, filter: true, resizable: true },
          //   { field: 'assetCode', sortable: true, filter: true, resizable: true },
          //   { field: 'supplierPartNo', sortable: true, filter: true, resizable: true },
          //   { field: 'purchasePrice', sortable: true, filter: true, resizable: true },
          //   { field: 'categoryCode', sortable: true, filter: true, resizable: true },
          //   { field: 'subCategoryCode', sortable: true, filter: true, resizable: true },
          //   { field: 'brandCode', sortable: true, filter: true, resizable: true },
          //   { field: 'modelCode', sortable: true, filter: true, resizable: true },
          //   { field: 'assetStatusCode', sortable: true, filter: true, resizable: true },
          //   { field: 'assetConditionCode', sortable: true, filter: true, resizable: true },
          //   { field: 'departmentCode', sortable: true, filter: true, resizable: true },
          //   { field: 'employeeCode', sortable: true, filter: true, resizable: true },
          //   { field: 'locationCode', sortable: true, filter: true, resizable: true },
          //   { field: 'warrantyEndDate', sortable: true, filter: true, resizable: true },
          //   { field: 'insuranceCompany', sortable: true, filter: true, resizable: true },
          //   { field: 'insuranceEndDate', sortable: true, filter: true, resizable: true },
          //   { field: 'purchaseDate', sortable: true, filter: true, resizable: true },
          //   { field: 'insuranceValue', sortable: true, filter: true, resizable: true },
          //   { field: 'insuranceStartDate', sortable: true, filter: true, resizable: true },
          //   { field: 'depreciationStartDate', sortable: true, filter: true, resizable: true },
          //   { field: 'depreciationPeriod', sortable: true, filter: true, resizable: true },
          //   { field: 'depreciationStartValue', sortable: true, filter: true, resizable: true },
          //   { field: 'depreciationPercentage', sortable: true, filter: true, resizable: true },
          //   { field: 'isAssetDisposed', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
          //   cellRenderer: this.booleanActualCellRenderer
          // },
          //   { field: 'assetDisposalCode', sortable: true, filter: true, resizable: true },
          //   { field: 'disposalAmount', sortable: true, filter: true, resizable: true },
          //   { field: 'comments', sortable: true, filter: true, resizable: true },
          //   { field: 'disposalDate', sortable: true, filter: true, resizable: true },
          //   { field: 'estDisposalAmount', sortable: true, filter: true, resizable: true },
          //   { field: 'isMaintenanceRequired', sortable: true, filter: true, resizable: true },
          //   { field: 'maintenanceStartDate', sortable: true, filter: true, resizable: true },
          //   { field: 'itemDescription', sortable: true, filter: true, resizable: true },
          //   { field: 'qty', sortable: true, filter: true, resizable: true },
          //   { field: 'dateBought', sortable: true, filter: true, resizable: true }
          { field: 'productCode', sortable: true, filter: true, resizable: true },
          { field: 'productName', sortable: true, filter: true, resizable: true },
          { field: 'productDescription', sortable: true, filter: true, resizable: true },
          { field: 'serialNo', sortable: true, filter: true, resizable: true },
          { field: 'productId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'purchasePrice', sortable: true, filter: true, resizable: true },
          { field: 'purchaseDate', sortable: true, filter: true, resizable: true },
          { field: 'supplierName', sortable: true, filter: true, resizable: true },
          { field: 'brandId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'modelId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'supplierId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'manufacturePartNo', sortable: true, filter: true, resizable: true },
          { field: 'assetStatusId', sortable: true, filter: true, resizable: true },
          { field: 'assetConditionId', sortable: true, filter: true, resizable: true },
          { field: 'departmentId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'departmentName', sortable: true, filter: true, resizable: true },
          { field: 'employeeName', sortable: true, filter: true, resizable: true },
          { field: 'assetCategoryId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'assetCategoryCode', sortable: true, filter: true, resizable: true },
          { field: 'assetCategoryName', sortable: true, filter: true, resizable: true },
          { field: 'assetSubCategoryId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'assetSubCategoryCode', sortable: true, filter: true, resizable: true },
          { field: 'assetSubCategoryName', sortable: true, filter: true, resizable: true },
          { field: 'locationName', sortable: true, filter: true, resizable: true },
          { field: 'brandName', sortable: true, filter: true, resizable: true },
          { field: 'modelName', sortable: true, filter: true, resizable: true },
          { field: 'bookValue', sortable: true, filter: true, resizable: true },
          { field: 'depreciationStartDate', sortable: true, filter: true, resizable: true },
          { field: 'insuranceName', sortable: true, filter: true, resizable: true },
          { field: 'insuranceStartDate', sortable: true, filter: true, resizable: true },
          { field: 'insuranceEndDate', sortable: true, filter: true, resizable: true },
          { field: 'insuranceValue', sortable: true, filter: true, resizable: true },
          { field: 'warrantyAmount', sortable: true, filter: true, resizable: true },
          { field: 'warrantyStartDate', sortable: true, filter: true, resizable: true },
          { field: 'warrantyEndDate', sortable: true, filter: true, resizable: true },
          //{ field: 'depreciationPeriod', sortable: true, filter: true, resizable: true },
          //{ field: 'depreciationPercent', sortable: true, filter: true, resizable: true },
          //{ field: 'depreciationValue', sortable: true, filter: true, resizable: true },
          // { field: 'depreciationAccValue', sortable: true, filter: true, resizable: true },
          { field: 'employeeId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'locationId', sortable: true, filter: true, resizable: true, hide: true },
          //{ field: 'depreciationRequired', sortable: true, filter: true, resizable: true },
          // { field: 'depreciationRequired', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
          //    cellRenderer: this.booleanActualCellRenderer
          // },
          { field: 'salvageValue', sortable: true, filter: true, resizable: true },
          //{ field: 'disposed', sortable: true, filter: true, resizable: true },
          // { field: 'disposed', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
          //    cellRenderer: this.booleanActualCellRenderer
          // },
          // { field: 'disposalMethodId', sortable: true, filter: true, resizable: true },
          // { field: 'disposalEstAmount', sortable: true, filter: true, resizable: true },
          // { field: 'disposalAmount', sortable: true, filter: true, resizable: true },
          // { field: 'disposalDate', sortable: true, filter: true, resizable: true },
          // { field: 'disposalComment', sortable: true, filter: true, resizable: true },
          // //{ field: 'alertMaintenance', sortable: true, filter: true, resizable: true },
          // { field: 'alertMaintenance', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
          //    cellRenderer: this.booleanActualCellRenderer
          // },
          // { field: 'alertMaintenanceCode', sortable: true, filter: true, resizable: true },
          // { field: 'alertMaintenanceDate', sortable: true, filter: true, resizable: true },
          // { field: 'imageId', sortable: true, filter: true, resizable: true, hide: true },
          // { field: 'documentIds', sortable: true, filter: true, resizable: true, hide: true },
          // { field: 'receiptId', sortable: true, filter: true, resizable: true },
          // { field: 'receiptLineId', sortable: true, filter: true, resizable: true, hide: true },
          // { field: 'lastDepreciationDate', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetRegisterService.getAssetRegister();

        this.subscription = this.assetRegisterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'assetverification': {
        this.columnDefs = [
          { field: 'receiptId', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 150 },
          { field: 'refDocumentType', sortable: true, filter: true, resizable: true },
          { field: 'refDocumentNo', sortable: true, filter: true, resizable: true },
          { field: 'refDocumentDate', sortable: true, filter: true, resizable: true },
          { field: 'receiptDate', sortable: true, filter: true, resizable: true },
          { field: 'supplierCode', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetVerificationService.getAssetVerification();

        this.subscription = this.assetVerificationService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'warrantydetails': {
        this.columnDefs = [
          { field: 'serialNo', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 150 },
          //{ field: 'assetCode', sortable: true, filter: true, resizable: true },
          //{ field: 'assetName', sortable: true, filter: true, resizable: true },
          { field: 'warrantyStartDate', sortable: true, filter: true, resizable: true },
          { field: 'warrantyEndDate', sortable: true, filter: true, resizable: true },
          { field: 'warrantyCost', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.warrantyDetailsService.getWarrantyDetails();

        this.subscription = this.warrantyDetailsService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'insurancedetails': {
        this.columnDefs = [
          { field: 'serialNo', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 150 },
          //{ field: 'assetCode', sortable: true, filter: true, resizable: true },
          //{ field: 'assetName', sortable: true, filter: true, resizable: true },
          { field: 'insuranceStartDate', sortable: true, filter: true, resizable: true },
          { field: 'insuranceEndDate', sortable: true, filter: true, resizable: true },
          { field: 'insuranceName', sortable: true, filter: true, resizable: true },
          { field: 'insuranceValue', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.insuranceDetailsService.getInsuranceDetails();

        this.subscription = this.insuranceDetailsService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'additionalcostdetails': {
        this.columnDefs = [
          { field: 'serialNo', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 150 },
          //{ field: 'assetCode', sortable: true, filter: true, resizable: true },
          //{ field: 'assetName', sortable: true, filter: true, resizable: true },
          { field: 'description', sortable: true, filter: true, resizable: true },
          { field: 'dateBought', sortable: true, filter: true, resizable: true },
          { field: 'quantity', sortable: true, filter: true, resizable: true },
          { field: 'amount', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.additionalCostDetailsService.getAdditionalCostDetails();

        this.subscription = this.additionalCostDetailsService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      default: {
        break;
      }
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async OnRefreshCick() {
    switch (this.entity) {
      case 'paymentmethod': {
        this.rowData = await this.paymentmethodService.onRefreshPaymentMethod();
        break;
      }
      case 'taxmaster': {
        this.rowData = await this.taxmasterservice.onRefreshTaxmaster();
        break;
      }
      case 'companymaster': {
        this.rowData = await this.companyMasterService.onRefreshCompanyMaster();
        break;
      }
      case 'regionmaster': {
        this.rowData = await this.regionMasterService.onRefreshRegionMaster();
        break;
      }
      case 'warehousemaster': {
        this.rowData = await this.warehouseMasterService.onRefreshWarehouseMaster();
        break;
      }
      case 'departmentmaster': {
        this.rowData = await this.departmentMasterService.onRefreshDepartmentmaster();
        break;
      }
      case 'employeemaster': {
        this.rowData = await this.employeeMasterService.onRefreshEmployeeMaster();
        break;
      }
      case 'karatmaster': {
        this.rowData = await this.karatMasterService.onRefreshKaratMaster();
        break;
      }
      case 'categorymaster': {
        this.rowData = await this.categoryasterService.onRefreshCategoryMaster();
        break;
      }
      case 'subcategorymaster': {
        this.rowData = await this.subcategoryasterService.onRefreshSubCategoryMaster();
        break;
      }
      case 'itembrandmaster': {
        this.rowData = await this.itembrandasterService.onRefreshItemBrandMaster();
        break;
      }
      case 'itemcollectionmaster': {
        this.rowData = await this.itemcollectionasterService.onRefreshItemCollectionMaster();
        break;
      }
      case 'itemfamilymaster': {
        this.rowData = await this.itemfamilymasterservice.onRefreshItemFamilyMaster();
        break;
      }
      case 'itemgroupmaster': {
        this.rowData = await this.itemgroupmasterservice.onRefreshItemGroupMaster();
        break;
      }
      case 'bankmaster': {
        this.rowData = await this.bankmasterservice.onRefreshBankMaster();
        break;
      }
      case 'cashcountermaster': {
        this.rowData = await this.cashcountermasterservice.onRefreshCashCounterMaster();
        break;
      }
      case 'colormaster': {
        this.rowData = await this.colormasterservice.onRefreshColorMaster();
        break;
      }
      case 'salesdivisionmaster': {
        this.rowData = await this.salesdivisionmasterservice.onRefreshSalesDivisionMaster();
        break;
      }
      case 'uommaster': {
        this.rowData = await this.uommasterservice.onRefreshUOMMaster();
        break;
      }
      case 'itemmaster': {
        this.rowData = await this.itemMasterService.onRefreshItemmaster();
        break;
      }
      case 'sitemaster': {
        this.rowData = await this.siteMasterService.onRefreshSitemaster();
        break;
      }
      case 'buildingmaster': {
        this.rowData = await this.buildingMasterService.onRefreshBuildingmaster();
        break;
      }
      case 'floormaster': {
        this.rowData = await this.floorMasterService.onRefreshFloormaster();
        break;
      }
      case 'roommaster': {
        this.rowData = await this.roomMasterService.onRefreshRoommaster();
        break;
      }
      case 'locationmaster': {
        this.rowData = await this.locationMasterService.onRefreshLocationmaster();
        break;
      }

      case 'brandmaster': {
        this.rowData = await this.brandMasterService.onRefreshBrandmaster();
        break;
      }
      case 'modelmaster': {
        this.rowData = await this.brandmodelMasterService.onRefreshBrandmodelmaster();
        break;
      }
      case 'assetcategorymaster': {
        this.rowData = await this.assetCategoryMasterService.onRefreshAssetCategoryMaster();
        break;
      }
      case 'assetsubcategorymaster': {
        this.rowData = await this.assetSubCategoryMasterService.onRefreshAssetSubCategoryMaster();
        break;
      }

      case 'commonvaluelistmaster': {
        this.rowData = await this.commonValueListService.onRefreshCommonValueListmaster();
        break;
      }
      case 'suppliermaster': {
        this.rowData = await this.supplierMasterService.onRefreshSupplierMaster();
        break;
      }
      case 'customerrmaster': {
        this.rowData = await this.customerMasterService.onRefreshCustomerMaster();
        break;
      }
      case 'receiptmaster': {
        // this.rowData = await this.receiptMasterService.onRefreshReceiptMaster();
        break;
      }
      case 'productmaster': {
        this.rowData = await this.productMasterService.onRefreshProductmaster();
        break;
      }
      case 'assetregister': {
        this.rowData = await this.assetRegisterService.onRefreshAssetRegister();
        break;
      }
      case 'assetverification': {
        this.rowData = await this.assetVerificationService.onRefreshAssetVerification();
        break;
      }
      case 'warrantydetails': {
        this.rowData = await this.warrantyDetailsService.onRefreshWarrantyDetails();
        break;
      }
      case 'insurancedetails': {
        this.rowData = await this.insuranceDetailsService.onRefreshInsuranceDetails();
        break;
      }
      case 'additionalcostdetails': {
        this.rowData = await this.additionalCostDetailsService.onRefreshAdditionalCostDetails();
        break;
      }
      case 'auditmasterverify': {
        this.rowData = await this.auditMasterService.onRefreshAuditVerifyReport();
        this.rowData = this.rowData.locationMismatch;
        break;
      }
      case 'auditmaster': {
        this.rowData = await this.auditMasterService.onRefreshAuditMaster();
        break;
      }

      default: {
        break;
      }
    }
  }

  onRowClick(event: any) {
    switch (this.entity) {
      case 'paymentmethod': {
        this.paymentmethodService.selectedrowevent.next(event);
        break;
      }
      case 'taxmaster': {
        this.taxmasterservice.selectedrowevent.next(event);
        break;
      }
      case 'companymaster': {
        this.companyMasterService.selectedrowevent.next(event);
        break;
      }
      case 'regionmaster': {
        this.regionMasterService.selectedrowevent.next(event);
        break;
      }
      case 'warehousemaster': {
        this.warehouseMasterService.selectedrowevent.next(event);
        break;
      }
      case 'departmentmaster': {
        this.departmentMasterService.selectedrowevent.next(event);
        break;
      }
      case 'employeemaster': {
        this.employeeMasterService.selectedrowevent.next(event);
        break;
      }
      case 'karatmaster': {
        this.karatMasterService.selectedrowevent.next(event);
        break;
      }
      case 'categorymaster': {
        this.categoryasterService.selectedrowevent.next(event);
        break;
      }
      case 'subcategorymaster': {
        this.subcategoryasterService.selectedrowevent.next(event);
        break;
      }
      case 'itembrandmaster': {
        this.itembrandasterService.selectedrowevent.next(event);
        break;
      }
      case 'itemcollectionmaster': {
        this.itemcollectionasterService.selectedrowevent.next(event);
        break;
      }
      case 'itemfamilymaster': {
        this.itemfamilymasterservice.selectedrowevent.next(event);
        break;
      }
      case 'itemgroupmaster': {
        this.itemgroupmasterservice.selectedrowevent.next(event);
        break;
      }
      case 'bankmaster': {
        this.bankmasterservice.selectedrowevent.next(event);
        break;
      }
      case 'cashcountermaster': {
        this.cashcountermasterservice.selectedrowevent.next(event);
        break;
      }
      case 'colormaster': {
        this.colormasterservice.selectedrowevent.next(event);
        break;
      }
      case 'salesdivisionmaster': {
        this.salesdivisionmasterservice.selectedrowevent.next(event);
        break;
      }
      case 'uommaster': {
        this.uommasterservice.selectedrowevent.next(event);
        break;
      }
      case 'itemmaster': {
        this.itemMasterService.selectedrowevent.next(event);
        break;
      }
      case 'sitemaster': {
        this.siteMasterService.selectedrowevent.next(event);
        break;
      }
      case 'buildingmaster': {
        this.buildingMasterService.selectedrowevent.next(event);
        break;
      }
      case 'floormaster': {
        this.floorMasterService.selectedrowevent.next(event);
        break;
      }
      case 'roommaster': {
        this.roomMasterService.selectedrowevent.next(event);
        break;
      }
      case 'locationmaster': {
        this.locationMasterService.selectedrowevent.next(event);
        break;
      }

      case 'brandmaster': {
        this.brandMasterService.selectedrowevent.next(event);
        break;
      }
      case 'modelmaster': {
        this.brandmodelMasterService.selectedrowevent.next(event);
        break;
      }
      case 'assetcategorymaster': {
        this.assetCategoryMasterService.selectedrowevent.next(event);
        break;
      }
      case 'assetsubcategorymaster': {
        this.assetSubCategoryMasterService.selectedrowevent.next(event);
        break;
      }

      case 'commonvaluelistmaster': {
        this.commonValueListService.selectedrowevent.next(event);
        break;
      }
      case 'suppliermaster': {
        this.supplierMasterService.selectedrowevent.next(event);
        break;
      }
      case 'customermaster': {
        this.customerMasterService.selectedrowevent.next(event);
        break;
      }
      case 'receiptmaster': {
        //this.receiptMasterService.selectedrowevent.next(event);
        break;
      }
      case 'productmaster': {
        this.productMasterService.selectedrowevent.next(event);
        break;
      }
      case 'assetregister': {
        this.assetRegisterService.selectedrowevent.next(event);
        break;
      }
      case 'assetregister': {
        this.assetVerificationService.selectedrowevent.next(event);
        break;
      }
      case 'warrantydetails': {
        this.warrantyDetailsService.selectedrowevent.next(event);
        break;
      }
      case 'insurancedetails': {
        this.insuranceDetailsService.selectedrowevent.next(event);
        break;
      }
      case 'additionalcostdetails': {
        this.additionalCostDetailsService.selectedrowevent.next(event);
        break;
      }
      case 'auditmasterverify': {
        this.auditMasterService.selectedrowevent.next(event);
        break;
      }
      case 'auditmaster': {
        this.auditMasterService.selectedrowevent.next(event);
        break;
      }
      default: {
        break;
      }
    }
  }

  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }

  getBooleanEditor() {
    // function to act as a class
    function BooleanEditor() { }

    // gets called once before the renderer is used
    BooleanEditor.prototype.init = function (params: any) {
      // create the cell
      var value = params.value;

      this.eInput = document.createElement('input');
      this.eInput.type = 'checkbox';
      this.eInput.checked = value;
      this.eInput.value = value;
    };

    // gets called once when grid ready to insert the element
    BooleanEditor.prototype.getGui = function () {
      return this.eInput;
    };

    // focus and select can be done after the gui is attached
    BooleanEditor.prototype.afterGuiAttached = function () {
      this.eInput.focus();
      this.eInput.select();
    };

    // returns the new value after editing
    BooleanEditor.prototype.getValue = function () {
      return this.eInput.checked;
    };

    // any cleanup we need to be done here
    BooleanEditor.prototype.destroy = function () {
      // but this example is simple, no cleanup, we could
      // even leave this method out as it's optional
    };

    // if true, then this editor will appear in a popup
    BooleanEditor.prototype.isPopup = function () {
      // and we could leave this method out also, false is the default
      return false;
    };

    return BooleanEditor;
  }

  booleanCellRenderer(params: any) {
    var value = !params.value ? 'checked' : 'unchecked';

    return '<input disabled type="checkbox" ' + value + '/>';
  }

  booleanActualCellRenderer(params: any) {
    var value = params.value ? 'checked' : 'unchecked';

    return '<input disabled type="checkbox" ' + value + '/>';
  }
  onSelectionChanged(data: any) {
    this.auditDataInRow = data.api.getSelectedRows()
    this.auditRowData.emit(this.auditDataInRow)
    console.log(this.auditDataInRow)
  }

}
