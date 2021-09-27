import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { itemfamilymasterservice } from '../../../../core/service/itemfamilymaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { ItemFamilyMasterModel } from '../../../../shared/model/ItemFamilyMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-itemfamilymasterform',
  templateUrl: './itemfamilymasterform.component.html',
  styleUrls: ['./itemfamilymasterform.component.scss']
})
export class ItemfamilymasterformComponent implements OnInit {

  itemFamilyMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  itemFamilyId!: number;
  error = '';
  editMode: boolean = false;
  itemFamilyData!: ItemFamilyMasterModel;
  itemFamilyMasterModel: ItemFamilyMasterModel = new ItemFamilyMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private itemFamilymasterservice: itemfamilymasterservice) { 
      this.itemFamilyMasterForm = this.formBuilder.group({
        ItemFamilyCode: ['', Validators.required],
        ItemFamilyName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.itemFamilyId = +params['id'];
        this.editMode = true;
        this.itemFamilyData = this.itemFamilymasterservice.getItemFamilyMasterByKey(this.itemFamilyId) as ItemFamilyMasterModel;
        this.ShowEditViewItemFamilyMaster(this.itemFamilyData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get itemFamilyMasterFormControls() { return this.itemFamilyMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/itemfamilymaster');
  }

  disableControls() {
    this.itemFamilyMasterFormControls.ItemFamilyCode.disable();
    this.itemFamilyMasterFormControls.ItemFamilyName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.itemFamilyId = 0;
    this.itemFamilyMasterFormControls.ItemFamilyCode.setValue(null);
    this.itemFamilyMasterFormControls.ItemFamilyName.setValue(null);
  }

  ShowEditViewItemFamilyMaster(data: ItemFamilyMasterModel) {
    this.itemFamilyMasterFormControls.ItemFamilyCode.setValue(data.itemFamilyCode);
    this.itemFamilyMasterFormControls.ItemFamilyName.setValue(data.itemFamilyName);
    this.itemFamilyMasterFormControls.ItemFamilyCode.disable();
  }

  SaveItemFamilyMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.itemFamilyMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.itemFamilyMasterModel=new ItemFamilyMasterModel;
    this.itemFamilyMasterModel.id = this.itemFamilyId;
    this.itemFamilyMasterModel.itemFamilyCode = this.itemFamilyMasterFormControls.ItemFamilyCode.value;
    this.itemFamilyMasterModel.itemFamilyName = this.itemFamilyMasterFormControls.ItemFamilyName.value;
    
    if(this.editMode){
     saveResponse = this.itemFamilymasterservice.editItemFamilyMaster(this.itemFamilyMasterModel);
    } else {
      saveResponse = this.itemFamilymasterservice.addItemFamilymaster(this.itemFamilyMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.itemFamilyMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.itemFamilymasterservice.AddOrEditRecordToCache(this.itemFamilyMasterModel, this.editMode);
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
