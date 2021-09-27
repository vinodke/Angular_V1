import { formatDate } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { BrandmasterService } from '../../../../core/service/brandmaster.service';
import { BrandmodelmasterService } from '../../../../core/service/brandmodelmaster.service';
import { CommonValueListService } from '../../../../core/service/commonlistvalue.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { ReceiptMasterService } from '../../../../core/service/receiptmaster.service';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { BrandMasterModel } from '../../../../shared/model/BrandMasterModel';
import { BrandModelMasterModel } from '../../../../shared/model/BrandModelMasterModel';
import { CommonValueListModel } from '../../../../shared/model/CommonValueListModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { ReceiptItemsLine } from '../../../../shared/model/ReceiptItemsLine';
import { ReceiptMasterModel } from '../../../../shared/model/ReceiptMasterModel';
import { SupplierMasterModel } from '../../../../shared/model/SupplierMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-receiptmasterform',
  templateUrl: './receiptmasterform.component.html',
  styleUrls: ['./receiptmasterform.component.scss']
})
export class ReceiptmasterformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  receiptMasterForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  receiptId!: string;
  error = '';
  errorReceipt = '';
  editMode: boolean = false;
  receiptData!: ReceiptMasterModel;
  receiptmastermodel: ReceiptMasterModel = new ReceiptMasterModel;
  rowReceiptData!: ReceiptItemsLine[];
  columnReceiptDefs: any;
  suppCodes!: SupplierMasterModel[];
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  brandCodes!: BrandMasterModel[];
  modelCodes!: BrandModelMasterModel[];
  assetStatusCodes!: CommonValueListModel[];
  assetConditionCodes!: CommonValueListModel[];
  receiptItemsLine!: ReceiptItemsLine;
  productCodes!: ProductMasterModel[];
  isReceiptAddHidden: boolean = false;
  isReceiptEditHidden: boolean = true;
  isReceiptDeleteHidden: boolean = true;
  isReceiptUpdateHidden: boolean = true;
  isReceiptCancelHidden: boolean = true;
  productDescription!: string;
  subCategoryCodesSearchHolder!: AssetSubCategoryMasterModel[];
  modelCodesSearchHolder!: BrandModelMasterModel[];
  viewMode: boolean = false;
   
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private receiptMasterService: ReceiptMasterService,
    private supplierMasterService: SupplierMasterService,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private brandMasterService: BrandmasterService,
    private brandModelMasterService: BrandmodelmasterService,
    private commonValueListMasterService: CommonValueListService,
    private productMasterService: ProductMasterService,
    private saveAlert: SaveAlert) { 
      
      this.receiptMasterForm = this.formBuilder.group({
      supplierSelCode: [null, Validators.required],
      ReceiptAgainst: [null, Validators.required],
      ReceiptDate: [null],
      DocumentDate: [null],
      DocumentNo: [null, Validators.required],
      AssetSelCode: [null],
      EnterQty: [null],
      SupPartNumber: [null],
      PurchasePrice: [null],
      BrandSelCode: [null],
      ModelSelCode: [null],
      assetStatusSelCode: [null],
      assetConditionSelCode: [null],
      ReceiptDocDetailsDiv: [null]
    });
  }

  async ngOnInit() {
    this.rowReceiptData = [];
    this.columnReceiptDefs = [
      { field: 'productId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'productDesc', sortable: true, filter: true, width: 150 },
      { headerName: 'Product Code', field: 'assetCode', sortable: true, filter: true, width: 150 },
      { headerName: 'Product Name', field: 'assetName', sortable: true, filter: true, width: 160 },
      { field: 'quantity', sortable: true, filter: true, width: 120 },
      { headerName: 'Supp Part No', field: 'manufacturePartNo', sortable: true, filter: true, width: 150 },
      { field: 'purchasePrice', sortable: true, filter: true, width: 160 },
      //{ field: 'assetCategoryId', sortable: true, filter: true, hide: true },
      //{ headerName: 'Category Code',  field: 'assetCategoryCode', sortable: true, filter: true },
      //{ headerName: 'Category Name', field: 'assetCategoryName', sortable: true, filter: true },
      //{ field: 'assetSubCategoryId', sortable: true, filter: true, hide: true },
      //{ headerName: 'Sub Category Code', field: 'assetSubCategoryCode', sortable: true, filter: true },
      //{ headerName: 'Sub Category Name', field: 'assetSubCategoryName', sortable: true, filter: true },
      { field: 'brandId', sortable: true, filter: true, hide: true, width: 150 },
      //{ field: 'brandCode', sortable: true, filter: true },
      { field: 'brandName', sortable: true, filter: true, width: 150 },
      { field: 'modelId', sortable: true, filter: true, hide: true, width: 150 },
      //{ field: 'modelCode', sortable: true, filter: true },
      { field: 'modelName', sortable: true, filter: true, width: 150 },
      { field: 'assetStatus', sortable: true, filter: true, width: 150 },
      //{ headerName: 'Status Value', field: 'assetStatusValue', sortable: true, filter: true },
      //{ headerName: 'Status Text', field: 'assetStatusDisplayText', sortable: true, filter: true },
      { field: 'assetCondition', sortable: true, filter: true, width: 160 },
      //{ headerName: 'Condition Value', field: 'assetConditionValue', sortable: true, filter: true },
      //{ headerName: 'Condition Text', field: 'assetConditionDisplayText', sortable: true, filter: true },

    ];

    this.SetDropDownValueOnChange();

    this.SetDatePickerInitValue(); 

    //Get Drop Down Items
    await this.GetDropDownInitValues();

    this.route.params.subscribe(params => {
        if(params['id'] != undefined) {
          this.receiptId = params['id'];
          this.editMode = true;
          this.receiptData = this.receiptMasterService.getReceiptMasterByKey(this.receiptId) as ReceiptMasterModel;
          if (this.receiptData.receiptStatus == 50) {
            alert('Receipt is Approved cannot edit it!!');
            this.ShowGrid();
          }
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
  }

  private async GetDropDownInitValues() {
    this.productCodes = await this.productMasterService.getProductMaster();
    this.suppCodes = await this.supplierMasterService.getSupplierMaster();
    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.brandCodes = await this.brandMasterService.getBrandMaster();
    this.modelCodes = await this.brandModelMasterService.getBrandmodelMaster();
    this.assetStatusCodes = await this.commonValueListMasterService.getAssetStatusItems();
    this.assetConditionCodes = await this.commonValueListMasterService.getAssetConditionItems();
    this.modelCodesSearchHolder = this.modelCodes;
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

    $('[name="#RecpDate"]').on("change", () => {
      this.receiptMasterFormControls.RecpDate.setValue($('[name="RecpDate"]').val());
    });

    $('[name="DocDate"]').on("change", () => {
      this.receiptMasterFormControls.DocDate.setValue($('[name="DocDate"]').val());
    });

    $("#ReceiptDate .datetimepicker-input").val(datepart); // Assign the value
    $("#ReceiptDate .datetimepicker-input").trigger("click"); // Trigger click

    $("#DocumentDate .datetimepicker-input").val(datepart); // Assign the value
    $("#DocumentDate .datetimepicker-input").trigger("click");
  }

  private SetDropDownValueOnChange() {
    $('.select2bs4').select2();

    

    $('[name="supplierSelCode"]').on("change", () => {
      this.receiptMasterFormControls.supplierSelCode.setValue($('[name="supplierSelCode"]').val());
    });

    $('[name="supplierSelCode"]').on("change", () => {
      this.receiptMasterFormControls.supplierSelCode.setValue($('[name="supplierSelCode"]').val());
    });

    // $('[name="ProductSelDesc"]').on("change", () => {
    //   this.receiptMasterFormControls.ProductSelDesc.setValue($('[name="ProductSelDesc"]').val());
    // });

    $('[name="AssetSelCode"]').on("change", () => {
      this.receiptMasterFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      if($('[name="AssetSelCode"]').val() > 0) {
        this.productDescription = this.productCodes.find(item => item.productId == this.receiptMasterFormControls.AssetSelCode.value)?.productDescription as string;
      }
    });

    $('[name="BrandSelCode"]').on("change", () => {
      this.receiptMasterFormControls.BrandSelCode.setValue($('[name="BrandSelCode"]').val());
      this.modelCodes = this.modelCodesSearchHolder.filter(item => item.brandID == $('[name="BrandSelCode"]').val());
    });

    $('[name="ModelSelCode"]').on("change", () => {
      this.receiptMasterFormControls.ModelSelCode.setValue($('[name="ModelSelCode"]').val());
    });

    $('[name="assetStatusSelCode"]').on("change", () => {
      this.receiptMasterFormControls.assetStatusSelCode.setValue($('[name="assetStatusSelCode"]').val());
    });

    $('[name="assetStatusSelCode"]').on("change", () => {
      this.receiptMasterFormControls.assetStatusSelCode.setValue($('[name="assetStatusSelCode"]').val());
    });

    $('[name="assetConditionSelCode"]').on("change", () => {
      this.receiptMasterFormControls.assetConditionSelCode.setValue($('[name="assetConditionSelCode"]').val());
    });
  }

  get receiptMasterFormControls() { return this.receiptMasterForm.controls; }

  // ngViewInit() {
  //   const today = new Date();
  //   const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  //   this.receiptMasterFormControls.ReceiptDate.setValue(datepart);
  // }

  AddToReceiptGrid() {
    this.SetValidatorsForGridAddControls();

    this.submitted = true;
    
    this.errorReceipt = '';
    if (this.receiptMasterForm.invalid)
      return;

    this.error = '';
    const hasSameProduct = this.rowReceiptData.some(x =>  x.assetCode ==  this.productCodes.filter(x => x.productId == this.receiptMasterFormControls.AssetSelCode.value)[0].productCode);
    
    if (hasSameProduct) {
      this.errorReceipt = 'Same record with Product code already exists!';
      return;
    }
  
    this.UpdateReceiptItemLine();
    this.rowReceiptData.push(this.receiptItemsLine);
    this.UpdateReceiptSubGridRows();
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
    this.submitted = false;
  }

  private SetValidatorsForGridAddControls() {
    this.receiptMasterFormControls.AssetSelCode.setValidators([Validators.required]);
    this.receiptMasterFormControls.EnterQty.setValidators([Validators.required]);
    //this.receiptMasterFormControls.SupPartNumber.setValidators([Validators.required]);
    this.receiptMasterFormControls.PurchasePrice.setValidators([Validators.required]);
    //this.receiptMasterFormControls.BrandSelCode.setValidators([Validators.required]);
    //this.receiptMasterFormControls.ModelSelCode.setValidators([Validators.required]);
    //this.receiptMasterFormControls.assetStatusSelCode.setValidators([Validators.required]);
    //this.receiptMasterFormControls.assetConditionSelCode.setValidators([Validators.required]);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateValiditityForGridAddControls() {
    this.receiptMasterFormControls.AssetSelCode.updateValueAndValidity();
    this.receiptMasterFormControls.EnterQty.updateValueAndValidity();
    //this.receiptMasterFormControls.SupPartNumber.updateValueAndValidity();
    this.receiptMasterFormControls.PurchasePrice.updateValueAndValidity();
    //this.receiptMasterFormControls.BrandSelCode.updateValueAndValidity();
    //this.receiptMasterFormControls.ModelSelCode.updateValueAndValidity();
    //this.receiptMasterFormControls.assetStatusSelCode.updateValueAndValidity();
    //this.receiptMasterFormControls.assetConditionSelCode.updateValueAndValidity();
  }

  private DisableValidatorsForGridAddControls() {
    this.receiptMasterFormControls.AssetSelCode.setValidators(null);
    this.receiptMasterFormControls.EnterQty.setValidators(null);
    //this.receiptMasterFormControls.SupPartNumber.setValidators(null);
    this.receiptMasterFormControls.PurchasePrice.setValidators(null);
    //this.receiptMasterFormControls.BrandSelCode.setValidators(null);
    //this.receiptMasterFormControls.ModelSelCode.setValidators(null);
    //this.receiptMasterFormControls.assetStatusSelCode.setValidators(null);
    //this.receiptMasterFormControls.assetConditionSelCode.setValidators(null);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateReceiptSubGridRows() {
    this.agGrid.api.setRowData(this.rowReceiptData);
    this.agGrid.api.redrawRows();
  }

  private UpdateReceiptItemLine() {
    this.receiptItemsLine = new ReceiptItemsLine();
    this.receiptItemsLine.productId = this.receiptMasterFormControls.AssetSelCode.value;
    this.receiptItemsLine.assetProductId = this.receiptMasterFormControls.AssetSelCode.value;
    this.receiptItemsLine.productDesc = this.productCodes.filter(x => x.productId == this.receiptMasterFormControls.AssetSelCode.value)[0].productDescription;
    this.receiptItemsLine.assetCode = this.productCodes.filter(x => x.productId == this.receiptMasterFormControls.AssetSelCode.value)[0].productCode;
    this.receiptItemsLine.assetName = this.productCodes.filter(x => x.productId == this.receiptMasterFormControls.AssetSelCode.value)[0].productName;
    this.receiptItemsLine.quantity = this.receiptMasterFormControls.EnterQty.value;
    this.receiptItemsLine.manufacturePartNo = this.receiptMasterFormControls.SupPartNumber.value;
    this.receiptItemsLine.purchasePrice = this.receiptMasterFormControls.PurchasePrice.value;
    this.receiptItemsLine.brandId = this.receiptMasterFormControls.BrandSelCode.value;
    this.receiptItemsLine.brandCode = this.receiptMasterFormControls.BrandSelCode.value ? this.brandCodes.filter(x => x.brandID == this.receiptMasterFormControls.BrandSelCode.value)[0].brandCode : '';
    this.receiptItemsLine.brandName = this.receiptMasterFormControls.BrandSelCode.value ? this.brandCodes.filter(x => x.brandID == this.receiptMasterFormControls.BrandSelCode.value)[0].brandName : '';
    this.receiptItemsLine.modelId = this.receiptMasterFormControls.ModelSelCode.value;
    this.receiptItemsLine.modelCode = this.receiptMasterFormControls.ModelSelCode.value ? this.modelCodes.filter(x => x.modelID == this.receiptMasterFormControls.ModelSelCode.value)[0].modelCode : '';
    this.receiptItemsLine.modelName = this.receiptMasterFormControls.ModelSelCode.value ? this.modelCodes.filter(x => x.modelID == this.receiptMasterFormControls.ModelSelCode.value)[0].modelName : '';
    this.receiptItemsLine.assetStatusId = this.receiptMasterFormControls.assetStatusSelCode.value;
    //this.receiptItemsLine.assetStatusValue = this.assetStatusCodes.filter(x => x.value == this.receiptMasterFormControls.assetStatusSelCode.value)[0].value;
    //this.receiptItemsLine.assetStatusDisplayText = this.assetStatusCodes.filter(x => x.value == this.receiptMasterFormControls.assetStatusSelCode.value)[0].displayText;
    this.receiptItemsLine.assetConditionId = this.receiptMasterFormControls.assetConditionSelCode.value;
    //this.receiptItemsLine.assetConditionValue = this.assetConditionCodes.filter(x => x.value == this.receiptMasterFormControls.assetConditionSelCode.value)[0].value;
    //this.receiptItemsLine.assetConditionDisplayText = this.assetConditionCodes.filter(x => x.value == this.receiptMasterFormControls.assetConditionSelCode.value)[0].displayText;
    this.ClearAssetLineItemsControlsOnAdd();
    this.submitted = false;
  }

  EditAssetReceipt() {
    this.receiptItemsLine = this.agGrid.api.getSelectedRows()[0];
    this.productDescription = this.productCodes.find(item => item.productId == this.receiptItemsLine.assetProductId)?.productDescription as string;
    this.receiptMasterFormControls.AssetSelCode.setValue(this.receiptItemsLine.productId);
    this.receiptMasterFormControls.EnterQty.setValue(this.receiptItemsLine.quantity);
    this.receiptMasterFormControls.SupPartNumber.setValue(this.receiptItemsLine.manufacturePartNo);
    this.receiptMasterFormControls.PurchasePrice.setValue(this.receiptItemsLine.purchasePrice);
    this.receiptMasterFormControls.BrandSelCode.setValue(this.receiptItemsLine.brandId);
    this.receiptMasterFormControls.assetStatusSelCode.setValue(this.receiptItemsLine.assetStatusId);
    this.receiptMasterFormControls.assetConditionSelCode.setValue(this.receiptItemsLine.assetConditionId);
    $('select').select2().trigger('change');
    this.receiptMasterFormControls.ModelSelCode.setValue(this.receiptItemsLine.modelId);
    $('select').select2().trigger('change');
    this.isReceiptAddHidden = true;
    this.isReceiptDeleteHidden = true;
    this.isReceiptEditHidden = true;
    this.isReceiptUpdateHidden = false;
    this.isReceiptCancelHidden = false;
  }

  DeleteAssetReceipt() {
    this.receiptItemsLine = this.agGrid.api.getSelectedRows()[0];
    const index = this.rowReceiptData.findIndex(x => x.productId == this.receiptItemsLine.productId && x.assetProductId == this.receiptItemsLine.assetProductId);
    if (index > -1)
    {
      this.rowReceiptData.splice(index, 1);
      this.agGrid.api.setRowData(this.rowReceiptData);
      this.agGrid.api.redrawRows();
    }
  }

  onReceiptRowClick(event: any) {
    
      this.isReceiptEditHidden = !this.isReceiptUpdateHidden || this.viewMode;
      this.isReceiptDeleteHidden = !this.isReceiptUpdateHidden || this.viewMode;
    
  }

  ClearAssetLineItemsControlsOnAdd() {
    this.productDescription = '';
    this.receiptMasterFormControls.AssetSelCode.setValue('');
    this.receiptMasterFormControls.EnterQty.setValue('');
    this.receiptMasterFormControls.SupPartNumber.setValue('');
    this.receiptMasterFormControls.PurchasePrice.setValue('');
    this.receiptMasterFormControls.BrandSelCode.setValue('');
    this.receiptMasterFormControls.ModelSelCode.setValue('');
    this.receiptMasterFormControls.assetStatusSelCode.setValue('');
    this.receiptMasterFormControls.assetConditionSelCode.setValue('');
    $('select').select2().trigger('change');
  }

  UpdateAssetReceipt() {
    this.SetValidatorsForGridAddControls();
    this.submitted = true;
    this.errorReceipt = '';
    if (this.receiptMasterForm.invalid)
      return;

    this.UpdateReceiptItemLine();

    // const hasSameProduct = this.rowReceiptData.some(x => x.productId == this.receiptMasterFormControls.ProductSelDesc.value &&
    //   x.assetCode ==  this.receiptItemsLine.assetCode);
    
    // if (hasSameProduct) {
    //   this.errorReceipt = 'Same record with Product and Asset Code already exists!';
    //   return;
    // }
    const index = this.rowReceiptData.findIndex(x => x.productId == this.receiptItemsLine.productId);
    
    if (index > -1)
    {
      this.rowReceiptData[index] = this.receiptItemsLine;
    }
    this.UpdateReceiptSubGridRows();
    this.isReceiptAddHidden = false;
    this.isReceiptDeleteHidden = true;
    this.isReceiptEditHidden = true;
    this.isReceiptUpdateHidden = true;
    this.isReceiptCancelHidden = true;
    this.DisableValidatorsForGridAddControls();
  }

  CancelAssetReceipt() {
    this.isReceiptAddHidden = false;
    this.isReceiptDeleteHidden = true;
    this.isReceiptEditHidden = true;
    this.isReceiptUpdateHidden = true;
    this.isReceiptCancelHidden = true;
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
  }

  ShowGrid(){
    this.router.navigateByUrl('/receipt');
  }

  disableControls() {
    this.receiptMasterFormControls.ReceiptAgainst.disable();
    this.receiptMasterFormControls.DocumentNo.disable();
    this.receiptMasterFormControls.DocumentDate.disable();
    this.receiptMasterFormControls.ReceiptDate.disable();
    this.receiptMasterFormControls.supplierSelCode.disable();
    $("#ReceiptDate .datetimepicker-input").attr('disabled', true); 
    $("#DocumentDate .datetimepicker-input").attr('disabled', true);
    this.isbtnSaveDisabled = this.viewMode;
    this.isbtnClearDisabled = this.viewMode;
    this.isReceiptDeleteHidden = true;
    this.isReceiptAddHidden = true;
    this.isReceiptEditHidden = true;
    this.isReceiptUpdateHidden = true;
    this.isReceiptCancelHidden = true;
  }

  ClearContents() {
    this.receiptId = '';
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
   
    this.receiptMasterFormControls.ReceiptAgainst.setValue('');
    this.receiptMasterFormControls.DocumentNo.setValue('');
     $("#ReceiptDate .datetimepicker-input").val(datepart); 
     $("#DocumentDate .datetimepicker-input").val(datepart);
    this.receiptMasterFormControls.supplierSelCode.setValue('');
    this.rowReceiptData = [];
    this.UpdateReceiptSubGridRows();
    $('select').select2().trigger('change');
    
  }

  ShowEditViewReceiptMaster(data: ReceiptMasterModel) {
    this.receiptMasterFormControls.ReceiptAgainst.setValue(data.refDocumentType);
    this.receiptMasterFormControls.DocumentNo.setValue(data.refDocumentNo);
    $("#ReceiptDate .datetimepicker-input").val(formatDate(data.receiptDate, 'MM/dd/yyyy', 'en-US')); 
    $("#DocumentDate .datetimepicker-input").val(formatDate(data.refDocumentDate, 'MM/dd/yyyy', 'en-US'));
    this.receiptMasterFormControls.supplierSelCode.setValue(data.supplierId);
    this.rowReceiptData = data.itemLines;
    this.UpdateReceiptSubGridRows();
    this.disableControls();
  }

  SaveReceiptMaster(){
    this.DisableValidatorsForGridAddControls();
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.receiptMasterForm.invalid ) {
      return;
    }
    if(!(this.rowReceiptData.length > 0)){
      this.error = 'Please add receipt line items';
      return;
    }
      let saveResponse: Observable<any>;
      this.loading = true;
      this.receiptmastermodel = new ReceiptMasterModel;
      this.receiptmastermodel.receiptId = this.receiptId;
      this.receiptmastermodel.refDocumentType = this.receiptMasterFormControls.ReceiptAgainst.value;
      this.receiptmastermodel.refDocumentNo = this.receiptMasterFormControls.DocumentNo.value;
      this.receiptmastermodel.refDocumentDate = $('#DocumentDate .datetimepicker-input').val();
      this.receiptmastermodel.receiptDate = $('#ReceiptDate .datetimepicker-input').val();
      this.receiptmastermodel.supplierId = this.receiptMasterFormControls.supplierSelCode.value;
      this.receiptmastermodel.itemLines = this.rowReceiptData;

      if(this.editMode){
       saveResponse = this.receiptMasterService.editReceiptmaster(this.receiptmastermodel);
      } else {
        saveResponse = this.receiptMasterService.addReceiptmaster(this.receiptmastermodel);
    }

    
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.receiptmastermodel.receiptId = result.receiptId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.receiptMasterService.AddOrEditRecordToCache(this.receiptmastermodel, this.editMode);
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

