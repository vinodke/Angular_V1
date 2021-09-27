import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { categorymasterservice } from '../../../../core/service/categorymaster.service';
import { subcategorymasterservice } from '../../../../core/service/subcategorymaster.service';
import { ModalService } from '../../../../core/_modal';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { CategoryMasterModel } from '../../../../shared/model/CategoryMasterModel';
import { SubCategoryMasterModel } from '../../../../shared/model/SubCategoryMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-subcategorymasterform',
  templateUrl: './subcategorymasterform.component.html',
  styleUrls: ['./subcategorymasterform.component.scss']
})
export class SubcategorymasterformComponent implements OnInit {

  categories: CategoryMasterModel[] = [];
  subCategoryMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  @Input() routetype:boolean=false; 
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  subCategoryId!: number;
  error = '';
  editMode: boolean = false;
  subCategoryData!: SubCategoryMasterModel;
  subCategoryMasterModel: SubCategoryMasterModel = new SubCategoryMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private subCategoryMasterService: subcategorymasterservice,
    private categoryMasterService: categorymasterservice,
    private modalService:ModalService) { 
      this.subCategoryMasterForm = this.formBuilder.group({
        categorySelCode: [null, Validators.required],
        subCategoryCode: ['', Validators.required],
        subCategoryName: ['', Validators.required]
      });
    }

 async ngOnInit() {
  this.categories =  await this.categoryMasterService.getCategoryMaster();

    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.subCategoryId = +params['id'];
        this.editMode = true;
        this.subCategoryData = this.subCategoryMasterService.getSubCategoryMasterByKey(this.subCategoryId) as SubCategoryMasterModel;
        this.ShowEditViewSubCategoryMaster(this.subCategoryData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  $('.select2bs4').select2();
  $('[name="categorySelCode"]').on("change",  () => {
   this.subCategoryMasterFormControls.categorySelCode.setValue($('[name="categorySelCode"]').val());
  });
  }

  get subCategoryMasterFormControls() { return this.subCategoryMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/subcategorymaster');
  }

  closeModal() {
    this.modalService.close('custom-modal-2');
}

  disableControls() {
    this.subCategoryMasterFormControls.categorySelCode.disable();
    this.subCategoryMasterFormControls.subCategoryCode.disable();
    this.subCategoryMasterFormControls.subCategoryName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.subCategoryId = 0;
    this.subCategoryMasterFormControls.categorySelCode.setValue(null);
    this.subCategoryMasterFormControls.subCategoryCode.setValue(null);
    this.subCategoryMasterFormControls.subCategoryName.setValue(null);
    $('select').select2().trigger('change');
  }

  ShowEditViewSubCategoryMaster(data: SubCategoryMasterModel) {
    this.subCategoryMasterFormControls.categorySelCode.setValue(data.categoryID);
    this.subCategoryMasterFormControls.subCategoryCode.setValue(data.subCategoryCode);
    this.subCategoryMasterFormControls.subCategoryName.setValue(data.subCategoryName);
    this.subCategoryMasterFormControls.subCategoryCode.disable();
  }

  SaveSubCategoryMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.subCategoryMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.subCategoryMasterModel=new SubCategoryMasterModel;
    this.subCategoryMasterModel.id = this.subCategoryId;
    this.subCategoryMasterModel.categoryID = this.subCategoryMasterFormControls.categorySelCode.value;
    this.subCategoryMasterModel.subCategoryCode = this.subCategoryMasterFormControls.subCategoryCode.value;
    this.subCategoryMasterModel.subCategoryName = this.subCategoryMasterFormControls.subCategoryName.value;
    const currentCategory = this.categories.filter(item => item.id == this.subCategoryMasterModel.categoryID)[0];
      this.subCategoryMasterModel.categoryName = currentCategory.categoryName;
    if(this.editMode){
     saveResponse = this.subCategoryMasterService.editSubCategoryMaster(this.subCategoryMasterModel);
    } else {
      saveResponse = this.subCategoryMasterService.addSubCategorymaster(this.subCategoryMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.subCategoryMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.subCategoryMasterService.AddOrEditRecordToCache(this.subCategoryMasterModel, this.editMode);
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
