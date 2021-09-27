import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { itemcollectionmasterservice } from '../../../../core/service/itemcollectionmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { ItemCollectionMasterModel } from '../../../../shared/model/ItemCollectionMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-itemcollectionmasterform',
  templateUrl: './itemcollectionmasterform.component.html',
  styleUrls: ['./itemcollectionmasterform.component.scss']
})
export class ItemcollectionmasterformComponent implements OnInit {

  itemCollectionMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  itemCollectionId!: number;
  error = '';
  editMode: boolean = false;
  itemCollectionData!: ItemCollectionMasterModel;
  itemCollectionMasterModel: ItemCollectionMasterModel = new ItemCollectionMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private itemCollectionMasterService: itemcollectionmasterservice) { 
      this.itemCollectionMasterForm = this.formBuilder.group({
        ItemCollectionCode: ['', Validators.required],
        ItemCollectionName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.itemCollectionId = +params['id'];
        this.editMode = true;
        this.itemCollectionData = this.itemCollectionMasterService.getItemCollectionMasterByKey(this.itemCollectionId) as ItemCollectionMasterModel;
        this.ShowEditViewItemCollectionMaster(this.itemCollectionData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get itemCollectionMasterFormControls() { return this.itemCollectionMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/itemcollectionmaster');
  }

  disableControls() {
    this.itemCollectionMasterFormControls.ItemCollectionCode.disable();
    this.itemCollectionMasterFormControls.ItemCollectionName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.itemCollectionId = 0;
    this.itemCollectionMasterFormControls.ItemCollectionCode.setValue(null);
    this.itemCollectionMasterFormControls.ItemCollectionName.setValue(null);
  }

  ShowEditViewItemCollectionMaster(data: ItemCollectionMasterModel) {
    this.itemCollectionMasterFormControls.ItemCollectionCode.setValue(data.itemCollectionCode);
    this.itemCollectionMasterFormControls.ItemCollectionName.setValue(data.itemCollectionName);
    this.itemCollectionMasterFormControls.ItemCollectionCode.disable();
  }

  SaveItemCollectionMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.itemCollectionMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.itemCollectionMasterModel=new ItemCollectionMasterModel;
    this.itemCollectionMasterModel.id = this.itemCollectionId;
    this.itemCollectionMasterModel.itemCollectionCode = this.itemCollectionMasterFormControls.ItemCollectionCode.value;
    this.itemCollectionMasterModel.itemCollectionName = this.itemCollectionMasterFormControls.ItemCollectionName.value;
    
    if(this.editMode){
     saveResponse = this.itemCollectionMasterService.editItemCollectionMaster(this.itemCollectionMasterModel);
    } else {
      saveResponse = this.itemCollectionMasterService.addItemCollectionmaster(this.itemCollectionMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.itemCollectionMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.itemCollectionMasterService.AddOrEditRecordToCache(this.itemCollectionMasterModel, this.editMode);
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
