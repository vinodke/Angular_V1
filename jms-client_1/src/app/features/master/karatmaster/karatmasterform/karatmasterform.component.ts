import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { karatmasterservice } from '../../../../core/service/karatmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { KaratMasterModel } from '../../../../shared/model/KaratMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-karatmasterform',
  templateUrl: './karatmasterform.component.html',
  styleUrls: ['./karatmasterform.component.scss']
})
export class KaratmasterformComponent implements OnInit {

  karatMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  karatId!: number;
  error = '';
  editMode: boolean = false;
  karatData!: KaratMasterModel;
  karatMasterModel: KaratMasterModel = new KaratMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private karatMasterService: karatmasterservice) { 
      this.karatMasterForm = this.formBuilder.group({
        KaratCode: ['', Validators.required],
        KaratName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.karatId = +params['id'];
        this.editMode = true;
        this.karatData = this.karatMasterService.getKaratMasterByKey(this.karatId) as KaratMasterModel;
        this.ShowEditViewKaratMaster(this.karatData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get karatMasterFormControls() { return this.karatMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/karatmaster');
  }

  disableControls() {
    this.karatMasterFormControls.KaratCode.disable();
    this.karatMasterFormControls.KaratName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.karatId = 0;
    this.karatMasterFormControls.KaratCode.setValue(null);
    this.karatMasterFormControls.KaratName.setValue(null);
  }

  ShowEditViewKaratMaster(data: KaratMasterModel) {
    this.karatMasterFormControls.KaratCode.setValue(data.karatCode);
    this.karatMasterFormControls.KaratName.setValue(data.karatName);
    this.karatMasterFormControls.KaratCode.disable();
  }

  SaveKaratMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.karatMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.karatMasterModel=new KaratMasterModel;
    this.karatMasterModel.id = this.karatId;
    this.karatMasterModel.karatCode = this.karatMasterFormControls.KaratCode.value;
    this.karatMasterModel.karatName = this.karatMasterFormControls.KaratName.value;
    
    if(this.editMode){
     saveResponse = this.karatMasterService.editKaratMaster(this.karatMasterModel);
    } else {
      saveResponse = this.karatMasterService.addKaratmaster(this.karatMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.karatMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.karatMasterService.AddOrEditRecordToCache(this.karatMasterModel, this.editMode);
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
