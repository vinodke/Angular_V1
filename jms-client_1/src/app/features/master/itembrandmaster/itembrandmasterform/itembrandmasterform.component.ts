import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { itembrandmasterservice } from '../../../../core/service/itembrandmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { ItemBrandMasterModel } from '../../../../shared/model/ItemBrandMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-itembrandmasterform',
  templateUrl: './itembrandmasterform.component.html',
  styleUrls: ['./itembrandmasterform.component.scss']
})
export class ItembrandmasterformComponent implements OnInit {

  itemBrandMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  itemBrandId!: number;
  error = '';
  editMode: boolean = false;
  itemBrandData!: ItemBrandMasterModel;
  itemBrandMasterModel: ItemBrandMasterModel = new ItemBrandMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private itemBrandMasterService: itembrandmasterservice) { 
      this.itemBrandMasterForm = this.formBuilder.group({
        ItemBrandCode: ['', Validators.required],
        ItemBrandName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.itemBrandId = +params['id'];
        this.editMode = true;
        this.itemBrandData = this.itemBrandMasterService.getItemBrandMasterByKey(this.itemBrandId) as ItemBrandMasterModel;
        this.ShowEditViewItemBrandMaster(this.itemBrandData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get itemBrandMasterFormControls() { return this.itemBrandMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/itembrandmaster');
  }

  disableControls() {
    this.itemBrandMasterFormControls.ItemBrandCode.disable();
    this.itemBrandMasterFormControls.ItemBrandName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.itemBrandId = 0;
    this.itemBrandMasterFormControls.ItemBrandCode.setValue(null);
    this.itemBrandMasterFormControls.ItemBrandName.setValue(null);
  }

  ShowEditViewItemBrandMaster(data: ItemBrandMasterModel) {
    this.itemBrandMasterFormControls.ItemBrandCode.setValue(data.itemBrandCode);
    this.itemBrandMasterFormControls.ItemBrandName.setValue(data.itemBrandName);
    this.itemBrandMasterFormControls.ItemBrandCode.disable();
  }

  SaveItemBrandMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.itemBrandMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.itemBrandMasterModel=new ItemBrandMasterModel;
    this.itemBrandMasterModel.id = this.itemBrandId;
    this.itemBrandMasterModel.itemBrandCode = this.itemBrandMasterFormControls.ItemBrandCode.value;
    this.itemBrandMasterModel.itemBrandName = this.itemBrandMasterFormControls.ItemBrandName.value;
    
    if(this.editMode){
     saveResponse = this.itemBrandMasterService.editItemBrandMaster(this.itemBrandMasterModel);
    } else {
      saveResponse = this.itemBrandMasterService.addItemBrandmaster(this.itemBrandMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.itemBrandMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.itemBrandMasterService.AddOrEditRecordToCache(this.itemBrandMasterModel, this.editMode);
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
