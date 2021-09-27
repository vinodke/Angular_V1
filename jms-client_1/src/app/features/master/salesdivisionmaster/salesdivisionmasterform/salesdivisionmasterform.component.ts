import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { salesdivisionmasterservice } from '../../../../core/service/salesdivisionmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { SalesDivisionMasterModel } from '../../../../shared/model/SalesDivisionMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-salesdivisionmasterform',
  templateUrl: './salesdivisionmasterform.component.html',
  styleUrls: ['./salesdivisionmasterform.component.scss']
})
export class SalesdivisionmasterformComponent implements OnInit {

  SalesDivisionMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  salesDivisionId!: number;
  error = '';
  editMode: boolean = false;
  salesDivisionData!: SalesDivisionMasterModel;
  salesDivisionMasterModel: SalesDivisionMasterModel = new SalesDivisionMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private salesDivisionMasterService: salesdivisionmasterservice) { 
      this.SalesDivisionMasterForm = this.formBuilder.group({
        SalesDivisionName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.salesDivisionId = +params['id'];
        this.editMode = true;
        this.salesDivisionData = this.salesDivisionMasterService.getSalesDivisionMasterByKey(this.salesDivisionId) as SalesDivisionMasterModel;
        this.ShowEditViewSalesDivisionMaster(this.salesDivisionData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get SalesDivisionMasterFormControls() { return this.SalesDivisionMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/salesdivisionmaster');
  }

  disableControls() {
    this.SalesDivisionMasterFormControls.SalesDivisionName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.salesDivisionId = 0;
    this.SalesDivisionMasterFormControls.SalesDivisionName.setValue(null);
  }

  ShowEditViewSalesDivisionMaster(data: SalesDivisionMasterModel) {
    this.SalesDivisionMasterFormControls.SalesDivisionName.setValue(data.salesDivisionName);
  }

  SaveSalesDivisionMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.SalesDivisionMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.salesDivisionMasterModel=new SalesDivisionMasterModel;
    this.salesDivisionMasterModel.id = this.salesDivisionId;
    this.salesDivisionMasterModel.salesDivisionName = this.SalesDivisionMasterFormControls.SalesDivisionName.value;
    
    if(this.editMode){
     saveResponse = this.salesDivisionMasterService.editSalesDivisionMaster(this.salesDivisionMasterModel);
    } else {
      saveResponse = this.salesDivisionMasterService.addSalesDivisionmaster(this.salesDivisionMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.salesDivisionMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.salesDivisionMasterService.AddOrEditRecordToCache(this.salesDivisionMasterModel, this.editMode);
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
