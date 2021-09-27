import { formatDate } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { categorymasterservice } from '../../../../core/service/categorymaster.service';
import { itemMasterService } from '../../../../core/service/itemmaster.service';
import { purchaseorderService } from '../../../../core/service/purchaseorder.service';
import { receiptService } from '../../../../core/service/receipt.service';
import { subcategorymasterservice } from '../../../../core/service/subcategorymaster.service';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { uommasterservice } from '../../../../core/service/uommaster.service';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { ModalService } from '../../../../core/_modal';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { documentStatus } from '../../../../shared/interface/documentStatus';
import { CategoryMasterModel } from '../../../../shared/model/CategoryMasterModel';
import { ItemMasterModel } from '../../../../shared/model/ItemMasterModel';
import { PurchaseOrderDTModel } from '../../../../shared/model/PurchaseOrderDTModel';
import { PurchaseOrderModel } from '../../../../shared/model/PurchaseOrderModel';
import { ReceiptDetailsModel } from '../../../../shared/model/ReceiptDetailsModel';
import { POReceiptFilter, ReceiptModel } from '../../../../shared/model/ReceiptModel';
import { SubCategoryMasterModel } from '../../../../shared/model/SubCategoryMasterModel';
import { SupplierMasterModel } from '../../../../shared/model/SupplierMasterModel';
import { UOMMasterModel } from '../../../../shared/model/UOMMasterModel';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-receiptform',
  templateUrl: './receiptform.component.html',
  styleUrls: ['./receiptform.component.scss']
})
export class ReceiptformComponent implements OnInit {

  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('agFilterGrid') agFilterGrid!: AgGridAngular;
  receiptForm: FormGroup;
  isWarehouse:boolean=false;
  isSupplier:boolean=false;
  isItem:boolean=false;
  documentstatus:documentStatus=new documentStatus;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  isbtnGridClick:boolean=false;
  isInvoice:boolean=false;
  isTransferOrder:boolean=false;
  poReceiptFilter:POReceiptFilter=new POReceiptFilter;
  receiptNumber!: string;
  error = '';
  errorPO = '';
  CategoyCodeDisplay='';
  SubCategoyCodeDisplay='';
  ItemCodeDisplay='';
  modalHeading='Search Document No';
  DOCNumberText='';
  PurchaseQty=0;
  PurchaseGoldWeight=0;
  PurchaseStoneWeight=0;
  editMode: boolean = false;
  ReceiptedQty=0;
  ReceiptedGoldWeight=0;
  ReceiptedStoneWeight=0;
  anyerrorinSearch:boolean=false;
  isReceiptTypeSelected:boolean=false;
  receiptData!: ReceiptModel;
  isPurchaseOrder:boolean=false;
  supplierName='';
  receiptDataModel!:ReceiptModel;
  receiptModel: ReceiptModel = new ReceiptModel;
  rowRecData!: ReceiptModel;
  rowData!: ReceiptDetailsModel[];
  rowDocData!:any[];
  PODocData!:ReceiptModel;
  columnPODefs: any;
  columnViewPopUpDefs:any;
  WarehouseName='';
  suppCodes!: SupplierMasterModel[];
  warehouseCodes!: WarehouseMasterModel[];
  categoryCodes!: CategoryMasterModel[];
  subCategoryCodes!: SubCategoryMasterModel[];
  poItemsLine!: ReceiptDetailsModel;
  itemCodes!: ItemMasterModel[];
  uomCodes!: UOMMasterModel[];
  ItemLineNumber!:string;
  isPOAddHidden: boolean = false;
  isPOEditHidden: boolean = true;
  isPODeleteHidden: boolean = true;
  isPOUpdateHidden: boolean = true;
  isPOCancelHidden: boolean = true;
  isPOClearHidden:boolean=false;
  isApproveAllowed:boolean=false;
  productDescription!: string;
  UOMCode!:string;
  subCategoryCodesSearchHolder!: SubCategoryMasterModel[];
  ItemSearchHolder!: ItemMasterModel[];
  viewMode: boolean = false;
  headerText!:string;
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isApproveUrl:boolean=false;
  @Input() name:string='receipt';
  bodyText!: string;
   
  constructor(@Inject(LOCALE_ID) private locale: string,private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private poService: purchaseorderService,
    private receiptService: receiptService,
    private supplierMasterService: SupplierMasterService,
    private warehouseMasterService:warehousemasterservice,
    private categoryMasterService: categorymasterservice,
    private subCategoryMasterService: subcategorymasterservice,
    private itemMasterService: itemMasterService,
    private uomMasterService: uommasterservice,
    private saveAlert: SaveAlert,
    private inactivateAlert: InactivateAlert,
    private modalService:ModalService) { 

      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    this.isApproveAllowed = localStorage.getItem("isApproveAllowed") =="true";
      this.receiptForm = this.formBuilder.group({
        ReceiptAgainst:[null,Validators.required],
      supplierSelCode: [null],
      supplierFilterSelCode: [null],
      warehouseSelCode:[null,Validators.required],
      warehouseFilterSelCode:[null],
      DocumentNo: [null],
      InvoiceNo:[null],
      Remarks: [null],
      ReceiptDate: [null,Validators.required],
      DocumentDate: [null],
      InvoiceDate: [null],
      CategoyCode: [null],
      SubCategoyCode: [null],
      ItemCode: [null],
      //UOMCode: [null],
      EnterQty: [null],
      PurchasePrice:[null],
      FromDate:[null],
      ToDate:[null],
      DocNumber:[null],
      PurchaseVAT:[null],
      StoneWeight:[null],
      GoldWeight:[null]
    });
  }

  async ngOnInit() {
    this.bodyText = 'This text can be updated in modal 1';
    this.rowData=[];
    this.rowDocData = [];
   
     this.receiptFormControls.DocumentNo.disable();
    this.SetDropDownValueOnChange();

    this.SetDatePickerInitValue(); 
this.headerText='Receipt Entry';
    //Get Drop Down Items
    await this.GetDropDownInitValues();

    this.route.params.subscribe(async params => {
        if(params['id'] != undefined) {
          this.receiptNumber = params['id'];
          this.editMode = true;
          this.headerText='Edit Receipt';
          this.receiptData =  (await this.receiptService.getReceiptByKey(this.receiptNumber));
          if (this.receiptData.status == 50) {
            alert('PO is Approved cannot edit it!!');
            this.ShowGrid();
          }
          console.log(this.receiptData );
          this.ShowEditViewReceiptMaster(this.receiptData);
          
          if (params['state'] ===  'view')
          {
            
            this.viewMode = true;
            this.disableControls();
          }
        } else {
          this.editMode = false;
        }
    });

    this.route.url.subscribe(rturl => {
      if(rturl.toString().includes("receiptapprove"))
      {
      this.headerText='Approve Receipt';
      this.isApproveUrl=true;
      this.receiptFormControls.Remarks.disable();
      }
      else
      {
      this.isApproveUrl=false;
      }
     
  });
  }

  onViewRowClick(event:any)
  {
    this.isbtnGridClick=true;
  }

  ClearFormforFilter()
  {
    
    $("#DocumentDate .datetimepicker-input").val('');
    this.rowData=[];
    this.receiptFormControls.supplierSelCode.setValue('');
    this.receiptFormControls.DocumentNo.setValue('');
    this.receiptFormControls.DocumentDate.setValue('');
    this.supplierName='';
    this.SubCategoyCodeDisplay='';
    this.ItemCodeDisplay='';
    this.CategoyCodeDisplay='';
    this.UOMCode='';
    this.PurchaseQty=0;
    this.ReceiptedQty=0;
    this.PurchaseGoldWeight=0;
      this.PurchaseStoneWeight=0;
      this.ReceiptedStoneWeight=0;
      this.ReceiptedGoldWeight=0;
    this.receiptFormControls.ItemCode.setValue('');
    this.receiptFormControls.SubCategoyCode.setValue('');
    this.receiptFormControls.CategoyCode.setValue('');
    this.receiptFormControls.EnterQty.setValue('');
    this.productDescription='';
    this.receiptFormControls.PurchasePrice.setValue('');
  }

  async GetDocData()
  {
    
    this.ClearFormforFilter();
    this.rowRecData=new ReceiptModel;
    if(this.isPurchaseOrder)
    {
      this.PODocData=this.agFilterGrid.api.getSelectedRows()[0];
      this.poReceiptFilter.poNumber=this.PODocData.poNumber;
      this.poReceiptFilter.status=this.documentstatus.new;
      this.poReceiptFilter.supplierID=0;
      this.rowRecData= (await this.receiptService.getReceiptDetailsView(this.poReceiptFilter));
      console.log(this.rowRecData);
      this.receiptFormControls.supplierSelCode.setValue(this.rowRecData.supplierID);
      this.receiptFormControls.DocumentNo.setValue(this.rowRecData.poNumber);
      this.receiptFormControls.DocumentDate.setValue(this.rowRecData.poDate);
      $("#DocumentDate .datetimepicker-input").val(formatDate(this.rowRecData.poDate, 'MM/dd/yyyy', 'en-US'));
     // $("#DocumentDate .datetimepicker-input").attr('disabled', true); 
      this.supplierName=this.rowRecData.supplierName;
      this.rowRecData.receiptDetails.forEach(element => element.receiptQty=0);
      this.rowData=this.rowRecData.receiptDetails;
     // $('select').select2().trigger('change');
    }
    else if(this.isTransferOrder)
    {}
    this.isbtnGridClick=false;
    this.closeModal("custom-modal-1");
  }

  async ViewContents() {
    this.loading=true;
    this.isbtnGridClick=false;
    this.anyerrorinSearch=false;
    this.rowDocData=[];
    this.receiptFormControls.FromDate.setValidators(null);
    this.receiptFormControls.ToDate.setValidators(null);
    this.receiptFormControls.FromDate.updateValueAndValidity();
    this.receiptFormControls.ToDate.updateValueAndValidity();
    if(this.receiptFormControls.DocNumber.value==null || this.receiptFormControls.DocNumber.value=="")
    {
if($('#FromDate .datetimepicker-input').val()==null || $('#FromDate .datetimepicker-input').val()=="")
{
      this.receiptFormControls.FromDate.setValidators([Validators.required]);
      this.receiptFormControls.FromDate.updateValueAndValidity();
      this.anyerrorinSearch=true;
}
if($('#ToDate .datetimepicker-input').val()==null || $('#ToDate .datetimepicker-input').val()=="")
{
  this.receiptFormControls.ToDate.setValidators([Validators.required]);
  this.receiptFormControls.ToDate.updateValueAndValidity();
  this.anyerrorinSearch=true;
}
     
    }
    this.submitted=true;
    if (this.anyerrorinSearch)
    {
      this.loading=false;
    return;
    }
    this.receiptDataModel=new ReceiptModel;
    this.receiptDataModel.toDate=$('#ToDate .datetimepicker-input').val();
    this.receiptDataModel.fromDate=$('#FromDate .datetimepicker-input').val();
    this.receiptDataModel.supplierID= this.receiptFormControls.supplierFilterSelCode.value;
    this.receiptDataModel.receiptNumber=this.receiptFormControls.DocNumber.value;
    this.receiptDataModel.status=this.documentstatus.approved;
    this.receiptDataModel.receiptType=this.receiptFormControls.ReceiptAgainst.value;
    console.log(this.receiptDataModel);
     this.rowDocData= (await this.receiptService.getViewReceipt(this.receiptDataModel))
    this.receiptFormControls.FromDate.setValidators(null);
      this.receiptFormControls.ToDate.setValidators(null);
      this.receiptFormControls.FromDate.updateValueAndValidity();
      this.receiptFormControls.ToDate.updateValueAndValidity();
      this.submitted=false;
      this.loading=false;
  }


  ClearView()
  {
    this.isbtnGridClick=false;
  }
  showfilter(id: string)
  {
    this.rowDocData=[];
    this.modalService.open(id);
  }

  showForm(id: string,btnid:string)
  {
    this.isWarehouse=false;
    this.isSupplier=false;
    this.isItem=false;
    if(btnid=="warehouse")
    this.isWarehouse=true;
    if(btnid=="supplier")
    this.isSupplier=true;
    if(btnid=="item")
    this.isItem=true;
    this.modalService.open(id);
  }

  openModal(id: string) {
    this.modalService.open(id);
}

closeModal(id: string) {
  this.isbtnGridClick=false;
  this.receiptFormControls.FromDate.setValue('');
  this.receiptFormControls.ToDate.setValue('');
  this.receiptFormControls.DocNumber.setValue('');
  this.receiptFormControls.supplierFilterSelCode.setValue('');
  this.receiptFormControls.warehouseFilterSelCode.setValue('');
 // $('select').select2().trigger('change');
  $('[name="FrmDate"]').val(null);
  $('[name="TDate"]').val(null);
  this.rowDocData=[];
    this.modalService.close(id);
}

ViewEditReceipt(){
    this.router.navigateByUrl('/receipt/view');
  }

  private async GetDropDownInitValues() {
    this.itemCodes = await this.itemMasterService.getItemMaster();
    this.ItemSearchHolder=this.itemCodes;
    this.suppCodes = await this.supplierMasterService.getSupplierMaster();
    this.categoryCodes = await this.categoryMasterService.getCategoryMaster();
    this.subCategoryCodes = await this.subCategoryMasterService.getSubCategoryMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.uomCodes = await this.uomMasterService.getUOMMaster();
    this.warehouseCodes=await this.warehouseMasterService.getWarehouseMaster();
  }

  receiptAgainstChange()
  {
    if(!this.submitted)
    {
    this.isReceiptTypeSelected=true;
    this.receiptFormControls.DocumentNo.disable();
    this.isTransferOrder=false;
    this.isPurchaseOrder=false;
    this.columnViewPopUpDefs=[];
    this.columnPODefs=[];
    this.ClearFormforFilter();
    this.columnPODefs = [
      { headerName:'Item Name', field: 'itemName', sortable: true, filter: true, resizable: true,width:250 },
      { headerName:'Item Desc', field: 'itemDesc', sortable: true, filter: true, resizable: true,width:300 },
      { headerName:'UOM Code', field: 'uomName', sortable: true, filter: true, resizable: true },
      { headerName:'Item Line Number', field: 'refDocLineNumber', sortable: true, filter: false, resizable: true
      ,hide: false,
      suppressToolPanel: false },
      { headerName:'Order Qty', field: 'purchaseQty', sortable: true, filter: false, resizable: true,hide: false,
      suppressToolPanel: false },
      { headerName:'Order Gold Weight(gm)', field: 'metalWeight', sortable: true, filter: false, resizable: true,hide: false,
      suppressToolPanel: false },
      { headerName:'Order Stone Weight(gm)', field: 'stoneWeight', sortable: true, filter: false, resizable: true,hide: false,
      suppressToolPanel: false },
      { headerName:'Total Received Qty', field: 'receivedQty', sortable: true, filter: false, resizable: true ,hide: false,
      suppressToolPanel: false },
      { headerName:'Total Received Gold Weight', field: 'receivedMetalWeight', sortable: true, filter: false, resizable: true ,hide: false,
      suppressToolPanel: false },
      { headerName:'Total Received Stone Weight', field: 'receivedStoneWeight', sortable: true, filter: false, resizable: true ,hide: false,
      suppressToolPanel: false },
      { headerName:'Total Value Ex. of VAT', field: 'purchasePrice', sortable: true, filter: false, resizable: true },
      { headerName:'Total Value of VAT', field: 'purchaseVat', sortable: true, filter: false, resizable: true },
      { headerName:'Received Gold Weight(gm)', field: 'recMetalWeight', sortable: true, filter: false, resizable: true,hide: false,
      suppressToolPanel: false },
      { headerName:'Received Stone Weight(gm)', field: 'recStoneWeight', sortable: true, filter: false, resizable: true,hide: false,
      suppressToolPanel: false },
      { headerName:'Received Qty', field: 'receiptQty', sortable: true, filter: false, resizable: true },
     ];
     this.agGrid.api.refreshHeader();
     this.agGrid.api.redrawRows();
    if($('[name="ReceiptAgainst"]').val()=='TransferOrder')
    {
      this.columnViewPopUpDefs = [
        { headerName:'TO Number', field: 'toNumber', sortable: true, filter: true, resizable: true,width:250 },
        { headerName:'TO Date', field: 'toDate', sortable: true, filter: true, resizable: true,width:300 },
        { headerName:'From Warehouse', field: 'warehouseName', sortable: true, filter: true, resizable: true },
        { headerName:'Total Qty', field: 'totalTransferQty', sortable: true, filter: false, resizable: true }
       ];
      this.isTransferOrder=true;
      this.isInvoice=false;
      this.isPurchaseOrder=false;
      this.DOCNumberText='To Number';
    }
    else  if($('[name="ReceiptAgainst"]').val()=='PurchaseOrder')
    {
      this.columnViewPopUpDefs = [
        { headerName:'PO Number', field:'poNumber', sortable: true, filter: true, resizable: true,width:250 },
        { headerName:'PO Date', field: 'poDate', sortable: true, filter: true, resizable: true,width:300 ,
        cellRenderer: (data:any) => {
          return  formatDate(data.value, 'MM/dd/yyyy',this.locale);
       }},
        { headerName:'Supplier', field: 'supplierName', sortable: true, filter: true, resizable: true },
        { headerName:'Total Qty', field: 'totalPurchaseQty', sortable: true, filter: false, resizable: true }
       ];
      this.isInvoice=false;
      this.isPurchaseOrder=true;
      this.DOCNumberText='PO Number';
    }
    else  if($('[name="ReceiptAgainst"]').val()=='Invoice')
    {
      this.isInvoice=true;
      this.columnPODefs = [
        { headerName:'Item Name', field: 'itemName', sortable: true, filter: true, resizable: true,width:250 },
        { headerName:'Item Desc', field: 'itemDesc', sortable: true, filter: true, resizable: true,width:300 },
        { headerName:'UOM Code', field: 'uomName', sortable: true, filter: true, resizable: true },
        { headerName:'Item Line Number', field: 'refDocLineNumber', sortable: true, filter: false, resizable: true
        ,hide: true,
        suppressToolPanel: true },
        { headerName:'Order Qty', field: 'purchaseQty', sortable: true, filter: false, resizable: true,hide: true,
        suppressToolPanel: true },
        { headerName:'Order Gold Weight(gm)', field: 'metalWeight', sortable: true, filter: false, resizable: true,hide: true,
        suppressToolPanel: true },
        { headerName:'Order Stone Weight(gm)', field: 'stoneWeight', sortable: true, filter: false, resizable: true,hide: true,
        suppressToolPanel: true },
        { headerName:'Total Received Qty', field: 'receivedQty', sortable: true, filter: false, resizable: true ,hide: true,
        suppressToolPanel: true },
        { headerName:'Total Received Gold Weight', field: 'receivedMetalWeight', sortable: true, filter: false, resizable: true ,hide: true,
        suppressToolPanel: true },
        { headerName:'Total Received Stone Weight', field: 'receivedStoneWeight', sortable: true, filter: false, resizable: true ,hide: true,
        suppressToolPanel: true },
        { headerName:'Total Value Ex. of VAT', field: 'purchasePrice', sortable: true, filter: false, resizable: true },
        { headerName:'Total Value of VAT', field: 'purchaseVat', sortable: true, filter: false, resizable: true },
        { headerName:'Received Gold Weight(gm)', field: 'recMetalWeight', sortable: true, filter: false, resizable: true,hide: false,
        suppressToolPanel: false },
        { headerName:'Received Stone Weight(gm)', field: 'recStoneWeight', sortable: true, filter: false, resizable: true,hide: false,
        suppressToolPanel: false },
        { headerName:'Received Qty', field: 'receiptQty', sortable: true, filter: false, resizable: true },
       ];
       this.agGrid.api.refreshHeader();
       this.agGrid.api.redrawRows();
       
    }
  }
  }

  private SetDatePickerInitValue() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('#ReceiptDate').datetimepicker({
      format: 'L'
    });
    $('#DocumentDate').datetimepicker({
      format: 'L'
    });
    $('#InvoiceDate').datetimepicker({
      format: 'L'
    });
    $('#FromDate').datetimepicker({
      format: 'L'
    });
    $('#ToDate').datetimepicker({
      format: 'L'
    });

    $('[name="RecpDate"]').on("change", () => {
      this.receiptFormControls.ReceiptDate.setValue($('[name="RecpDate"]').val());
    });
    $('[name="DocDate"]').on("change", () => {
      this.receiptFormControls.DocumentDate.setValue($('[name="DocDate"]').val());
    });
    $('#InvoiceDate').on("change", () => {
      this.receiptFormControls.InvoiceDate.setValue($('[name="InvDate"]').val());
    });
    $('[name="FrmDate"]').on("change", () => {
      this.receiptFormControls.FromDate.setValue($('[name="FrmDate"]').val());
    });
    $('[name="TDate"]').on("change", () => {
      this.receiptFormControls.ToDate.setValue($('[name="TDate"]').val());
    });

    $("#ReceiptDate .datetimepicker-input").val(datepart); // Assign the value
    $("#ReceiptDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#DocumentDate .datetimepicker-input").val(datepart); // Assign the value
    $("#DocumentDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#InvoiceDate .datetimepicker-input").val(datepart); // Assign the value
    $("#InvoiceDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#FromDate .datetimepicker-input").val(datepart); // Assign the value
    $("#FromDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#ToDate .datetimepicker-input").val(datepart); // Assign the value
    $("#ToDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#DocumentDate .datetimepicker-input").attr('disabled', true); 
  }

  private SetDropDownValueOnChange() {
    $('.select2bs4').select2();

    
    $('[name="warehouseSelCode"]').on("change", () => {
      this.receiptFormControls.warehouseSelCode.setValue($('[name="warehouseSelCode"]').val());
    });

    $('[name="warehouseFilterSelCode"]').on("change", () => {
      this.receiptFormControls.warehouseFilterSelCode.setValue($('[name="warehouseFilterSelCode"]').val());
    });

    $('[name="supplierSelCode"]').on("change", () => {
      this.receiptFormControls.supplierSelCode.setValue($('[name="supplierSelCode"]').val());
    });

    $('[name="supplierFilterSelCode"]').on("change", () => {
      this.receiptFormControls.supplierFilterSelCode.setValue($('[name="supplierFilterSelCode"]').val());
    });


    $('[name="ReceiptAgainst"]').on("change", () => {
      this.receiptFormControls.ReceiptAgainst.setValue($('[name="ReceiptAgainst"]').val());
      this.receiptAgainstChange();
    });

    // $('[name="ProductSelDesc"]').on("change", () => {
    //   this.receiptFormControls.ProductSelDesc.setValue($('[name="ProductSelDesc"]').val());
    // });

    $('[name="ItemCode"]').on("change", () => {
      this.receiptFormControls.ItemCode.setValue($('[name="ItemCode"]').val());
      if($('[name="ItemCode"]').val() > 0) {
        this.UOMCode=this.itemCodes.find(item => item.id == this.receiptFormControls.ItemCode.value)?.uomName as string;
        this.productDescription = this.itemCodes.find(item => item.id == this.receiptFormControls.ItemCode.value)?.itemDesc as string;
      }
    });

    $('[name="CategoyCode"]').on("change", () => {
      this.productDescription="";
      this.UOMCode="";
      this.receiptFormControls.CategoyCode.setValue($('[name="CategoyCode"]').val());
      if($('[name="CategoyCode"]').val()>0)
      {
      this.itemCodes=[];
      this.itemCodes = this.ItemSearchHolder.filter(item => item.categoryID ==this.receiptFormControls.CategoyCode.value);
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.categoryID ==this.receiptFormControls.CategoyCode.value);
      }
    });

    $('[name="SubCategoyCode"]').on("change", () => {
      this.productDescription="";
      this.UOMCode="";
      this.receiptFormControls.SubCategoyCode.setValue($('[name="SubCategoyCode"]').val());
      if($('[name="SubCategoyCode"]').val()>0)
{
      this.itemCodes=[];
      this.itemCodes = this.ItemSearchHolder.filter(item => item.subCategoryID ==this.receiptFormControls.SubCategoyCode.value);
}
    });

    // $('[name="UOMCode"]').on("change", () => {
    //   this.receiptFormControls.UOMCode.setValue($('[name="UOMCode"]').val());
    // });

    }

  get receiptFormControls() { return this.receiptForm.controls; }

  // ngViewInit() {
  //   const today = new Date();
  //   const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  //   this.receiptFormControls.ReceiptDate.setValue(datepart);
  // }

  AddToReceiptGrid() {
    this.SetValidatorsForGridAddControls();

    this.submitted = true;
    this.errorPO = '';
    this.receiptFormControls.ReceiptDate.setValue($('[name="RecpDate"]').val());
    console.log(this.receiptForm);
    if (this.receiptForm.invalid)
      return;
    this.error = '';
    console.log(this.rowData);
    const hasSameProduct = this.rowData.some(x =>  x.itemID ==  this.itemCodes.filter(x => x.id == this.receiptFormControls.ItemCode.value)[0].id);
    if (hasSameProduct) {
      this.errorPO = 'Same record with Item code already exists!';
      return;
    }
  
    this.UpdateReceiptItemLine();
    this.rowData.push(this.poItemsLine);
    this.UpdateReceiptSubGridRows();
   // this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
    this.submitted = false;
  }

  private SetValidatorsForGridAddControls() {
    if(this.isInvoice)
    {
    this.receiptFormControls.ItemCode.setValidators([Validators.required]);
    this.receiptFormControls.GoldWeight.setValidators([Validators.required]);
    this.receiptFormControls.InvoiceNo.setValidators([Validators.required]);
    }
    if(this.isPurchaseOrder)
    {
      this.receiptFormControls.InvoiceNo.setValidators([Validators.required]);
    }
   // this.receiptFormControls.UOMCode.setValidators([Validators.required]);
    //this.receiptFormControls.SupPartNumber.setValidators([Validators.required]);
    this.receiptFormControls.GoldWeight.setValidators([Validators.required]);
    this.receiptFormControls.EnterQty.setValidators([Validators.required]);
    this.receiptFormControls.PurchasePrice.setValidators([Validators.required]);
    this.receiptFormControls.PurchaseVAT.setValidators([Validators.required]);
    //this.receiptFormControls.BrandSelCode.setValidators([Validators.required]);
    //this.receiptFormControls.ModelSelCode.setValidators([Validators.required]);
    //this.receiptFormControls.assetStatusSelCode.setValidators([Validators.required]);
    //this.receiptFormControls.assetConditionSelCode.setValidators([Validators.required]);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateValiditityForGridAddControls() {
    if(this.isInvoice)
    {
    this.receiptFormControls.ItemCode.updateValueAndValidity();
    this.receiptFormControls.InvoiceNo.updateValueAndValidity();
    }
    if(this.isPurchaseOrder)
    {
      this.receiptFormControls.InvoiceNo.updateValueAndValidity();
    }
    //this.receiptFormControls.UOMCode.updateValueAndValidity();
    //this.receiptFormControls.SupPartNumber.updateValueAndValidity();
    this.receiptFormControls.GoldWeight.updateValueAndValidity();
    this.receiptFormControls.EnterQty.updateValueAndValidity();
    this.receiptFormControls.PurchasePrice.updateValueAndValidity();
    this.receiptFormControls.PurchaseVAT.updateValueAndValidity();
    //this.receiptFormControls.BrandSelCode.updateValueAndValidity();
    //this.receiptFormControls.ModelSelCode.updateValueAndValidity();
    //this.receiptFormControls.assetStatusSelCode.updateValueAndValidity();
    //this.receiptFormControls.assetConditionSelCode.updateValueAndValidity();
  }

  private DisableValidatorsForGridAddControls() {

    this.receiptFormControls.InvoiceNo.setValidators(null);
    this.receiptFormControls.ItemCode.setValidators(null);
    this.receiptFormControls.EnterQty.setValidators(null);
    this.receiptFormControls.GoldWeight.setValidators(null);
    this.receiptFormControls.PurchasePrice.setValidators(null);
    this.receiptFormControls.PurchaseVAT.setValidators(null);
    //this.receiptFormControls.SupPartNumber.setValidators(null);
    //this.receiptFormControls.UOMCode.setValidators(null);
    //this.receiptFormControls.BrandSelCode.setValidators(null);
    //this.receiptFormControls.ModelSelCode.setValidators(null);
    //this.receiptFormControls.assetStatusSelCode.setValidators(null);
    //this.receiptFormControls.assetConditionSelCode.setValidators(null);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateReceiptSubGridRows() {
    this.agGrid.api.setRowData(this.rowData);
    this.agGrid.api.redrawRows();
  }

  private UpdateReceiptItemLine() {
    this.poItemsLine = new ReceiptDetailsModel();
    this.errorPO='';
    if(this.isPurchaseOrder || this.isTransferOrder)
    {
     
      this.poItemsLine.refDocLineNumber=this.ItemLineNumber;
      this.poItemsLine.itemID = this.itemCodes.filter(x => x.itemCode == this.ItemCodeDisplay)[0].id;
      this.poItemsLine.itemName = this.itemCodes.filter(x => x.id == this.itemCodes.filter(x => x.itemCode == this.ItemCodeDisplay)[0].id)[0].itemName;
      this.poItemsLine.itemDesc = this.itemCodes.filter(x => x.id == this.itemCodes.filter(x => x.itemCode == this.ItemCodeDisplay)[0].id)[0].itemDesc;
      this.poItemsLine.uomName = this.itemCodes.filter(x => x.id == this.itemCodes.filter(x => x.itemCode == this.ItemCodeDisplay)[0].id)[0].uomName;
      this.poItemsLine.purchaseQty=this.PurchaseQty;
      this.poItemsLine.metalWeight=this.PurchaseGoldWeight;
      this.poItemsLine.stoneWeight=this.PurchaseStoneWeight;
      this.poItemsLine.receivedMetalWeight=this.ReceiptedGoldWeight;
      this.poItemsLine.receivedStoneWeight=this.ReceiptedStoneWeight;
    }
    this.poItemsLine.purchasePrice=this.receiptFormControls.PurchasePrice.value;
    this.poItemsLine.purchaseVat=this.receiptFormControls.PurchaseVAT.value;
    this.poItemsLine.recMetalWeight=this.receiptFormControls.GoldWeight.value;
    this.poItemsLine.recStoneWeight=this.receiptFormControls.StoneWeight.value;
    this.poItemsLine.receiptQty = this.receiptFormControls.EnterQty.value;
    this.poItemsLine.receivedQty = this.ReceiptedQty ;//+ parseFloat(this.receiptFormControls.EnterQty.value);
   // this.poItemsLine.uomID = this.receiptFormControls.UOMCode.value;
   if(this.isInvoice)
   {
     this.poItemsLine.itemID=this.itemCodes.filter(x => x.id == this.receiptFormControls.ItemCode.value)[0].id;
    this.poItemsLine.itemName = this.itemCodes.filter(x => x.id == this.receiptFormControls.ItemCode.value)[0].itemName;
    this.poItemsLine.itemDesc = this.itemCodes.filter(x => x.id == this.receiptFormControls.ItemCode.value)[0].itemDesc;
    this.poItemsLine.uomName = this.itemCodes.filter(x => x.id == this.receiptFormControls.ItemCode.value)[0].uomName;
   }
   
   // this.poItemsLine.uomName = this.uomCodes.filter(x => x.id == this.receiptFormControls.UOMCode.value)[0].uomName;
    this.ClearAssetLineItemsControlsOnAdd();
    this.submitted = false;
  }

  EditReceipt() {
    this.errorPO='';
    this.poItemsLine = this.agGrid.api.getSelectedRows()[0];
    if(this.isInvoice)
    {
    this.receiptFormControls.SubCategoyCode.setValue(this.itemCodes.find(item => item.id == this.poItemsLine.itemID)?.subCategoryID);
    this.receiptFormControls.CategoyCode.setValue(this.itemCodes.find(item => item.id == this.poItemsLine.itemID)?.categoryID);
    this.receiptFormControls.ItemCode.setValue(this.poItemsLine.itemID);
    }
    else
    {
    this.ItemCodeDisplay=this.itemCodes.find(item => item.id == this.poItemsLine.itemID)?.itemCode as string;
    this.CategoyCodeDisplay=this.categoryCodes.find(item => item.id == this.itemCodes.find(item => item.id == this.poItemsLine.itemID)?.categoryID)?.categoryName as string;
    this.SubCategoyCodeDisplay=this.subCategoryCodes.find(item => item.id == this.itemCodes.find(item => item.id == this.poItemsLine.itemID)?.subCategoryID)?.subCategoryName as string;
    this.PurchaseQty=this.poItemsLine.purchaseQty;
    this.PurchaseGoldWeight=this.poItemsLine.metalWeight;
    this.PurchaseStoneWeight=this.poItemsLine.stoneWeight;
    this.ReceiptedGoldWeight=this.poItemsLine.receivedMetalWeight;
    this.ReceiptedStoneWeight=this.poItemsLine.receivedStoneWeight;
    }    
    this.ReceiptedQty=this.poItemsLine.receivedQty;
    this.receiptFormControls.EnterQty.setValue(this.poItemsLine.receiptQty);
    this.receiptFormControls.PurchasePrice.setValue(this.poItemsLine.purchasePrice);
    this.receiptFormControls.PurchaseVAT.setValue(this.poItemsLine.purchaseVat);
    this.receiptFormControls.GoldWeight.setValue(this.poItemsLine.recMetalWeight);
    this.receiptFormControls.StoneWeight.setValue(this.poItemsLine.recStoneWeight);
    //this.receiptFormControls.UOMCode.setValue(this.poItemsLine.uomID);
    $('.select2bs4').select2().trigger('change');
    this.ItemLineNumber=this.poItemsLine.refDocLineNumber;
    this.productDescription = this.poItemsLine.itemDesc;
    this.UOMCode = this.poItemsLine.uomName;
    this.isPOAddHidden = true;
    this.isPODeleteHidden = true;
    this.isPOEditHidden = true;
    this.isPOUpdateHidden = false;
    this.isPOCancelHidden = false;
    this.isPOClearHidden=true;
  }

  DeleteReceiptDetails() {
    this.poItemsLine = this.agGrid.api.getSelectedRows()[0];
   const index = this.rowData.findIndex(x => x.itemID == this.poItemsLine.itemID);
    if (index > -1)
    {
      this.rowData.splice(index, 1);
      this.agGrid.api.setRowData(this.rowData);
      this.agGrid.api.redrawRows();
    }
  }

  onReceiptRowClick(event: any) {
    
      this.isPOEditHidden = !this.isPOUpdateHidden || this.viewMode;
      this.isPODeleteHidden = !this.isPOUpdateHidden || this.viewMode;
    
  }

  ClearAssetLineItemsControlsOnAdd() {
    this.productDescription = '';
    this.UOMCode='';
    this.ItemLineNumber='';
    this.ReceiptedQty=0;
    this.receiptFormControls.EnterQty.setValue('');
    this.receiptFormControls.PurchasePrice.setValue('');
    this.receiptFormControls.PurchaseVAT.setValue('');
    this.receiptFormControls.GoldWeight.setValue('');
    this.receiptFormControls.StoneWeight.setValue('');
    if(this.isInvoice)
    {
    this.receiptFormControls.ItemCode.setValue('');
    this.receiptFormControls.CategoyCode.setValue('');
    this.receiptFormControls.SubCategoyCode.setValue('');
    }
    else
    {
      this.ItemCodeDisplay='';
      this.CategoyCodeDisplay='';
      this.SubCategoyCodeDisplay='';
      this.PurchaseQty=0;
      this.ReceiptedQty=0;
      this.PurchaseGoldWeight=0;
      this.PurchaseStoneWeight=0;
      this.ReceiptedStoneWeight=0;
      this.ReceiptedGoldWeight=0;
    }
    this.subCategoryCodes=this.subCategoryCodesSearchHolder;
    this.itemCodes=this.ItemSearchHolder;
    //this.receiptFormControls.UOMCode.setValue('');
    // if(this.isInvoice)
     //$('select').select2().trigger('change');
    //  $('.select2').select2().trigger('change');
    $("#ItemCode").select2().trigger('change');
    $("#CategoyCode").select2().trigger('change');
    $("#SubCategoyCode").select2().trigger('change');
  }

  UpdateReceiptDetails() {
    this.SetValidatorsForGridAddControls();
    this.submitted = true;
    this.errorPO = '';
    this.receiptFormControls.ReceiptDate.setValue($('[name="RecpDate"]').val());
    if (this.receiptForm.invalid)
      return;
      if(this.isPurchaseOrder || this.isTransferOrder)
      {
      if(this.receiptFormControls.EnterQty.value>this.PurchaseQty)
      {
        this.errorPO='Receipt Qty cannot be greater than ordered qty';
        return;
      }
if(this.editMode)
{
  if((parseFloat(this.receiptFormControls.EnterQty.value)+(this.poItemsLine.receivedQty-this.poItemsLine.receiptQty))>this.PurchaseQty)
  {
    this.errorPO='Receipt Qty cannot be greater than ordered qty';
    return;
  }
}
else
{
  if((parseFloat(this.receiptFormControls.EnterQty.value)+this.poItemsLine.receivedQty)>this.PurchaseQty)
  {
    this.errorPO='Receipt Qty cannot be greater than ordered qty';
    return;
  }
}
     
    }
    if(this.isPurchaseOrder || this.isInvoice)
    {
      if(this.receiptFormControls.PurchasePrice.value==null || this.receiptFormControls.PurchasePrice.value==0)
      {
        this.errorPO='Please enter purchase price';
        return;
      }
      if(this.receiptFormControls.PurchaseVAT.value==null || this.receiptFormControls.PurchaseVAT.value==0)
      {
        this.errorPO='Please enter purchase VAT';
        return;
      }
    }
    
    this.UpdateReceiptItemLine();

    // const hasSameProduct = this.rowData.some(x => x.itemID == this.receiptFormControls.ProductSelDesc.value &&
    //   x.assetCode ==  this.poItemsLine.assetCode);
    
    // if (hasSameProduct) {
    //   this.errorPO = 'Same record with Product and Asset Code already exists!';
    //   return;
    // }
    var index =0;
    if(this.isPurchaseOrder || this.isTransferOrder)
    index = this.rowData.findIndex(x => x.itemID == this.poItemsLine.itemID && x.refDocLineNumber==this.poItemsLine.refDocLineNumber);
    else
    index = this.rowData.findIndex(x => x.itemID == this.poItemsLine.itemID);
    if (index > -1)
    {
      this.rowData[index] = this.poItemsLine;
    }
    this.UpdateReceiptSubGridRows();
    this.isPOAddHidden = false;
    this.isPODeleteHidden = true;
    this.isPOEditHidden = true;
    this.isPOUpdateHidden = true;
    this.isPOCancelHidden = true;
    this.isPOClearHidden=false;
    this.DisableValidatorsForGridAddControls();
  }

  CancelPODetails() {
    this.isPOAddHidden = false;
    this.isPODeleteHidden = true;
    this.isPOEditHidden = true;
    this.isPOUpdateHidden = true;
    this.isPOCancelHidden = true;
    this.isPOClearHidden=false;
    this.errorPO='';
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
  }

  ClearPOItemDetails() {
    this.productDescription = '';
    this.UOMCode='';
    this.receiptFormControls.ItemCode.setValue('');
    this.receiptFormControls.EnterQty.setValue('');
    this.receiptFormControls.GoldWeight.setValue('');
    this.receiptFormControls.StoneWeight.setValue('');
    this.receiptFormControls.CategoyCode.setValue('');
    this.receiptFormControls.SubCategoyCode.setValue('');
    this.subCategoryCodes=this.subCategoryCodesSearchHolder;
    this.itemCodes=this.ItemSearchHolder;
    //this.rowpoData=[];
    this.errorPO = '';
    $('select').select2().trigger('change');
  }

  ShowGrid(){
    if(this.editMode)
    {
      if(this.isApproveUrl)
      this.router.navigateByUrl('/receiptapprove');
      else
      this.router.navigateByUrl('/receipt/view');
    }
    else
    {
    this.router.navigateByUrl('/receipt');
    }
  }

  disableControls() {
    this.receiptFormControls.ReceiptAgainst.disable();
    this.receiptFormControls.ReceiptDate.disable();
    $("#ReceiptDate .datetimepicker-input").attr('disabled', true); 
    if(this.isInvoice || this.isPurchaseOrder)
    {
      this.receiptFormControls.warehouseSelCode.disable();
      this.receiptFormControls.supplierSelCode.disable();
    }
   // $("#DocumentDate .datetimepicker-input").attr('disabled', true);
    this.isbtnSaveDisabled = this.viewMode;
    this.isbtnClearDisabled = this.viewMode;
    this.isPODeleteHidden = true;
    this.isPOEditHidden = true;
    this.isPOUpdateHidden = true;
    this.isPOCancelHidden = true;
    this.isPOClearHidden=true;
  }

  ClearContents() {
    this.receiptNumber = '';
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
   
    this.receiptFormControls.Remarks.setValue('');
    this.receiptFormControls.ReceiptAgainst.setValue('');
this.receiptFormControls.DocumentNo.setValue('');
this.receiptFormControls.warehouseSelCode.setValue('');
this.receiptFormControls.warehouseFilterSelCode.setValue('');
this.receiptFormControls.InvoiceNo.setValue('');
this.WarehouseName='';
this.rowData=[];
this.rowDocData=[];
this.rowRecData=new ReceiptModel;
this.supplierName='';
this.isReceiptTypeSelected=false;
     $("#ReceiptDate .datetimepicker-input").val(datepart); 
     $("#DocumentDate .datetimepicker-input").val(datepart); 
     $("#InvoiceDate .datetimepicker-input").val(datepart); 
    this.receiptFormControls.supplierSelCode.setValue('');
    this.receiptFormControls.supplierFilterSelCode.setValue('');
    //this.rowpoData = [];
    this.UpdateReceiptSubGridRows();
    $('.select2bs4').select2().trigger('change');
    
  }

  ShowEditViewReceiptMaster(data: ReceiptModel) {
    this.isPurchaseOrder=false;
    this.isInvoice=false;
    this.isTransferOrder=false;
    this.receiptFormControls.ReceiptAgainst.setValue(data.receiptType);
    this.receiptAgainstChange();
    this.receiptFormControls.Remarks.setValue(data.remarks);
    $("#ReceiptDate .datetimepicker-input").val(formatDate(data.receiptDate, 'MM/dd/yyyy', 'en-US'));
    this.receiptFormControls.ReceiptDate.setValue($("#ReceiptDate .datetimepicker-input").val());
    this.receiptFormControls.warehouseSelCode.setValue(data.warehouseID);
    if(data.receiptType=="PurchaseOrder")
    {
      this.isPurchaseOrder=true;
      this.supplierName=data.supplierName;
      this.receiptFormControls.DocumentNo.setValue(data.poNumber);
      this.receiptFormControls.DocumentDate.setValue(formatDate(data.poDate, 'MM/dd/yyyy', 'en-US'));
      $("#DocumentDate .datetimepicker-input").val(formatDate(data.poDate, 'MM/dd/yyyy', 'en-US'));
      this.receiptFormControls.InvoiceDate.setValue(formatDate(data.supplierInvoiceDate, 'MM/dd/yyyy', 'en-US'));
      $("#InvoiceDate .datetimepicker-input").val(formatDate(data.supplierInvoiceDate, 'MM/dd/yyyy', 'en-US'));
      this.receiptFormControls.InvoiceNo.setValue(data.supplierInvoiceNo);
    }
    if(data.receiptType=="Invoice")
    {
      this.isInvoice=true;
      this.receiptFormControls.InvoiceDate.setValue(formatDate(data.supplierInvoiceDate, 'MM/dd/yyyy', 'en-US'));
      $("#InvoiceDate .datetimepicker-input").val(formatDate(data.supplierInvoiceDate, 'MM/dd/yyyy', 'en-US'));
      this.receiptFormControls.InvoiceNo.setValue(data.supplierInvoiceNo);
      this.receiptFormControls.supplierSelCode.setValue(data.supplierID);
    }
    if(data.receiptType=="TransferOrder")
    {
      this.WarehouseName=data.fromWarehouseName;
      this.receiptFormControls.DocumentNo.setValue(data.poNumber);
      this.receiptFormControls.DocumentDate.setValue(formatDate(data.poDate, 'MM/dd/yyyy', 'en-US'));
      $("#DocumentDate .datetimepicker-input").val(formatDate(data.poDate, 'MM/dd/yyyy', 'en-US'));
    }
    
    // $("#PODate .datetimepicker-input").val(formatDate(data.poDate, 'MM/dd/yyyy', 'en-US'));
    $('.select2bs4').select2().trigger('change'); 
    // $('#ReceiptAgainst').val(data.receiptType).trigger('change'); 
    this.rowData = data.receiptDetails;
    this.UpdateReceiptSubGridRows();
    this.disableControls();
  }

  CancelReceipt()
  {
    this.inactivateAlert.InactivateConfirmBox(this.receiptNumber, this.name);
  }

  ApproveReceipt()
  {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.receiptForm.invalid ) {
      return;
    }
    // if(!(this.rowpoData.length > 0)){
    //   this.error = 'Please add receipt line items';
    //   return;
    // }
      let saveResponse: Observable<any>;
      this.loading = true;
      this.receiptModel = new ReceiptModel;
      this.receiptModel.receiptNumber = this.receiptNumber;
      alert(this.receiptNumber);
      saveResponse = this.receiptService.approveReceipt(this.receiptNumber);
    
    saveResponse.subscribe(
      result => {
        this.saveAlert.SuccessMessage();
      //  this.poService.AddOrEditRecordToCache(this.purchaseOrderModel, this.editMode);
        this.submitted = false;
        if (this.editMode) {
          this.ShowGrid();
        }
        this.loading = false;
      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );
  }
  index!:number;
  SaveReceipt(){
    this.DisableValidatorsForGridAddControls();
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.receiptForm.invalid ) {
      return;
    }
    
    // if(!(this.rowpoData.length > 0)){
    //   this.error = 'Please add receipt line items';
    //   return;
    // }
      let saveResponse: Observable<any>;
      this.loading = true;
      this.receiptModel = new ReceiptModel;
      this.receiptModel.reference1Value = this.receiptFormControls.DocumentNo.value;
      if(this.isPurchaseOrder)
      {
      this.receiptModel.reference1Type= 'PurchaseOrderNumber';
      this.receiptModel.receiptType= 'PurchaseOrder';
      }
      else if(this.isTransferOrder)
      {
      this.receiptModel.reference1Type= 'TransferOrderNumber';
      this.receiptModel.receiptType= 'TransferOrder';
      }
      if(this.isPurchaseOrder || this.isInvoice)
      {
        this.receiptModel.supplierInvoiceNo=this.receiptFormControls.InvoiceNo.value;
        this.receiptModel.supplierInvoiceDate= $('#InvoiceDate .datetimepicker-input').val();
        this.receiptModel.receiptType= 'PurchaseOrder';
        if(this.isPurchaseOrder)
        {
          if(!this.editMode)
          this.receiptModel.supplierID = this.rowRecData.supplierID;
          if(this.editMode)
          this.receiptModel.supplierID=this.receiptData.supplierID;
        }
        if( this.isInvoice)
        {
          this.receiptModel.supplierID = this.receiptFormControls.supplierSelCode.value;
        this.receiptModel.receiptType= 'Invoice';
        }
      }
      this.receiptModel.remarks = this.receiptFormControls.Remarks.value;
      this.receiptModel.status=this.documentstatus.new;
      this.receiptModel.warehouseID=this.receiptFormControls.warehouseSelCode.value;
      this.receiptModel.remarks=this.receiptFormControls.Remarks.value;
      this.receiptModel.receiptDate=$('#ReceiptDate .datetimepicker-input').val();
      
      this.receiptModel.receiptDetails = this.rowData;
      console.log(this.receiptModel);
      if(this.editMode){
        this.receiptModel.receiptDetails.forEach(element => {
          element.uomid=0;
          element.lineStatus=this.documentstatus.new;
        });
        this.receiptModel.receiptNumber=this.receiptNumber;
       saveResponse = this.receiptService.editReceipt(this.receiptModel);
      } else {
        this.index=0;
        this.receiptModel.receiptDetails.forEach(element => {
          element.uomid=0;
          element.lineStatus=this.documentstatus.new;
          if(element.receivedQty==element.purchaseQty)
          {
            this.receiptModel.receiptDetails.splice(this.index,1);
          }
          else if(element.receiptQty==0)
          {
            this.receiptModel.receiptDetails.splice(this.index,1);
          }
          this.index++;
        });
        saveResponse = this.receiptService.addReceipt(this.receiptModel);
    }

    
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
         // this.purchaseOrderModel.receiptNumber = result.receiptNumber;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
      //  this.poService.AddOrEditRecordToCache(this.purchaseOrderModel, this.editMode);
        this.submitted = false;
        if (this.editMode) {
          this.ShowGrid();
        }
        this.loading = false;
      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );

  }


}
