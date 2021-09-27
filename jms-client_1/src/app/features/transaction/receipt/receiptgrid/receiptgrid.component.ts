import { formatDate } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { purchaseorderService } from '../../../../core/service/purchaseorder.service';
import { receiptService } from '../../../../core/service/receipt.service';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { documentStatus } from '../../../../shared/interface/documentStatus';
import { PurchaseOrderDTModel } from '../../../../shared/model/PurchaseOrderDTModel';
import { PurchaseOrderModel } from '../../../../shared/model/PurchaseOrderModel';
import { ReceiptDetailsModel } from '../../../../shared/model/ReceiptDetailsModel';
import { POReceiptFilter, ReceiptModel } from '../../../../shared/model/ReceiptModel';
import { SupplierMasterModel } from '../../../../shared/model/SupplierMasterModel';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'org-fat-receiptgrid',
  templateUrl: './receiptgrid.component.html',
  styleUrls: ['./receiptgrid.component.scss']
})
export class ReceiptgridComponent implements OnInit {

  @ViewChild('agGrid') agGrid!: AgGridAngular;
  receiptEditForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnGridClick: boolean = true;
  isbtnforApproveClick: boolean = true;
  poNumber!: string;
  error = '';
  errorPO = '';
  editMode: boolean = false;
  receiptData!: ReceiptModel[];
  receiptOrderModel: ReceiptModel = new ReceiptModel;
  receiptFilterModel:POReceiptFilter=new POReceiptFilter;
  documentstatus:documentStatus=new documentStatus;
  rowreceiptViewData!: ReceiptDetailsModel[];
  columnPOViewDefs: any;
  suppCodes!: SupplierMasterModel[];
  warehouseCodes!: WarehouseMasterModel[];
  receiptItemsLine!: ReceiptDetailsModel;
  receiptDataModel!:ReceiptModel;
  viewMode: boolean = false;
  headerText!:string;
  isApproveUrl:boolean=false;
  isTransferOrder:boolean=false;
  isPurchaseOrder:boolean=false;
  isInvoice:boolean=false;
   
  constructor(@Inject(LOCALE_ID) private locale: string, private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private receiptservice: receiptService,
    private supplierMasterService: SupplierMasterService,
    private warehouseMasterService:warehousemasterservice,
    private saveAlert: SaveAlert) { 
      
      this.receiptEditForm = this.formBuilder.group({
        ReceiptType: [null,Validators.required],  
      supplierSelCode: [null],
      warehouseSelCode: [null],
      FromDate: [null,Validators.required],
      ToDate: [null,Validators.required]
    });
  }

  

  async ngOnInit() {
    this.receiptData = [];
   
    this.SetDropDownValueOnChange();

    this.SetDatePickerInitValue(); 

    //Get Drop Down Items
    await this.GetDropDownInitValues();

    this.route.params.subscribe(params => {
        if(params['id'] != undefined) {
         
        } else {
          this.editMode = false;
        }
        
    });
    this.route.url.subscribe(rturl => {
      if(rturl.toString()=="receiptapprove")
      {
      this.headerText='Approve Receipt';
      this.isApproveUrl=true;
      }
      else
      {
      this.isApproveUrl=false;
      this.headerText='Edit Receipt';
      }
     
  });
  }

  onPOViewRowClick(event: any)
  {
this.isbtnGridClick=false;
if(this.isApproveUrl)
this.isbtnforApproveClick=false;
else
this.isbtnforApproveClick=true;
  }

  ApproveEditScreen()
  {
    this.receiptDataModel=new ReceiptModel;
    this.receiptDataModel = this.agGrid.api.getSelectedRows()[0];
    if(this.receiptDataModel==null)
    {
      this.errorPO='Please select any row';
      return;
    }
    this.router.navigate(['receiptapprove/approve', this.receiptDataModel.receiptNumber]);
  }

  ViewEditScreen()
  {
    this.receiptDataModel=new ReceiptModel;
    this.receiptDataModel = this.agGrid.api.getSelectedRows()[0];
    if(this.receiptDataModel==null)
    {
      this.errorPO='Please select any row';
      return;
    }
    this.router.navigate(['receipt/edit', this.receiptDataModel.receiptNumber]);
  }

  NewReceiptEntry()
  {
    this.router.navigateByUrl('/receipt');
  }
  ClearReceiptView()
  {
    this.isbtnGridClick=true;
    this.receiptData=[];
    const today = new Date();
    const datepart = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
   
     $("#FromDate .datetimepicker-input").val(''); 
     $("#ToDate .datetimepicker-input").val(''); 
    this.receiptEditFormControls.supplierSelCode.setValue('');
    this.receiptEditFormControls.warehouseSelCode.setValue('');
    this.receiptEditFormControls.ReceiptType.setValue('');
    // this.receiptEditFormControls.PoNumber.setValue('');
    //$('select').select2().trigger('change');
    $('.select2bs4').select2().trigger('change');
  }
  private async GetDropDownInitValues() {
    this.suppCodes = await this.supplierMasterService.getSupplierMaster();
    this.warehouseCodes = await this.warehouseMasterService.getWarehouseMaster();
  }

  private SetDatePickerInitValue() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    $('#FromDate').datetimepicker({
      format: 'MM-DD-yyyy'
    });

    $('#ToDate').datetimepicker({
      format: 'MM-DD-yyyy'
    });

    $('[name="FrmDate"]').on("change", () => {
      this.receiptEditFormControls.FromDate.setValue($('[name="FrmDate"]').val());
    });
    $('[name="TDate"]').on("change", () => {
      this.receiptEditFormControls.ToDate.setValue($('[name="TDate"]').val());
    });

    $("#FromDate .datetimepicker-input").val(''); // Assign the value
    $("#FromDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#ToDate .datetimepicker-input").val(''); // Assign the value
    $("#ToDate .datetimepicker-input").trigger("click"); // Trigger click
  }

  private SetDropDownValueOnChange() {
    $('.select2bs4').select2();

    $('[name="supplierSelCode"]').on("change", () => {
      this.receiptEditFormControls.supplierSelCode.setValue($('[name="supplierSelCode"]').val());
    });

    $('[name="warehouseSelCode"]').on("change", () => {
      this.receiptEditFormControls.warehouseSelCode.setValue($('[name="warehouseSelCode"]').val());
    });

    $('[name="ReceiptType"]').on("change", () => {
      this.receiptEditFormControls.ReceiptType.setValue($('[name="ReceiptType"]').val());
      this.columnPOViewDefs=[];
      if($('[name="ReceiptType"]').val()=="TransferOrder")
      {
      this.isTransferOrder=true;
      this.isPurchaseOrder=false;
      this.isInvoice=false;
      this.columnPOViewDefs = [
        { headerName:'Receipt Number', field: 'receiptNumber', sortable: true, filter: true, resizable: true,width:250 },
        { headerName:'Receipt Date', field: 'receiptDate',  sortable: true, filter: true, resizable: true,width:250,
        cellRenderer: (data:any) => {
          return  formatDate(data.value, 'MM/dd/yyyy',this.locale);
       }},
       { headerName:'Store/Warehouse', field: 'warehouseName', sortable: true, filter: true, resizable: true,width:250 },
        { headerName:'From Store/Warehouse', field: 'fromWarehouseName', sortable: true, filter: true, resizable: true,width:250 }
        ,{ headerName:'TO Number', field: 'toNumber', sortable: true, filter: true, resizable: true,width:250 }
        ,{ headerName:'Total Transfer Qty', field: 'totalPurchaseQty', sortable: true, filter: true, resizable: true,width:250 
        ,hide: false,
        suppressToolPanel: false}
        ,{ headerName:'Total Receipt Qty', field: 'totalReceiptQty', sortable: true, filter: true, resizable: true,width:250 }
       ];
      }
      if($('[name="ReceiptType"]').val()=="PurchaseOrder")
      {
      this.isTransferOrder=false;
      this.isPurchaseOrder=true;
      this.columnPOViewDefs = [
        { headerName:'Receipt Number', field: 'receiptNumber', sortable: true, filter: true, resizable: true,width:250 },
        { headerName:'Receipt Date', field: 'receiptDate',  sortable: true, filter: true, resizable: true,width:250,
        cellRenderer: (data:any) => {
          return  formatDate(data.value, 'MM/dd/yyyy',this.locale);
       }},
       { headerName:'Store/Warehouse', field: 'warehouseName', sortable: true, filter: true, resizable: true,width:250 },
        { headerName:'Supplier', field: 'supplierName', sortable: true, filter: true, resizable: true,width:250 }
        ,{ headerName:'PO Number', field: 'poNumber', sortable: true, filter: true, resizable: true,width:250 }
        ,{ headerName:'Invoice Number', field: 'supplierInvoiceNo', sortable: true, filter: true, resizable: true,width:250 }
        ,{ headerName:'Total Purchase Order Qty', field: 'totalPurchaseQty', sortable: true, filter: true, resizable: true,width:250
        ,hide: false,
        suppressToolPanel: false }
        ,{ headerName:'Total Receipt Qty', field: 'totalReceiptQty', sortable: true, filter: true, resizable: true,width:250 }
       ];
      }
      if($('[name="ReceiptType"]').val()=="Invoice")
      {
      this.isTransferOrder=false;
      this.isPurchaseOrder=false;
      this.isInvoice=true;
      this.columnPOViewDefs = [
        { headerName:'Receipt Number', field: 'receiptNumber', sortable: true, filter: true, resizable: true,width:250 },
        { headerName:'Receipt Date', field: 'receiptDate',  sortable: true, filter: true, resizable: true,width:250,
        cellRenderer: (data:any) => {
          return  formatDate(data.value, 'MM/dd/yyyy',this.locale);
       }},
       { headerName:'Store/Warehouse', field: 'warehouseName', sortable: true, filter: true, resizable: true,width:250 },
        { headerName:'Supplier', field: 'supplierName', sortable: true, filter: true, resizable: true,width:250 }
        ,{ headerName:'Invoice Number', field: 'supplierInvoiceNo', sortable: true, filter: true, resizable: true,width:250 }
        ,{ headerName:'Total Purchase Order Qty', field: 'totalPurchaseQty', sortable: true, filter: true, resizable: true,width:250
        ,hide: true,
        suppressToolPanel: true }
        ,{ headerName:'Total Receipt Qty', field: 'totalReceiptQty', sortable: true, filter: true, resizable: true,width:250 }
       ];
      }

    });

    }

  get receiptEditFormControls() { return this.receiptEditForm.controls; }

  // ngViewInit() {
  //   const today = new Date();
  //   const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  //   this.receiptEditFormControls.ReceiptDate.setValue(datepart);
  // }

  async ViewContents() {
    this.loading=true;
    this.isbtnGridClick=true;
  this.receiptEditFormControls.FromDate.setValue($("#FromDate .datetimepicker-input").val());
  this.receiptEditFormControls.ToDate.setValue($("#ToDate .datetimepicker-input").val());
    this.submitted=true;
    console.log(this.receiptEditForm);
    if (this.receiptEditForm.invalid)
    {
      this.loading=false;
    return;
    }
    this.receiptFilterModel=new POReceiptFilter;
    this.receiptFilterModel.toDate=$('#ToDate .datetimepicker-input').val();
    this.receiptFilterModel.fromDate=$('#FromDate .datetimepicker-input').val();
    this.receiptFilterModel.receiptType=this.receiptEditFormControls.ReceiptType.value;
    if(!this.isTransferOrder)
    {
    this.receiptFilterModel.supplierID= this.receiptEditFormControls.supplierSelCode.value;
    }
    else
    {
    this.receiptFilterModel.fromWarehouseID= this.receiptEditFormControls.warehouseSelCode.value;
    }
    this.receiptFilterModel.status=this.documentstatus.new;
    console.log(this.receiptFilterModel);
     this.receiptData= (await this.receiptservice.getEditViewReceipt(this.receiptFilterModel));
     console.log(this.receiptData);
      this.submitted=false;
      this.loading=false;
  }

}
