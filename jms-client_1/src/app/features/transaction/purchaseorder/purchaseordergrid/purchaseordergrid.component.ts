import { formatDate } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { purchaseorderService } from '../../../../core/service/purchaseorder.service';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { documentStatus } from '../../../../shared/interface/documentStatus';
import { PurchaseOrderDTModel } from '../../../../shared/model/PurchaseOrderDTModel';
import { PurchaseOrderModel } from '../../../../shared/model/PurchaseOrderModel';
import { SupplierMasterModel } from '../../../../shared/model/SupplierMasterModel';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'org-fat-purchaseordergrid',
  templateUrl: './purchaseordergrid.component.html',
  styleUrls: ['./purchaseordergrid.component.scss']
})
export class PurchaseordergridComponent implements OnInit {

  @ViewChild('agGrid') agGrid!: AgGridAngular;
  purchaseOrderEditForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnGridClick: boolean = true;
  isbtnforApproveClick: boolean = true;
  poNumber!: string;
  error = '';
  errorPO = '';
  editMode: boolean = false;
  poData!: PurchaseOrderModel[];
  purchaseOrderModel: PurchaseOrderModel = new PurchaseOrderModel;
  documentstatus:documentStatus=new documentStatus;
  rowpoViewData!: PurchaseOrderDTModel[];
  columnPOViewDefs: any;
  suppCodes!: SupplierMasterModel[];
  poItemsLine!: PurchaseOrderDTModel;
  poDataModel!:PurchaseOrderModel;
  viewMode: boolean = false;
  headerText!:string;
  isApproveUrl:boolean=false;
   
  constructor(@Inject(LOCALE_ID) private locale: string, private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private poService: purchaseorderService,
    private supplierMasterService: SupplierMasterService,
    private saveAlert: SaveAlert) { 
      
      this.purchaseOrderEditForm = this.formBuilder.group({
      supplierSelCode: [null],
      FromDate: [null],
      ToDate: [null],
      PoNumber:[null]
    });
  }

  

  async ngOnInit() {
    this.poData = [];
    this.columnPOViewDefs = [
      { headerName:'PO Number', field: 'poNumber', sortable: true, filter: true, resizable: true,width:250 },
      { headerName:'PO Date', field: 'poDate',  sortable: true, filter: true, resizable: true,width:250,
      cellRenderer: (data:any) => {
        return  formatDate(data.value, 'MM/dd/yyyy',this.locale);
     }},
      { headerName:'Supplier', field: 'supplierName', sortable: true, filter: true, resizable: true,width:400 }
      ,{ headerName:'Remarks', field: 'remarks', sortable: true, filter: true, resizable: true,width:400 }
     ];
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
      if(rturl.toString()=="purchaseorderapprove")
      {
      this.headerText='Approve Purchase Order';
      this.isApproveUrl=true;
      }
      else
      {
      this.isApproveUrl=false;
      this.headerText='Edit Purchase Order';
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
    this.poDataModel=new PurchaseOrderModel;
    this.poDataModel = this.agGrid.api.getSelectedRows()[0];
    if(this.poDataModel==null)
    {
      this.errorPO='Please select any row';
      return;
    }
    this.router.navigate(['purchaseorderapprove/approve', this.poDataModel.poNumber]);
  }

  ViewEditScreen()
  {
    this.poDataModel=new PurchaseOrderModel;
    this.poDataModel = this.agGrid.api.getSelectedRows()[0];
    if(this.poDataModel==null)
    {
      this.errorPO='Please select any row';
      return;
    }
    this.router.navigate(['purchaseorder/edit', this.poDataModel.poNumber]);
  }

  NewPOEntry()
  {
    this.router.navigateByUrl('/purchaseorder');
  }
  ClearPOView()
  {
    this.isbtnGridClick=true;
    this.poData=[];
    const today = new Date();
    const datepart = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
   
     $("#FromDate .datetimepicker-input").val(''); 
     $("#ToDate .datetimepicker-input").val(''); 
    this.purchaseOrderEditFormControls.supplierSelCode.setValue('');
    this.purchaseOrderEditFormControls.PoNumber.setValue('');
    $('select').select2().trigger('change');
  }
  private async GetDropDownInitValues() {
    this.suppCodes = await this.supplierMasterService.getSupplierMaster();
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
      this.purchaseOrderEditFormControls.FromDate.setValue($('[name="FrmDate"]').val());
    });
    $('[name="TDate"]').on("change", () => {
      this.purchaseOrderEditFormControls.ToDate.setValue($('[name="TDate"]').val());
    });

    $("#FromDate .datetimepicker-input").val(''); // Assign the value
    $("#FromDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#ToDate .datetimepicker-input").val(''); // Assign the value
    $("#ToDate .datetimepicker-input").trigger("click"); // Trigger click
  }

  private SetDropDownValueOnChange() {
    $('.select2bs4').select2();

    $('[name="supplierSelCode"]').on("change", () => {
      this.purchaseOrderEditFormControls.supplierSelCode.setValue($('[name="supplierSelCode"]').val());
    });

    }

  get purchaseOrderEditFormControls() { return this.purchaseOrderEditForm.controls; }

  // ngViewInit() {
  //   const today = new Date();
  //   const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  //   this.purchaseOrderEditFormControls.ReceiptDate.setValue(datepart);
  // }

  async ViewContents() {
    this.loading=true;
    this.purchaseOrderEditFormControls.FromDate.setValidators(null);
    this.purchaseOrderEditFormControls.ToDate.setValidators(null);
    this.purchaseOrderEditFormControls.FromDate.updateValueAndValidity();
    this.purchaseOrderEditFormControls.ToDate.updateValueAndValidity();
    if(this.purchaseOrderEditFormControls.PoNumber.value==null || this.purchaseOrderEditFormControls.PoNumber.value=="")
    {
if($('#FromDate .datetimepicker-input').val()==null || $('#FromDate .datetimepicker-input').val()=="")
{
      this.purchaseOrderEditFormControls.FromDate.setValidators([Validators.required]);
      this.purchaseOrderEditFormControls.FromDate.updateValueAndValidity();
}
if($('#ToDate .datetimepicker-input').val()==null || $('#ToDate .datetimepicker-input').val()=="")
{
  this.purchaseOrderEditFormControls.ToDate.setValidators([Validators.required]);
  this.purchaseOrderEditFormControls.ToDate.updateValueAndValidity();
}
     
    }
    this.submitted=true;
    if (this.purchaseOrderEditForm.invalid)
    {
      this.loading=false;
    return;
    }
    this.poDataModel=new PurchaseOrderModel;
    this.poDataModel.toDate=$('#ToDate .datetimepicker-input').val();
    this.poDataModel.fromDate=$('#FromDate .datetimepicker-input').val();
    this.poDataModel.supplierID= this.purchaseOrderEditFormControls.supplierSelCode.value;
    this.poDataModel.poNumber=this.purchaseOrderEditFormControls.PoNumber.value;
    this.poDataModel.status=this.documentstatus.new;
     this.poData= (await this.poService.getViewPurchaseMaster(this.poDataModel))
    this.purchaseOrderEditFormControls.FromDate.setValidators(null);
      this.purchaseOrderEditFormControls.ToDate.setValidators(null);
      this.purchaseOrderEditFormControls.FromDate.updateValueAndValidity();
      this.purchaseOrderEditFormControls.ToDate.updateValueAndValidity();
      this.submitted=false;
      this.loading=false;
  }


}
