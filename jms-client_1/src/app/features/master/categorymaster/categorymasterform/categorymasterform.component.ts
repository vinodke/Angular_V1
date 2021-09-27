import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { categorymasterservice } from '../../../../core/service/categorymaster.service';
import { ModalService } from '../../../../core/_modal';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { CategoryMasterModel } from '../../../../shared/model/CategoryMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-categorymasterform',
  templateUrl: './categorymasterform.component.html',
  styleUrls: ['./categorymasterform.component.scss']
})
export class CategorymasterformComponent implements OnInit {
  @Input() routetype:boolean=false; 
  CategoryMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  categoryId!: number;
  error = '';
  editMode: boolean = false;
  categoryData!: CategoryMasterModel;
  categoryMasterModel: CategoryMasterModel = new CategoryMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private modalService:ModalService,
    private categoryMasterService: categorymasterservice) { 
      this.CategoryMasterForm = this.formBuilder.group({
        CategoryCode: ['', Validators.required],
        CategoryName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.categoryId = +params['id'];
        this.editMode = true;
        this.categoryData = this.categoryMasterService.getCategoryMasterByKey(this.categoryId) as CategoryMasterModel;
        this.ShowEditViewCategoryMaster(this.categoryData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get categoryMasterFormControls() { return this.CategoryMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/categorymaster');
  }

  disableControls() {
    this.categoryMasterFormControls.CategoryCode.disable();
    this.categoryMasterFormControls.CategoryName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  closeModal() {
    this.modalService.close('custom-modal-2');
}

  ClearContents() {
    this.categoryId = 0;
    this.categoryMasterFormControls.CategoryCode.setValue(null);
    this.categoryMasterFormControls.CategoryName.setValue(null);
  }

  ShowEditViewCategoryMaster(data: CategoryMasterModel) {
    this.categoryMasterFormControls.CategoryCode.setValue(data.categoryCode);
    this.categoryMasterFormControls.CategoryName.setValue(data.categoryName);
    this.categoryMasterFormControls.CategoryCode.disable();
  }

  SaveCategoryMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.CategoryMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.categoryMasterModel=new CategoryMasterModel;
    this.categoryMasterModel.id = this.categoryId;
    this.categoryMasterModel.categoryCode = this.categoryMasterFormControls.CategoryCode.value;
    this.categoryMasterModel.categoryName = this.categoryMasterFormControls.CategoryName.value;
    
    if(this.editMode){
     saveResponse = this.categoryMasterService.editCategoryMaster(this.categoryMasterModel);
    } else {
      saveResponse = this.categoryMasterService.addCategorymaster(this.categoryMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.categoryMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.categoryMasterService.AddOrEditRecordToCache(this.categoryMasterModel, this.editMode);
      this.submitted = false;
      if(this.routetype==true)
      {
        this.closeModal();
      }
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
