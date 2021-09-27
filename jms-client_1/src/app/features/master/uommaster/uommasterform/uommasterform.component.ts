import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { uommasterservice } from '../../../../core/service/uommaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { UOMMasterModel } from '../../../../shared/model/UOMMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-uommasterform',
  templateUrl: './uommasterform.component.html',
  styleUrls: ['./uommasterform.component.scss']
})
export class UommasterformComponent implements OnInit {

  UOMMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  UOMId!: number;
  error = '';
  editMode: boolean = false;
  UOMData!: UOMMasterModel;
  uomMasterModel: UOMMasterModel = new UOMMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private uomMasterService: uommasterservice) { 
      this.UOMMasterForm = this.formBuilder.group({
        UOMCode: ['', Validators.required],
        UOMName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.UOMId = +params['id'];
        this.editMode = true;
        this.UOMData = this.uomMasterService.getUOMMasterByKey(this.UOMId) as UOMMasterModel;
        this.ShowEditViewUOMMaster(this.UOMData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get UOMMasterFormControls() { return this.UOMMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/uommaster');
  }

  disableControls() {
    this.UOMMasterFormControls.UOMCode.disable();
    this.UOMMasterFormControls.UOMName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.UOMId = 0;
    this.UOMMasterFormControls.UOMCode.setValue(null);
    this.UOMMasterFormControls.UOMName.setValue(null);
  }

  ShowEditViewUOMMaster(data: UOMMasterModel) {
    this.UOMMasterFormControls.UOMCode.setValue(data.uomCode);
    this.UOMMasterFormControls.UOMName.setValue(data.uomName);
    this.UOMMasterFormControls.UOMCode.disable();
  }

  SaveUOMMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.UOMMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.uomMasterModel=new UOMMasterModel;
    this.uomMasterModel.id = this.UOMId;
    this.uomMasterModel.uomCode = this.UOMMasterFormControls.UOMCode.value;
    this.uomMasterModel.uomName = this.UOMMasterFormControls.UOMName.value;
    
    if(this.editMode){
     saveResponse = this.uomMasterService.editUOMMaster(this.uomMasterModel);
    } else {
      saveResponse = this.uomMasterService.addUOMmaster(this.uomMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.uomMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.uomMasterService.AddOrEditRecordToCache(this.uomMasterModel, this.editMode);
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
