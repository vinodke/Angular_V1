import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { categorymasterservice } from '../../../../core/service/categorymaster.service';
import { karatmasterservice } from '../../../../core/service/karatmaster.service';
import { regionmasterservice } from '../../../../core/service/regionmaster.service';
import { taxmasterService } from '../../../../core/service/taxmaster.service';
import { uommasterservice } from '../../../../core/service/uommaster.service';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { ModalService } from '../../../../core/_modal';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { CategoryMasterModel } from '../../../../shared/model/CategoryMasterModel';
import { KaratMasterModel } from '../../../../shared/model/KaratMasterModel';
import { RegionMasterModel } from '../../../../shared/model/RegionMasterModel';
import { TaxMasterModel } from '../../../../shared/model/TaxMasterModel';
import { UOMMasterModel } from '../../../../shared/model/UOMMasterModel';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-taxmasterform',
  templateUrl: './taxmasterform.component.html',
  styleUrls: ['./taxmasterform.component.scss']
})
export class TaxmasterformComponent implements OnInit {

  categories: CategoryMasterModel[] = [];
  uomcodes: UOMMasterModel[] = [];
  karatCodes: KaratMasterModel[] = [];
  taxMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  taxId!: number;
  error = '';
  editMode: boolean = false;
  taxData!: TaxMasterModel;
taxMasterModel: TaxMasterModel = new TaxMasterModel;
  @Input() routetype:boolean=false; 
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private taxMasterService: taxmasterService,
    private categorymasterservice: categorymasterservice,
    private uommasterservice: uommasterservice,
    private karatmasterservice: karatmasterservice,
    private modalService:ModalService) { 
      this.taxMasterForm = this.formBuilder.group({
        CategorySelCode: [null, Validators.required],
        UOMSelCode: [null, Validators.required],
        KaratSelCode: [null],
        LabourTax: ['', Validators.required],
        ItemTax: ['', Validators.required],
      });
    }

 async ngOnInit() {
  this.categories =  await this.categorymasterservice.getCategoryMaster();
  this.karatCodes =  await this.karatmasterservice.getKaratMaster();
  this.uomcodes =  await this.uommasterservice.getUOMMaster();

    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.taxId = +params['id'];
        this.editMode = true;
        this.taxData = this.taxMasterService.getTaxMasterByKey(this.taxId) as TaxMasterModel;
        this.ShowEditViewTaxMaster(this.taxData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  $('.select2bs4').select2();
  $('[name="CategorySelCode"]').on("change",  () => {
   this.taxMasterFormControls.CategorySelCode.setValue($('[name="CategorySelCode"]').val());
  });
  $('[name="UOMSelCode"]').on("change",  () => {
    this.taxMasterFormControls.UOMSelCode.setValue($('[name="UOMSelCode"]').val());
   });
   $('[name="KaratSelCode"]').on("change",  () => {
    this.taxMasterFormControls.KaratSelCode.setValue($('[name="KaratSelCode"]').val());
   });
  }

  get taxMasterFormControls() { return this.taxMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/taxmaster');
  }

  closeModal() {
      this.modalService.close('custom-modal-2');
  }

  disableControls() {
    this.taxMasterFormControls.CategorySelCode.disable();
    this.taxMasterFormControls.UOMSelCode.disable();
    this.taxMasterFormControls.KaratSelCode.disable();
    this.taxMasterFormControls.LabourTax.disable();
    this.taxMasterFormControls.ItemTax.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.taxId = 0;
    this.taxMasterFormControls.CategorySelCode.setValue(null);
    this.taxMasterFormControls.UOMSelCode.setValue(null);
    this.taxMasterFormControls.KaratSelCode.setValue(null);
    this.taxMasterFormControls.LabourTax.setValue(null);
    this.taxMasterFormControls.ItemTax.setValue(null);
    $('select').select2().trigger('change');
  }

  ShowEditViewTaxMaster(data: TaxMasterModel) {
    this.taxMasterFormControls.CategorySelCode.setValue(data.categoryID);
    this.taxMasterFormControls.UOMSelCode.setValue(data.uomid);
    this.taxMasterFormControls.KaratSelCode.setValue(data.karatID);
    this.taxMasterFormControls.LabourTax.setValue(data.labourTax);
    this.taxMasterFormControls.ItemTax.setValue(data.itemTax);
  }

  SaveTaxMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.taxMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.taxMasterModel=new TaxMasterModel;
    this.taxMasterModel.id = this.taxId;
    this.taxMasterModel.categoryID = this.taxMasterFormControls.CategorySelCode.value;
    this.taxMasterModel.categoryCode = this.categories.filter(item=>item.id  == this.taxMasterFormControls.CategorySelCode.value)[0].categoryCode;
    this.taxMasterModel.categoryName = this.categories.filter(item=>item.id  == this.taxMasterFormControls.CategorySelCode.value)[0].categoryName;
    this.taxMasterModel.uomid = this.taxMasterFormControls.UOMSelCode.value;
    this.taxMasterModel.uomCode = this.uomcodes.filter(item=>item.id  == this.taxMasterFormControls.UOMSelCode.value)[0].uomCode;
    this.taxMasterModel.uomName = this.uomcodes.filter(item=>item.id  == this.taxMasterFormControls.UOMSelCode.value)[0].uomName;
    this.taxMasterModel.karatID = this.taxMasterFormControls.KaratSelCode.value;
    if(this.taxMasterFormControls.KaratSelCode.value!=null && this.taxMasterFormControls.KaratSelCode.value!='')
    {
    this.taxMasterModel.karatCode = this.karatCodes.filter(item=>item.id  ==  this.taxMasterFormControls.KaratSelCode.value)[0].karatCode;
    this.taxMasterModel.karatName = this.karatCodes.filter(item=>item.id  == this.taxMasterFormControls.KaratSelCode.value)[0].karatName;
    }
    this.taxMasterModel.labourTax = this.taxMasterFormControls.LabourTax.value;
    this.taxMasterModel.itemTax = this.taxMasterFormControls.ItemTax.value;
    if(this.editMode){
     saveResponse = this.taxMasterService.editTaxmaster(this.taxMasterModel);
    } else {
      saveResponse = this.taxMasterService.addTaxmaster(this.taxMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.taxMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      console.log(this.taxMasterModel);
      this.taxMasterService.AddOrEditRecordToCache(this.taxMasterModel, this.editMode);
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
