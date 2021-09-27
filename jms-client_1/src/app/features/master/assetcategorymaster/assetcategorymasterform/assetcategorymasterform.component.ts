import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-assetcategorymasterform',
  templateUrl: './assetcategorymasterform.component.html',
  styleUrls: ['./assetcategorymasterform.component.scss']
})
export class AssetcategorymasterformComponent implements OnInit {
  assetCategoryMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  assetCategoryId!: number;
  error = '';
  editMode: boolean = false;
  assetCategoryData!: AssetCategoryMasterModel;
  assetCategoryMasterModel: AssetCategoryMasterModel = new AssetCategoryMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private saveAlert: SaveAlert) { 
    this.assetCategoryMasterForm = this.formBuilder.group({
      AssetCategoryCode: [null, Validators.required],
      AssetCategoryName: [null, Validators.required],
      AssetCategoryShortCode: [null],
      DepreciationPeriod: [null, Validators.required],
      DepreciationPercentage: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        if(params['id'] != undefined) {
          this.assetCategoryId = +params['id'];
          this.editMode = true;
          this.assetCategoryData = this.assetCategoryMasterService.getAssetCategoryMasterByKey(this.assetCategoryId) as AssetCategoryMasterModel;
          this.ShowEditViewAassetCategoryMaster(this.assetCategoryData);
          
          if (params['state'] === 'view')
          {
            this.disableControls();
          }
        } else {
          this.editMode = false;
        }
    });
  }

  get assetCategoryMasterFormControls() { return this.assetCategoryMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/assetcategory');
  }

  disableControls() {
    this.assetCategoryMasterFormControls.AssetCategoryCode.disable();
    this.assetCategoryMasterFormControls.AssetCategoryName.disable();
    this.assetCategoryMasterFormControls.AssetCategoryShortCode.disable();
    this.assetCategoryMasterFormControls.DepreciationPeriod.disable();
    this.assetCategoryMasterFormControls.DepreciationPercentage.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.assetCategoryId = 0;
    this.assetCategoryMasterFormControls.AssetCategoryCode.setValue('');
    this.assetCategoryMasterFormControls.AssetCategoryName.setValue('');
    this.assetCategoryMasterFormControls.AssetCategoryShortCode.setValue('');
    this.assetCategoryMasterFormControls.DepreciationPeriod.setValue('');
    this.assetCategoryMasterFormControls.DepreciationPercentage.setValue('');
    
  }

  ShowEditViewAassetCategoryMaster(data: AssetCategoryMasterModel) {
    this.assetCategoryMasterFormControls.AssetCategoryCode.setValue(data.assetCategoryCode);
    this.assetCategoryMasterFormControls.AssetCategoryName.setValue(data.assetCategoryName);
    this.assetCategoryMasterFormControls.AssetCategoryShortCode.setValue(data.assetCategoryShortCode);
    this.assetCategoryMasterFormControls.DepreciationPeriod.setValue(data.categoryDepreciationPeriod);
    this.assetCategoryMasterFormControls.DepreciationPercentage.setValue(data.categoryDepreciationPercent);
    this.assetCategoryMasterFormControls.AssetCategoryCode.disable();
  }

  SaveAassetCategoryMaster(){
      let saveResponse: Observable<any>;
      this.submitted = true;

      // stop here if form is invalid
    if (this.assetCategoryMasterForm.invalid) {
      return;
  }
      this.loading = true;
      this.assetCategoryMasterModel = new AssetCategoryMasterModel;
      this.assetCategoryMasterModel.assetCategoryId = this.assetCategoryId;
      this.assetCategoryMasterModel.assetCategoryCode = this.assetCategoryMasterFormControls.AssetCategoryCode.value;
      this.assetCategoryMasterModel.assetCategoryName = this.assetCategoryMasterFormControls.AssetCategoryName.value;
      this.assetCategoryMasterModel.assetCategoryShortCode = this.assetCategoryMasterFormControls.AssetCategoryShortCode.value;
      this.assetCategoryMasterModel.categoryDepreciationPeriod = this.assetCategoryMasterFormControls.DepreciationPeriod.value;
      this.assetCategoryMasterModel.categoryDepreciationPercent = this.assetCategoryMasterFormControls.DepreciationPercentage.value;
      
      if(this.editMode){
       saveResponse = this.assetCategoryMasterService.editAssetCategorymaster(this.assetCategoryMasterModel);
      } else {
        saveResponse = this.assetCategoryMasterService.addAssetCategorymaster(this.assetCategoryMasterModel);
    }

    
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.assetCategoryMasterModel.assetCategoryId = result.assetCategoryId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.assetCategoryMasterService.AddOrEditRecordToCache(this.assetCategoryMasterModel, this.editMode);
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

