import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { ModalService } from '../../../../core/_modal';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { PaymentMethodModel } from '../../../../shared/model/PaymentMethodModel';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { Observable } from 'rxjs';
import { paymentmethodService } from '../../../../core/service/paymentmethod.service';
declare var $: any;

@Component({
  selector: 'org-fat-paymentmethodform',
  templateUrl: './paymentmethodform.component.html',
  styleUrls: ['./paymentmethodform.component.scss']
})
export class PaymentmethodformComponent implements OnInit {

  warehouses: WarehouseMasterModel[] = [];
  paymentMethodForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  paymentMethodId!: number;
  error = '';
  editMode: boolean = false;
  paymentMethodData!: PaymentMethodModel;
paymentMethodModel: PaymentMethodModel = new PaymentMethodModel;
  @Input() routetype:boolean=false; 
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private paymentMethodService: paymentmethodService,
    private warehousemasterservice: warehousemasterservice,
    private modalService:ModalService) { 
      this.paymentMethodForm = this.formBuilder.group({
        WarehouseSelCode: [null, Validators.required],
        PaymentMethodName: [null, Validators.required],
        ReferenceNumber: [null],
        ReferenceURL: [''],
      });
    }

 async ngOnInit() {
  this.warehouses =  await this.warehousemasterservice.getWarehouseMaster();


    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.paymentMethodId = +params['id'];
        this.editMode = true;
        this.paymentMethodData = this.paymentMethodService.getPaymentMethodByKey(this.paymentMethodId) as PaymentMethodModel;
        this.ShowEditViewPaymentMethod(this.paymentMethodData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  $('.select2bs4').select2({
    theme: 'bootstrap4'
  });
  $('[name="WarehouseSelCode"]').on("change",  () => {
   this.paymentMethodFormControls.WarehouseSelCode.setValue($('[name="WarehouseSelCode"]').val());
  });
  }

  get paymentMethodFormControls() { return this.paymentMethodForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/paymentmethod');
  }

  closeModal() {
      this.modalService.close('custom-modal-2');
  }

  disableControls() {
    this.paymentMethodFormControls.WarehouseSelCode.disable();
    this.paymentMethodFormControls.PaymentMethodName.disable();
    this.paymentMethodFormControls.ReferenceNumber.disable();
    this.paymentMethodFormControls.ReferenceURL.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.paymentMethodId = 0;
    this.paymentMethodFormControls.WarehouseSelCode.setValue(null);
    this.paymentMethodFormControls.PaymentMethodName.setValue(null);
    this.paymentMethodFormControls.ReferenceNumber.setValue(null);
    this.paymentMethodFormControls.ReferenceURL.setValue(null);
    $('select').select2().trigger('change');
  }

  ShowEditViewPaymentMethod(data: PaymentMethodModel) {
    this.paymentMethodFormControls.CategorySelCode.setValue(data.warehouseID);
    this.paymentMethodFormControls.PaymentMethodName.setValue(data.paymentMethodName);
    this.paymentMethodFormControls.ReferenceNumber.setValue(data.referenceNumber);
    this.paymentMethodFormControls.ReferenceURL.setValue(data.referenceURL);
  }

  SavePaymentMethod(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.paymentMethodForm.invalid) {
    return;
}
    this.loading = true;
    this.paymentMethodModel=new PaymentMethodModel;
    this.paymentMethodModel.id = this.paymentMethodId;
    this.paymentMethodModel.warehouseID = this.paymentMethodFormControls.WarehouseSelCode.value;
    this.paymentMethodModel.warehouseCode = this.warehouses.filter(item=>item.id  == this.paymentMethodFormControls.WarehouseSelCode.value)[0].warehouseCode;
    this.paymentMethodModel.warehouseName = this.warehouses.filter(item=>item.id  == this.paymentMethodFormControls.WarehouseSelCode.value)[0].warehouseName;
    this.paymentMethodModel.paymentMethodName = this.paymentMethodFormControls.PaymentMethodName.value;
    this.paymentMethodModel.referenceNumber =this.paymentMethodFormControls.ReferenceNumber.value;
    this.paymentMethodModel.referenceURL = this.paymentMethodFormControls.ReferenceURL.value;
    if(this.editMode){
     saveResponse = this.paymentMethodService.editPaymentMethod(this.paymentMethodModel);
    } else {
      saveResponse = this.paymentMethodService.addPaymentMethod(this.paymentMethodModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.paymentMethodModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      console.log(this.paymentMethodModel);
      this.paymentMethodService.AddOrEditRecordToCache(this.paymentMethodModel, this.editMode);
      this.submitted = false;
      if(this.routetype==true)
      {
        this.closeModal();
      }
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
