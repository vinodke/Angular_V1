import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { bankmasterservice } from '../../../../core/service/bankmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { BankMasterModel } from '../../../../shared/model/BankMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-bankmasterform',
  templateUrl: './bankmasterform.component.html',
  styleUrls: ['./bankmasterform.component.scss']
})
export class BankmasterformComponent implements OnInit {

  bankMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  bankId!: number;
  error = '';
  editMode: boolean = false;
  bankData!: BankMasterModel;
  bankMasterModel: BankMasterModel = new BankMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private bankMasterService: bankmasterservice) { 
      this.bankMasterForm = this.formBuilder.group({
        BankName: ['', Validators.required],
        AccountNumber: ['', Validators.required],
        AccountHolderName: ['', Validators.required],
        BranchName: ['', Validators.required],
        Address1: ['', Validators.required],
        Address2: [null]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.bankId =  params['id'];
        this.editMode = true;
        this.bankData = this.bankMasterService.getBankMasterByKey(this.bankId) as BankMasterModel;
        this.ShowEditViewbankMaster(this.bankData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get bankMasterFormControls() { return this.bankMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/bankmaster');
  }

  disableControls() {
    this.bankMasterFormControls.BankName.disable();
    this.bankMasterFormControls.AccountNumber.disable();
    this.bankMasterFormControls.AccountHolderName.disable();
    this.bankMasterFormControls.BranchName.disable();
    this.bankMasterFormControls.Address1.disable();
    this.bankMasterFormControls.Address2.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.bankId = 0;
    this.bankMasterFormControls.BankName.setValue(null);
    this.bankMasterFormControls.AccountNumber.setValue(null);
    this.bankMasterFormControls.AccountHolderName.setValue(null);
    this.bankMasterFormControls.BranchName.setValue(null);
    this.bankMasterFormControls.Address1.setValue(null);
    this.bankMasterFormControls.Address2.setValue(null);
  }

  ShowEditViewbankMaster(data: BankMasterModel) {
    this.bankMasterFormControls.BankName.setValue(data.bankName);
    this.bankMasterFormControls.AccountNumber.setValue(data.accountNumber);
    this.bankMasterFormControls.AccountHolderName.setValue(data.accountHolderName);
    this.bankMasterFormControls.BranchName.setValue(data.branchName);
    this.bankMasterFormControls.Address1.setValue(data.address1);
    this.bankMasterFormControls.Address2.setValue(data.address2);
    this.bankMasterFormControls.BankName.disable();
  }

  SaveBankMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.bankMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.bankMasterModel=new BankMasterModel;
    this.bankMasterModel.id=this.bankId
    this.bankMasterModel.bankName = this.bankMasterFormControls.BankName.value;
    this.bankMasterModel.accountNumber = this.bankMasterFormControls.AccountNumber.value;
    this.bankMasterModel.accountHolderName = this.bankMasterFormControls.AccountHolderName.value;
    this.bankMasterModel.branchName = this.bankMasterFormControls.BranchName.value;
    this.bankMasterModel.address1 = this.bankMasterFormControls.Address1.value;
    this.bankMasterModel.address2 = this.bankMasterFormControls.Address2.value;
    
    if(this.editMode){
     saveResponse = this.bankMasterService.editBankMaster(this.bankMasterModel);
    } else {
      saveResponse = this.bankMasterService.addBankmaster(this.bankMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.bankMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.bankMasterService.AddOrEditRecordToCache(this.bankMasterModel, this.editMode);
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
