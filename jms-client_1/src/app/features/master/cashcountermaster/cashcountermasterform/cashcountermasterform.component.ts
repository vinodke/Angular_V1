import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cashcountermasterservice } from '../../../../core/service/cashcountermaster.service';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { CashCounterMasterModel } from '../../../../shared/model/CashCounterMasterModel';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-cashcountermasterform',
  templateUrl: './cashcountermasterform.component.html',
  styleUrls: ['./cashcountermasterform.component.scss']
})
export class CashcountermasterformComponent implements OnInit {

  warehouses: WarehouseMasterModel[] = [];
  cashCounterMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  cashCounterId!: number;
  error = '';
  editMode: boolean = false;
  cashCounterData!: CashCounterMasterModel;
  cashCounterMasterModel: CashCounterMasterModel = new CashCounterMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private warehouseMasterService: warehousemasterservice,
    private cashcountermasterservice: cashcountermasterservice) { 
      this.cashCounterMasterForm = this.formBuilder.group({
        warehouseSelCode: [null, Validators.required],
        CashCounterName: ['', Validators.required],
      });
    }

 async ngOnInit() {
  this.warehouses =  await this.warehouseMasterService.getWarehouseMaster();

    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.cashCounterId = +params['id'];
        this.editMode = true;
        this.cashCounterData = this.cashcountermasterservice.getCashCounterMasterByKey(this.cashCounterId) as CashCounterMasterModel;
        this.ShowEditViewCashCounterMaster(this.cashCounterData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  $('.select2bs4').select2();
  $('[name="warehouseSelCode"]').on("change",  () => {
   this.cashCounterMasterFormControls.warehouseSelCode.setValue($('[name="warehouseSelCode"]').val());
  });
  }

  get cashCounterMasterFormControls() { return this.cashCounterMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/cashcountermaster');
  }

  disableControls() {
    this.cashCounterMasterFormControls.warehouseSelCode.disable();
    this.cashCounterMasterFormControls.CashCounterName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.cashCounterId = 0;
    this.cashCounterMasterFormControls.warehouseSelCode.setValue(null);
    this.cashCounterMasterFormControls.CashCounterName.setValue(null);
    $('select').select2().trigger('change');
  }

  ShowEditViewCashCounterMaster(data: CashCounterMasterModel) {
    this.cashCounterMasterFormControls.warehouseSelCode.setValue(data.warehouseID);
    this.cashCounterMasterFormControls.CashCounterName.setValue(data.cashCounterName);
    //this.cashCounterMasterFormControls.CashCounterName.disable();
  }

  SaveCashCounterMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.cashCounterMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.cashCounterMasterModel=new CashCounterMasterModel;
    this.cashCounterMasterModel.id = this.cashCounterId;
    this.cashCounterMasterModel.warehouseID = this.cashCounterMasterFormControls.warehouseSelCode.value;
    this.cashCounterMasterModel.cashCounterName = this.cashCounterMasterFormControls.CashCounterName.value;
    const currentSite = this.warehouses.filter(item => item.id == this.cashCounterMasterModel.warehouseID)[0];
      this.cashCounterMasterModel.warehouseName = currentSite.warehouseName;
    if(this.editMode){
     saveResponse = this.cashcountermasterservice.editCashCounterMaster(this.cashCounterMasterModel);
    } else {
      saveResponse = this.cashcountermasterservice.addCashCountermaster(this.cashCounterMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.cashCounterMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.cashcountermasterservice.AddOrEditRecordToCache(this.cashCounterMasterModel, this.editMode);
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
