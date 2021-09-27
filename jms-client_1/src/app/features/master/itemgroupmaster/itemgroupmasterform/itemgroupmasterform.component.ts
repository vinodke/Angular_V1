import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { itemgroupmasterservice } from '../../../../core/service/itemgroupmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { ItemGroupMasterModel } from '../../../../shared/model/ItemGroupMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-itemgroupmasterform',
  templateUrl: './itemgroupmasterform.component.html',
  styleUrls: ['./itemgroupmasterform.component.scss']
})
export class ItemgroupmasterformComponent implements OnInit {

  itemGroupMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  itemGroupId!: number;
  error = '';
  editMode: boolean = false;
  itemGroupData!: ItemGroupMasterModel;
  itemGroupMasterModel: ItemGroupMasterModel = new ItemGroupMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private itemGroupmasterservice: itemgroupmasterservice) { 
      this.itemGroupMasterForm = this.formBuilder.group({
        ItemGroupCode: ['', Validators.required],
        ItemGroupName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.itemGroupId = +params['id'];
        this.editMode = true;
        this.itemGroupData = this.itemGroupmasterservice.getItemGroupMasterByKey(this.itemGroupId) as ItemGroupMasterModel;
        this.ShowEditViewItemGroupMaster(this.itemGroupData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get itemGroupMasterFormControls() { return this.itemGroupMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/itemgroupmaster');
  }

  disableControls() {
    this.itemGroupMasterFormControls.ItemGroupCode.disable();
    this.itemGroupMasterFormControls.ItemGroupName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.itemGroupId = 0;
    this.itemGroupMasterFormControls.ItemGroupCode.setValue(null);
    this.itemGroupMasterFormControls.ItemGroupName.setValue(null);
  }

  ShowEditViewItemGroupMaster(data: ItemGroupMasterModel) {
    this.itemGroupMasterFormControls.ItemGroupCode.setValue(data.itemGroupCode);
    this.itemGroupMasterFormControls.ItemGroupName.setValue(data.itemGroupName);
    this.itemGroupMasterFormControls.ItemGroupCode.disable();
  }

  SaveItemGroupMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.itemGroupMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.itemGroupMasterModel=new ItemGroupMasterModel;
    this.itemGroupMasterModel.id = this.itemGroupId;
    this.itemGroupMasterModel.itemGroupCode = this.itemGroupMasterFormControls.ItemGroupCode.value;
    this.itemGroupMasterModel.itemGroupName = this.itemGroupMasterFormControls.ItemGroupName.value;
    
    if(this.editMode){
     saveResponse = this.itemGroupmasterservice.editItemGroupMaster(this.itemGroupMasterModel);
    } else {
      saveResponse = this.itemGroupmasterservice.addItemGroupmaster(this.itemGroupMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.itemGroupMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.itemGroupmasterservice.AddOrEditRecordToCache(this.itemGroupMasterModel, this.editMode);
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
