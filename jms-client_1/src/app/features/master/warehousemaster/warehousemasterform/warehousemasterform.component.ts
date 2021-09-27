import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { regionmasterservice } from '../../../../core/service/regionmaster.service';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { ModalService } from '../../../../core/_modal';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { RegionMasterModel } from '../../../../shared/model/RegionMasterModel';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-warehousemasterform',
  templateUrl: './warehousemasterform.component.html',
  styleUrls: ['./warehousemasterform.component.scss']
})
export class WarehousemasterformComponent implements OnInit {
  regions: RegionMasterModel[] = [];
  warehouseMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  warehouseId!: number;
  error = '';
  editMode: boolean = false;
  warehouseData!: WarehouseMasterModel;
  warehouseMasterModel: WarehouseMasterModel = new WarehouseMasterModel;
  @Input() routetype:boolean=false; 
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private warehouseMasterService: warehousemasterservice,
    private regionMasterService: regionmasterservice,
    private modalService:ModalService) { 
      this.warehouseMasterForm = this.formBuilder.group({
        regionSelCode: [null, Validators.required],
        warehouseCode: ['', Validators.required],
        warehouseName: ['', Validators.required],
        contactNumber: [null],
        contactEmail: [null],
        address1: ['', Validators.required],
        address2: [null],
        city: [null],
        state: [null]
      });
    }

 async ngOnInit() {
  this.regions =  await this.regionMasterService.getRegionMaster();

    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.warehouseId = +params['id'];
        this.editMode = true;
        this.warehouseData = this.warehouseMasterService.getWarehouseMasterByKey(this.warehouseId) as WarehouseMasterModel;
        this.ShowEditViewWarehouseMaster(this.warehouseData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  $('.select2bs4').select2();
  $('[name="regionSelCode"]').on("change",  () => {
   this.warehouseMasterFormControls.regionSelCode.setValue($('[name="regionSelCode"]').val());
  });
  }

  get warehouseMasterFormControls() { return this.warehouseMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/warehousemaster');
  }

  closeModal() {
      this.modalService.close('custom-modal-2');
  }

  disableControls() {
    this.warehouseMasterFormControls.regionSelCode.disable();
    this.warehouseMasterFormControls.warehouseCode.disable();
    this.warehouseMasterFormControls.warehouseName.disable();
    this.warehouseMasterFormControls.address1.disable();
    this.warehouseMasterFormControls.address2.disable();
    this.warehouseMasterFormControls.city.disable();
    this.warehouseMasterFormControls.state.disable();
    this.warehouseMasterFormControls.contactNumber.disable();
    this.warehouseMasterFormControls.contactEmail.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.warehouseId = 0;
    this.warehouseMasterFormControls.regionSelCode.setValue(null);
    this.warehouseMasterFormControls.warehouseCode.setValue(null);
    this.warehouseMasterFormControls.warehouseName.setValue(null);
    this.warehouseMasterFormControls.address1.setValue(null);
    this.warehouseMasterFormControls.address2.setValue(null);
    this.warehouseMasterFormControls.city.setValue(null);
    this.warehouseMasterFormControls.state.setValue(null);
    this.warehouseMasterFormControls.contactNumber.setValue(null);
    this.warehouseMasterFormControls.contactEmail.setValue(null);
    $('select').select2().trigger('change');
  }

  ShowEditViewWarehouseMaster(data: WarehouseMasterModel) {
    this.warehouseMasterFormControls.regionSelCode.setValue(data.regionID);
    this.warehouseMasterFormControls.warehouseCode.setValue(data.warehouseCode);
    this.warehouseMasterFormControls.warehouseName.setValue(data.warehouseName);
    this.warehouseMasterFormControls.address1.setValue(data.address1);
    this.warehouseMasterFormControls.address2.setValue(data.address2);
    this.warehouseMasterFormControls.city.setValue(data.city);
    this.warehouseMasterFormControls.state.setValue(data.state);
    this.warehouseMasterFormControls.contactNumber.setValue(data.contactNumber);
    this.warehouseMasterFormControls.contactEmail.setValue(data.contactEmail);
    this.warehouseMasterFormControls.warehouseCode.disable();
  }

  SaveWarehouseMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.warehouseMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.warehouseMasterModel=new WarehouseMasterModel;
    this.warehouseMasterModel.id = this.warehouseId;
    this.warehouseMasterModel.regionID = this.warehouseMasterFormControls.regionSelCode.value;
    this.warehouseMasterModel.warehouseCode = this.warehouseMasterFormControls.warehouseCode.value;
    this.warehouseMasterModel.warehouseName = this.warehouseMasterFormControls.warehouseName.value;
    this.warehouseMasterModel.address1 = this.warehouseMasterFormControls.address1.value;
    this.warehouseMasterModel.address2 = this.warehouseMasterFormControls.address2.value;
    this.warehouseMasterModel.city = this.warehouseMasterFormControls.city.value;
    this.warehouseMasterModel.state = this.warehouseMasterFormControls.state.value;
    this.warehouseMasterModel.contactEmail = this.warehouseMasterFormControls.contactEmail.value;
    this.warehouseMasterModel.contactNumber = this.warehouseMasterFormControls.contactNumber.value;
    const currentSite = this.regions.filter(item => item.id == this.warehouseMasterModel.regionID)[0];
      this.warehouseMasterModel.regionName = currentSite.regionName;
    if(this.editMode){
     saveResponse = this.warehouseMasterService.editWarehouseMaster(this.warehouseMasterModel);
    } else {
      saveResponse = this.warehouseMasterService.addWarehousemaster(this.warehouseMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.warehouseMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.warehouseMasterService.AddOrEditRecordToCache(this.warehouseMasterModel, this.editMode);
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
