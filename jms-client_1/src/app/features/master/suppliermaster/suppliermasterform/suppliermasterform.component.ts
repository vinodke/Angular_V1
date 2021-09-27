  import { Component, Input, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { ModalService } from '../../../../core/_modal';
  import { SaveAlert } from '../../../../shared/commonalerts/savealert';
  import { SupplierMasterModel } from '../../../../shared/model/SupplierMasterModel';
  import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-suppliermasterform',
  templateUrl: './suppliermasterform.component.html',
  styleUrls: ['./suppliermasterform.component.scss']
})
export class SuppliermasterformComponent implements OnInit {
  supplierMasterForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  supplierId!: number;
  error = '';
  editMode: boolean = false;
  supplierData!: SupplierMasterModel;
  @Input() routetype:boolean=false; 
  suppliermastermodel: SupplierMasterModel = new SupplierMasterModel;
  
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private supplierMasterService: SupplierMasterService,
    private saveAlert: SaveAlert,
    private modalService:ModalService) { 
      //const reg = /^(http?|https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    this.supplierMasterForm = this.formBuilder.group({
      SupplierCode: [null, Validators.required],
      SupplierName: [null, Validators.required],
      Address1: [null, Validators.required],
      Address2: [null],
      City: [null],
      Country: [null],
      CountryCode: [null],
      ContactPerson: [null],
      ContactNumber: [null],
      Email: [null],
      VatNumber: [null],
      
    });
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
        if(params['id'] != undefined) {
          this.supplierId = +params['id'];
          this.editMode = true;
          this.supplierData = this.supplierMasterService.getSupplierMasterByKey(this.supplierId) as SupplierMasterModel;
          this.ShowEditViewSupplierMaster(this.supplierData);
          
          if (params['state'] === 'view')
          {
            this.disableControls();
          }
        } else {
          this.editMode = false;
        }
    });
  }

  get supplierMasterFormControls() { return this.supplierMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/suppliermaster');
  }
  closeModal() {
    this.modalService.close('custom-modal-2');
}

  disableControls() {
    this.supplierMasterFormControls.SupplierCode.disable();
    this.supplierMasterFormControls.SupplierName.disable();
    this.supplierMasterFormControls.Address1.disable();
    this.supplierMasterFormControls.Address2.disable();
    this.supplierMasterFormControls.City.disable();
    this.supplierMasterFormControls.Country.disable();
    this.supplierMasterFormControls.CountryCode.disable();
    this.supplierMasterFormControls.ContactNumber.disable();
    this.supplierMasterFormControls.Email.disable();
    this.supplierMasterFormControls.ContactPerson.disable();
    this.supplierMasterFormControls.VatNumber.disable();
    //this.supplierMasterFormControls.SupplierImage.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.supplierId = 0;
    this.supplierMasterFormControls.SupplierCode.setValue(null);
    this.supplierMasterFormControls.SupplierName.setValue(null);
    this.supplierMasterFormControls.Address1.setValue(null);
    this.supplierMasterFormControls.Address2.setValue(null);
    this.supplierMasterFormControls.City.setValue(null);
    this.supplierMasterFormControls.Country.setValue(null);
    this.supplierMasterFormControls.CountryCode.setValue(null);
    this.supplierMasterFormControls.ContactNumber.setValue(null);
    this.supplierMasterFormControls.Email.setValue(null);
    this.supplierMasterFormControls.ContactPerson.setValue(null);
    this.supplierMasterFormControls.VatNumber.setValue(null);
    
    
  }

  ShowEditViewSupplierMaster(data: SupplierMasterModel) {
    this.supplierMasterFormControls.SupplierCode.setValue(data.supplierCode);
    this.supplierMasterFormControls.SupplierName.setValue(data.supplierName);
    this.supplierMasterFormControls.Address1.setValue(data.address1);
    this.supplierMasterFormControls.Address2.setValue(data.address2);
    this.supplierMasterFormControls.City.setValue(data.city);
    this.supplierMasterFormControls.Country.setValue(data.country);
    this.supplierMasterFormControls.CountryCode.setValue(data.countryCode);
    this.supplierMasterFormControls.ContactNumber.setValue(data.contactNumber);
    this.supplierMasterFormControls.Email.setValue(data.emailID);
    this.supplierMasterFormControls.ContactPerson.setValue(data.contactPerson);
    this.supplierMasterFormControls.VatNumber.setValue(data.vatNumber);
    this.supplierMasterFormControls.SupplierCode.disable();
  }

  SaveSupplierMaster(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.supplierMasterForm.invalid) {
      return;
  }
      this.loading = true;
      let saveResponse: Observable<any>;
      this.suppliermastermodel = new SupplierMasterModel;
      this.suppliermastermodel.id = this.supplierId;
      this.suppliermastermodel.supplierCode = this.supplierMasterFormControls.SupplierCode.value;
      this.suppliermastermodel.supplierName = this.supplierMasterFormControls.SupplierName.value;
      this.suppliermastermodel.address1 = this.supplierMasterFormControls.Address1.value;
      this.suppliermastermodel.address2 = this.supplierMasterFormControls.Address2.value;
      this.suppliermastermodel.city = this.supplierMasterFormControls.City.value;
      this.suppliermastermodel.country = this.supplierMasterFormControls.Country.value;
      this.suppliermastermodel.countryCode = this.supplierMasterFormControls.CountryCode.value;
      this.suppliermastermodel.contactNumber = this.supplierMasterFormControls.ContactNumber.value;
      this.suppliermastermodel.emailID = this.supplierMasterFormControls.Email.value;
      this.suppliermastermodel.contactPerson = this.supplierMasterFormControls.ContactPerson.value;
      this.suppliermastermodel.vatNumber = this.supplierMasterFormControls.VatNumber.value;
        
    
      
      if(this.editMode){
       saveResponse = this.supplierMasterService.editSuppliermaster(this.suppliermastermodel);
      } else {
        saveResponse = this.supplierMasterService.addSuppliermaster(this.suppliermastermodel);
    }

    
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
        this.suppliermastermodel.id = result.id;
        this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.supplierMasterService.AddOrEditRecordToCache(this.suppliermastermodel, this.editMode);
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

