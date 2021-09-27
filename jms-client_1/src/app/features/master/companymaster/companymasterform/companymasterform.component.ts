import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { companymasterservice } from '../../../../core/service/companymaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { CompanyMasterModel } from '../../../../shared/model/CompanyMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-companymasterform',
  templateUrl: './companymasterform.component.html',
  styleUrls: ['./companymasterform.component.scss']
})
export class CompanymasterformComponent implements OnInit {

  companyMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  companyName!: string;
  error = '';
  editMode: boolean = false;
  companyData!: CompanyMasterModel;
  companyMasterModel: CompanyMasterModel = new CompanyMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private companyMasterService: companymasterservice) { 
      this.companyMasterForm = this.formBuilder.group({
        CompanyCode: ['', Validators.required],
        CompanyName: ['', Validators.required],
        ContactNumber: ['', Validators.required],
        ContactEmail: ['', Validators.required],
        Address1: ['', Validators.required],
        Address2: [null],
        City: [null],
        State: [null],
        Country: [null],
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.companyName =  params['id'];
        this.editMode = true;
        this.companyData = this.companyMasterService.getCompanyMasterByKey(this.companyName) as CompanyMasterModel;
        this.ShowEditViewCompanyMaster(this.companyData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get companyMasterFormControls() { return this.companyMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/companymaster');
  }

  disableControls() {
    this.companyMasterFormControls.CompanyCode.disable();
    this.companyMasterFormControls.CompanyName.disable();
    this.companyMasterFormControls.Address1.disable();
    this.companyMasterFormControls.Address2.disable();
    this.companyMasterFormControls.City.disable();
    this.companyMasterFormControls.State.disable();
    this.companyMasterFormControls.Country.disable();
    this.companyMasterFormControls.ContactNumber.disable();
    this.companyMasterFormControls.ContactEmail.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.companyName = '';
    this.companyMasterFormControls.CompanyCode.setValue(null);
    this.companyMasterFormControls.CompanyName.setValue(null);
    this.companyMasterFormControls.Address1.setValue(null);
    this.companyMasterFormControls.Address2.setValue(null);
    this.companyMasterFormControls.City.setValue(null);
    this.companyMasterFormControls.State.setValue(null);
    this.companyMasterFormControls.Country.setValue(null);
    this.companyMasterFormControls.ContactNumber.setValue(null);
    this.companyMasterFormControls.ContactEmail.setValue(null);
  }

  ShowEditViewCompanyMaster(data: CompanyMasterModel) {
    this.companyMasterFormControls.CompanyCode.setValue(data.companyCode);
    this.companyMasterFormControls.CompanyName.setValue(data.companyName);
    this.companyMasterFormControls.Address1.setValue(data.address1);
    this.companyMasterFormControls.Address2.setValue(data.address2);
    this.companyMasterFormControls.City.setValue(data.city);
    this.companyMasterFormControls.State.setValue(data.state);
    this.companyMasterFormControls.Country.setValue(data.country);
    this.companyMasterFormControls.ContactNumber.setValue(data.contactNumber);
    this.companyMasterFormControls.ContactEmail.setValue(data.contactEmail);
    this.companyMasterFormControls.CompanyCode.disable();
  }

  SaveCompanyMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.companyMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.companyMasterModel=new CompanyMasterModel;
    this.companyMasterModel.companyCode = this.companyMasterFormControls.CompanyCode.value;
    this.companyMasterModel.companyName = this.companyMasterFormControls.CompanyName.value;
    this.companyMasterModel.address1 = this.companyMasterFormControls.Address1.value;
    this.companyMasterModel.address2 = this.companyMasterFormControls.Address2.value;
    this.companyMasterModel.city = this.companyMasterFormControls.City.value;
    this.companyMasterModel.state = this.companyMasterFormControls.State.value;
    this.companyMasterModel.country = this.companyMasterFormControls.Country.value;
    this.companyMasterModel.contactEmail = this.companyMasterFormControls.ContactEmail.value;
    this.companyMasterModel.contactNumber = this.companyMasterFormControls.ContactNumber.value;
    
    if(this.editMode){
     saveResponse = this.companyMasterService.editCompanyMaster(this.companyMasterModel);
    } else {
      saveResponse = this.companyMasterService.addCompanymaster(this.companyMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.companyMasterModel.companyName = result.companyName;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.companyMasterService.AddOrEditRecordToCache(this.companyMasterModel, this.editMode);
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
