import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { regionmasterservice } from '../../../../core/service/regionmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { RegionMasterModel } from '../../../../shared/model/RegionMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-regionmasterform',
  templateUrl: './regionmasterform.component.html',
  styleUrls: ['./regionmasterform.component.scss']
})
export class RegionmasterformComponent implements OnInit {

  regionMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  regionId!: number;
  error = '';
  editMode: boolean = false;
  regionData!: RegionMasterModel;
  regionMasterModel: RegionMasterModel = new RegionMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private regionMasterService: regionmasterservice) { 
      this.regionMasterForm = this.formBuilder.group({
        RegionCode: ['', Validators.required],
        RegionName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.regionId = +params['id'];
        this.editMode = true;
        this.regionData = this.regionMasterService.getRegionMasterByKey(this.regionId) as RegionMasterModel;
        this.ShowEditViewRegionMaster(this.regionData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get regionMasterFormControls() { return this.regionMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/regionmaster');
  }

  disableControls() {
    this.regionMasterFormControls.RegionCode.disable();
    this.regionMasterFormControls.RegionName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.regionId = 0;
    this.regionMasterFormControls.RegionCode.setValue(null);
    this.regionMasterFormControls.RegionName.setValue(null);
  }

  ShowEditViewRegionMaster(data: RegionMasterModel) {
    this.regionMasterFormControls.RegionCode.setValue(data.regionCode);
    this.regionMasterFormControls.RegionName.setValue(data.regionName);
    this.regionMasterFormControls.RegionCode.disable();
  }

  SaveRegionMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.regionMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.regionMasterModel=new RegionMasterModel;
    this.regionMasterModel.id = this.regionId;
    this.regionMasterModel.regionCode = this.regionMasterFormControls.RegionCode.value;
    this.regionMasterModel.regionName = this.regionMasterFormControls.RegionName.value;
    
    if(this.editMode){
     saveResponse = this.regionMasterService.editRegionMaster(this.regionMasterModel);
    } else {
      saveResponse = this.regionMasterService.addRegionmaster(this.regionMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.regionMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.regionMasterService.AddOrEditRecordToCache(this.regionMasterModel, this.editMode);
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
