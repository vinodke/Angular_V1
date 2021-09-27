import { formatDate } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { categorymasterservice } from '../../../../core/service/categorymaster.service';
import { itemMasterService } from '../../../../core/service/itemmaster.service';
import { purchaseorderService } from '../../../../core/service/purchaseorder.service';
import { subcategorymasterservice } from '../../../../core/service/subcategorymaster.service';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { uommasterservice } from '../../../../core/service/uommaster.service';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { ModalService } from '../../../../core/_modal';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { CategoryMasterModel } from '../../../../shared/model/CategoryMasterModel';
import { ItemMasterModel } from '../../../../shared/model/ItemMasterModel';
import { PurchaseOrderDTModel } from '../../../../shared/model/PurchaseOrderDTModel';
import { PurchaseOrderModel } from '../../../../shared/model/PurchaseOrderModel';
import { SubCategoryMasterModel } from '../../../../shared/model/SubCategoryMasterModel';
import { SupplierMasterModel } from '../../../../shared/model/SupplierMasterModel';
import { UOMMasterModel } from '../../../../shared/model/UOMMasterModel';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { Observable } from 'rxjs';
declare var $: any;


@Component({
  selector: 'org-fat-purchaseorderform',
  templateUrl: './purchaseorderform.component.html',
  styleUrls: ['./purchaseorderform.component.scss']
})
export class PurchaseorderformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  purchaseOrderForm: FormGroup;
  poLineNumber!:string;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  poNumber!: string;
  isWarehouse:boolean=false;
  isSupplier:boolean=false;
  isItem:boolean=false;
  error = '';
  errorPO = '';
  editMode: boolean = false;
  poData!: PurchaseOrderModel;
  purchaseOrderModel: PurchaseOrderModel = new PurchaseOrderModel;
  rowpoData!: PurchaseOrderDTModel[];
  columnPODefs: any;
  suppCodes!: SupplierMasterModel[];
  warehouseCodes!:WarehouseMasterModel[];
  categoryCodes!: CategoryMasterModel[];
  subCategoryCodes!: SubCategoryMasterModel[];
  poItemsLine!: PurchaseOrderDTModel;
  itemCodes!: ItemMasterModel[];
  uomCodes!: UOMMasterModel[];
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
  isVisible:boolean=false;
  @Input() name:string='purchaseorder';
  bodyText!: string;
   
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private poService: purchaseorderService,
    private supplierMasterService: SupplierMasterService,
    private categoryMasterService: categorymasterservice,
    private subCategoryMasterService: subcategorymasterservice,
    private itemMasterService: itemMasterService,
    private uomMasterService: uommasterservice,
    private warehouseMasterService: warehousemasterservice,
    private saveAlert: SaveAlert,
    private inactivateAlert: InactivateAlert,
    private modalService:ModalService) { 

      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    this.isApproveAllowed = localStorage.getItem("isApproveAllowed") =="true";
      this.purchaseOrderForm = this.formBuilder.group({
      supplierSelCode: [null, Validators.required],
      warehouseSelCode: [null, Validators.required],
      MetalWeight: [null],
      StoneWeight: [null],
      Remarks: [null],
      PODate: [null],
      CategoyCode: [null],
      SubCategoyCode: [null],
      ItemCode: [null],
      //UOMCode: [null],
      EnterQty: [null]
    });
  }

  async ngOnInit() {
    this.bodyText = 'This text can be updated in modal 1';
    this.rowpoData = [];
    this.columnPODefs = [
      { headerName:'Item Name', field: 'itemName', sortable: true, filter: true, resizable: true,width:250 },
      { headerName:'Item Desc', field: 'itemDesc', sortable: true, filter: true, resizable: true,width:350 },
      { headerName:'UOM Code', field: 'uomName', sortable: true, filter: true, resizable: true },
      { headerName:'Line Number', field: 'poLineNumber', sortable: true, filter: true, resizable: true },
      { headerName:'Metal Weight', field: 'metalWeight', sortable: true, filter: true, resizable: true,hide: false,
      suppressToolPanel: false },
      { headerName:'Stone Weight', field: 'stoneWeight', sortable: true, filter: true, resizable: true,hide: false,
      suppressToolPanel: false },
      { headerName:'Order Qty', field: 'orderQty', sortable: true, filter: true, resizable: true }
     ];
    this.SetDropDownValueOnChange();

    this.SetDatePickerInitValue(); 
this.headerText='New Purchase Order Entry';
    //Get Drop Down Items
    await this.GetDropDownInitValues();

    this.route.params.subscribe(async params => {
        if(params['id'] != undefined) {
          this.poNumber = params['id'];
          this.editMode = true;
          this.headerText='Edit Purchase Order';
          this.poData =  (await this.poService.getPurchaseOrderMasterByKey(this.poNumber));
          if (this.poData.status == 50) {
            alert('PO is Approved cannot edit it!!');
            this.ShowGrid();
          }
          this.ShowEditViewReceiptMaster(this.poData);
          
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
      if(rturl.toString().includes("purchaseorderapprove"))
      {
      this.headerText='Approve Purchase Order';
      this.isApproveUrl=true;
      this.purchaseOrderFormControls.Remarks.disable();
      }
      else
      {
      this.isApproveUrl=false;
      }
     
  });
  }

  openModal(id: string) {
    this.modalService.open(id);
}

closeModal(id: string) {
    this.modalService.close(id);
}

  ViewPurchaseOrder(){
    this.router.navigateByUrl('/purchaseorder/view');
  }

  private async GetDropDownInitValues() {
    this.itemCodes = await this.itemMasterService.getItemMaster();
    this.ItemSearchHolder=this.itemCodes;
    this.suppCodes = await this.supplierMasterService.getSupplierMaster();
    this.warehouseCodes = await this.warehouseMasterService.getWarehouseMaster();
    this.categoryCodes = await this.categoryMasterService.getCategoryMaster();
    this.subCategoryCodes = await this.subCategoryMasterService.getSubCategoryMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.uomCodes = await this.uomMasterService.getUOMMaster();
  }

  private SetDatePickerInitValue() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('#PODate').datetimepicker({
      format: 'L'
    });

    $('[name="#RecpDate"]').on("change", () => {
      this.purchaseOrderFormControls.RecpDate.setValue($('[name="RecpDate"]').val());
    });

    $("#PODate .datetimepicker-input").val(datepart); // Assign the value
    $("#PODate .datetimepicker-input").trigger("click"); // Trigger click
  }

  private SetDropDownValueOnChange() {
    $('.select2bs4').select2();

    $('[name="supplierSelCode"]').on("change", () => {
      this.purchaseOrderFormControls.supplierSelCode.setValue($('[name="supplierSelCode"]').val());
    });
    $('[name="warehouseSelCode"]').on("change", () => {
      this.purchaseOrderFormControls.warehouseSelCode.setValue($('[name="warehouseSelCode"]').val());
    });

    // $('[name="ProductSelDesc"]').on("change", () => {
    //   this.purchaseOrderFormControls.ProductSelDesc.setValue($('[name="ProductSelDesc"]').val());
    // });

    $('[name="ItemCode"]').on("change", () => {
      this.purchaseOrderFormControls.ItemCode.setValue($('[name="ItemCode"]').val());
      if($('[name="ItemCode"]').val() > 0) {
        this.UOMCode=this.itemCodes.find(item => item.id == this.purchaseOrderFormControls.ItemCode.value)?.uomName as string;
        if(this.UOMCode.toLowerCase().includes('pcs'))
        {
        this.isVisible=false;
        }
        else
        {
        this.isVisible=true;
        }
        this.productDescription = this.itemCodes.find(item => item.id == this.purchaseOrderFormControls.ItemCode.value)?.itemDesc as string;
      }
    });

    $('[name="CategoyCode"]').on("change", () => {
      this.productDescription="";
      this.UOMCode="";
      this.purchaseOrderFormControls.CategoyCode.setValue($('[name="CategoyCode"]').val());
      if($('[name="CategoyCode"]').val()>0)
      {
      this.itemCodes=[];
      this.itemCodes = this.ItemSearchHolder.filter(item => item.categoryID ==this.purchaseOrderFormControls.CategoyCode.value);
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.categoryID ==this.purchaseOrderFormControls.CategoyCode.value);
      }
    });

    $('[name="SubCategoyCode"]').on("change", () => {
      this.productDescription="";
      this.UOMCode="";
      this.purchaseOrderFormControls.SubCategoyCode.setValue($('[name="SubCategoyCode"]').val());
      if($('[name="SubCategoyCode"]').val()>0)
{
      this.itemCodes=[];
      this.itemCodes = this.ItemSearchHolder.filter(item => item.subCategoryID ==this.purchaseOrderFormControls.SubCategoyCode.value);
}
    });

    // $('[name="UOMCode"]').on("change", () => {
    //   this.purchaseOrderFormControls.UOMCode.setValue($('[name="UOMCode"]').val());
    // });

    }

  get purchaseOrderFormControls() { return this.purchaseOrderForm.controls; }

  // ngViewInit() {
  //   const today = new Date();
  //   const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  //   this.purchaseOrderFormControls.ReceiptDate.setValue(datepart);
  // }

  AddToPOGrid() {
    this.SetValidatorsForGridAddControls();

    this.submitted = true;
    
    this.errorPO = '';
    if (this.purchaseOrderForm.invalid)
      return;

    this.error = '';
    // const hasSameProduct = this.rowpoData.some(x =>  x.itemID ==  this.itemCodes.filter(x => x.id == this.purchaseOrderFormControls.ItemCode.value)[0].id);
    
    // if (hasSameProduct) {
    //   this.errorPO = 'Same record with Product code already exists!';
    //   return;
    // }
  
    this.UpdateReceiptItemLine('add');
    this.rowpoData.push(this.poItemsLine);
    this.UpdateReceiptSubGridRows();
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
    this.submitted = false;
  }

  private SetValidatorsForGridAddControls() {
    this.purchaseOrderFormControls.ItemCode.setValidators([Validators.required]);
   // this.purchaseOrderFormControls.UOMCode.setValidators([Validators.required]);
    //this.purchaseOrderFormControls.SupPartNumber.setValidators([Validators.required]);
    this.purchaseOrderFormControls.EnterQty.setValidators([Validators.required]);
    //this.purchaseOrderFormControls.BrandSelCode.setValidators([Validators.required]);
    //this.purchaseOrderFormControls.ModelSelCode.setValidators([Validators.required]);
    //this.purchaseOrderFormControls.assetStatusSelCode.setValidators([Validators.required]);
    //this.purchaseOrderFormControls.assetConditionSelCode.setValidators([Validators.required]);
    this.UpdateValiditityForGridAddControls();
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



  private UpdateValiditityForGridAddControls() {
    this.purchaseOrderFormControls.ItemCode.updateValueAndValidity();
    //this.purchaseOrderFormControls.UOMCode.updateValueAndValidity();
    //this.purchaseOrderFormControls.SupPartNumber.updateValueAndValidity();
    this.purchaseOrderFormControls.EnterQty.updateValueAndValidity();
    //this.purchaseOrderFormControls.BrandSelCode.updateValueAndValidity();
    //this.purchaseOrderFormControls.ModelSelCode.updateValueAndValidity();
    //this.purchaseOrderFormControls.assetStatusSelCode.updateValueAndValidity();
    //this.purchaseOrderFormControls.assetConditionSelCode.updateValueAndValidity();
  }

  private DisableValidatorsForGridAddControls() {
    this.purchaseOrderFormControls.ItemCode.setValidators(null);
    this.purchaseOrderFormControls.EnterQty.setValidators(null);
    //this.purchaseOrderFormControls.SupPartNumber.setValidators(null);
    //this.purchaseOrderFormControls.UOMCode.setValidators(null);
    //this.purchaseOrderFormControls.BrandSelCode.setValidators(null);
    //this.purchaseOrderFormControls.ModelSelCode.setValidators(null);
    //this.purchaseOrderFormControls.assetStatusSelCode.setValidators(null);
    //this.purchaseOrderFormControls.assetConditionSelCode.setValidators(null);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateReceiptSubGridRows() {
    this.agGrid.api.setRowData(this.rowpoData);
    this.agGrid.api.redrawRows();
  }

  private UpdateReceiptItemLine(type:string) {
    this.poItemsLine = new PurchaseOrderDTModel();
    if(this.isVisible)
    {
      this.poItemsLine.metalWeight=this.purchaseOrderFormControls.MetalWeight.value;
      this.poItemsLine.stoneWeight= this.purchaseOrderFormControls.StoneWeight.value;
    }
    else
    {
      this.poItemsLine.metalWeight=0;
      this.poItemsLine.stoneWeight=0;
    }
    if(type=='add')
    this.poItemsLine.poLineNumber=(this.rowpoData.length+1).toString();
    else if(type='edit')
    this.poItemsLine.poLineNumber=this.poLineNumber;
    this.poItemsLine.itemID = this.purchaseOrderFormControls.ItemCode.value;
    this.poItemsLine.orderQty = this.purchaseOrderFormControls.EnterQty.value;
   // this.poItemsLine.uomID = this.purchaseOrderFormControls.UOMCode.value;
    this.poItemsLine.itemName = this.itemCodes.filter(x => x.id == this.purchaseOrderFormControls.ItemCode.value)[0].itemName;
    this.poItemsLine.itemDesc = this.itemCodes.filter(x => x.id == this.purchaseOrderFormControls.ItemCode.value)[0].itemDesc;
    this.poItemsLine.uomName = this.itemCodes.filter(x => x.id == this.purchaseOrderFormControls.ItemCode.value)[0].uomName;
   // this.poItemsLine.uomName = this.uomCodes.filter(x => x.id == this.purchaseOrderFormControls.UOMCode.value)[0].uomName;
    this.ClearAssetLineItemsControlsOnAdd();
    this.submitted = false;
  }

  EditPO() {
    this.poItemsLine = this.agGrid.api.getSelectedRows()[0];
    this.poLineNumber=this.poItemsLine.poLineNumber;
    this.productDescription = this.itemCodes.find(item => item.id == this.poItemsLine.itemID)?.itemDesc as string;
    this.UOMCode = this.itemCodes.find(item => item.id == this.poItemsLine.itemID)?.uomName as string;
    if(this.UOMCode.toLowerCase().includes('pcs'))
    this.isVisible=false;
    else
    this.isVisible=true;
    this.purchaseOrderFormControls.SubCategoyCode.setValue(this.itemCodes.find(item => item.id == this.poItemsLine.itemID)?.subCategoryID);
    this.purchaseOrderFormControls.CategoyCode.setValue(this.itemCodes.find(item => item.id == this.poItemsLine.itemID)?.categoryID);
    this.purchaseOrderFormControls.ItemCode.setValue(this.poItemsLine.itemID);
    this.purchaseOrderFormControls.EnterQty.setValue(this.poItemsLine.orderQty);
    if(this.isVisible)
    {
    this.purchaseOrderFormControls.MetalWeight.setValue(this.poItemsLine.metalWeight);
    this.purchaseOrderFormControls.StoneWeight.setValue(this.poItemsLine.stoneWeight);
    }
    //this.purchaseOrderFormControls.UOMCode.setValue(this.poItemsLine.uomID);
    $('select').select2().trigger('change');
    this.isPOAddHidden = true;
    this.isPODeleteHidden = true;
    this.isPOEditHidden = true;
    this.isPOUpdateHidden = false;
    this.isPOCancelHidden = false;
    this.isPOClearHidden=true;
  }

  DeletePODetails() {
    this.poItemsLine = this.agGrid.api.getSelectedRows()[0];
    const index = this.rowpoData.findIndex(x => x.itemID == this.poItemsLine.itemID && x.poLineNumber==this.poItemsLine.poLineNumber);
    if (index > -1)
    {
      this.rowpoData.splice(index, 1);
      var lineindex:number=1;
      this.rowpoData.forEach(element => {
        element.poLineNumber=lineindex.toString();
        lineindex++;
      });
      this.agGrid.api.setRowData(this.rowpoData);
      this.agGrid.api.redrawRows();
      this.isPODeleteHidden=true;
      this.isPOEditHidden=true;
    }
  }

  onReceiptRowClick(event: any) {
    
      this.isPOEditHidden = !this.isPOUpdateHidden || this.viewMode;
      this.isPODeleteHidden = !this.isPOUpdateHidden || this.viewMode;
    
  }

  ClearAssetLineItemsControlsOnAdd() {
    this.productDescription = '';
    this.UOMCode='';
    this.purchaseOrderFormControls.MetalWeight.setValue('');
    this.purchaseOrderFormControls.StoneWeight.setValue('');
    this.purchaseOrderFormControls.ItemCode.setValue('');
    this.purchaseOrderFormControls.EnterQty.setValue('');
    this.purchaseOrderFormControls.CategoyCode.setValue('');
    this.purchaseOrderFormControls.SubCategoyCode.setValue('');
    this.subCategoryCodes=this.subCategoryCodesSearchHolder;
    this.itemCodes=this.ItemSearchHolder;
    //this.purchaseOrderFormControls.UOMCode.setValue('');
    $('select').select2().trigger('change');
  }

  UpdatePODetails() {
    this.SetValidatorsForGridAddControls();
    this.submitted = true;
    this.errorPO = '';
    if (this.purchaseOrderForm.invalid)
      return;

    this.UpdateReceiptItemLine('edit');

    // const hasSameProduct = this.rowpoData.some(x => x.productId == this.purchaseOrderFormControls.ProductSelDesc.value &&
    //   x.assetCode ==  this.poItemsLine.assetCode);
    
    // if (hasSameProduct) {
    //   this.errorPO = 'Same record with Product and Asset Code already exists!';
    //   return;
    // }
    const index = this.rowpoData.findIndex(x => x.itemID == this.poItemsLine.itemID && x.poLineNumber==this.poItemsLine.poLineNumber);
    
    if (index > -1)
    {
      this.poItemsLine.poLineNumber=this.rowpoData[index].poLineNumber;
      this.rowpoData[index] = this.poItemsLine;
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
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
  }

  ClearPOItemDetails() {
    this.productDescription = '';
    this.UOMCode='';
    this.purchaseOrderFormControls.ItemCode.setValue('');
    this.purchaseOrderFormControls.EnterQty.setValue('');
    this.purchaseOrderFormControls.CategoyCode.setValue('');
    this.purchaseOrderFormControls.SubCategoyCode.setValue('');
    this.subCategoryCodes=this.subCategoryCodesSearchHolder;
    this.itemCodes=this.ItemSearchHolder;
    this.rowpoData=[];
    this.errorPO = '';
    $('select').select2().trigger('change');
  }

  ShowGrid(){
    if(this.editMode)
    {
      if(this.isApproveUrl)
      this.router.navigateByUrl('/purchaseorderapprove');
      else
      this.router.navigateByUrl('/purchaseorder/view');
    }
    else
    {
    this.router.navigateByUrl('/purchaseorder');
    }
  }

  disableControls() {
    this.purchaseOrderFormControls.supplierSelCode.disable();
    this.purchaseOrderFormControls.warehouseSelCode.disable();
    this.purchaseOrderFormControls.PODate.disable();
    $("#PODate .datetimepicker-input").attr('disabled', true); 
    $("#DocumentDate .datetimepicker-input").attr('disabled', true);
    this.isbtnSaveDisabled = this.viewMode;
    this.isbtnClearDisabled = this.viewMode;
    this.isPODeleteHidden = true;
    this.isPOEditHidden = true;
    this.isPOUpdateHidden = true;
    this.isPOCancelHidden = true;
    this.isPOClearHidden=true;
  }

  ClearContents() {
    this.poNumber = '';
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
   
    this.purchaseOrderFormControls.Remarks.setValue('');
     $("#PODate .datetimepicker-input").val(datepart); 
    this.purchaseOrderFormControls.supplierSelCode.setValue('');
    this.purchaseOrderFormControls.warehouseSelCode.setValue('');
    this.rowpoData = [];
    this.UpdateReceiptSubGridRows();
    $('select').select2().trigger('change');
    
  }

  ShowEditViewReceiptMaster(data: PurchaseOrderModel) {
    this.purchaseOrderFormControls.supplierSelCode.setValue(data.supplierID);
    this.purchaseOrderFormControls.warehouseSelCode.setValue(data.recWareHouseID);
    this.purchaseOrderFormControls.Remarks.setValue(data.remarks);
    $("#PODate .datetimepicker-input").val(formatDate(data.poDate, 'MM/dd/yyyy', 'en-US'));
    $('select').select2().trigger('change'); 
    this.rowpoData = data.itemLines;
    this.UpdateReceiptSubGridRows();
    this.disableControls();
  }

  CancelPO()
  {
    this.inactivateAlert.InactivateConfirmBox(this.poNumber, this.name);
  }

  ApprovePO()
  {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.purchaseOrderForm.invalid ) {
      return;
    }
    if(!(this.rowpoData.length > 0)){
      this.error = 'Please add receipt line items';
      return;
    }
      let saveResponse: Observable<any>;
      this.loading = true;
      this.purchaseOrderModel = new PurchaseOrderModel;
      this.purchaseOrderModel.poNumber = this.poNumber;
      saveResponse = this.poService.approvePO(this.poNumber);
    
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

  SavePO(){
    this.DisableValidatorsForGridAddControls();
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.purchaseOrderForm.invalid ) {
      return;
    }
    if(!(this.rowpoData.length > 0)){
      this.error = 'Please add receipt line items';
      return;
    }
      let saveResponse: Observable<any>;
      this.loading = true;
      this.purchaseOrderModel = new PurchaseOrderModel;
      this.purchaseOrderModel.poNumber = this.poNumber;
      this.purchaseOrderModel.remarks = this.purchaseOrderFormControls.Remarks.value;
      this.purchaseOrderModel.poDate = $('#PODate .datetimepicker-input').val();
      this.purchaseOrderModel.supplierID = this.purchaseOrderFormControls.supplierSelCode.value;
      this.purchaseOrderModel.recWareHouseID = this.purchaseOrderFormControls.warehouseSelCode.value;
      this.purchaseOrderModel.itemLines = this.rowpoData;

      if(this.editMode){
        this.purchaseOrderModel.itemLines.forEach(element => {
          element.uomid=0;
          element.lineStatus=0;
        });
       saveResponse = this.poService.editPurchaseOrdermaster(this.purchaseOrderModel);
      } else {
        saveResponse = this.poService.addPurchaseOrdermaster(this.purchaseOrderModel);
    }

    
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
         // this.purchaseOrderModel.poNumber = result.poNumber;
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
