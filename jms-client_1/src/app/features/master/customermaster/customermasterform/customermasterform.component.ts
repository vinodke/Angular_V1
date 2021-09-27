import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { customerMasterService } from '../../../../core/service/customermaster.service';
import { ModalService } from '../../../../core/_modal';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { CustomerMasterModel } from '../../../../shared/model/CustomerMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-customermasterform',
  templateUrl: './customermasterform.component.html',
  styleUrls: ['./customermasterform.component.scss']
})
export class CustomermasterformComponent implements OnInit {
  @Input() routetype:boolean=false; 
  customerMasterForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  customerId!: number;
  error = '';
  editMode: boolean = false;
  customerData!: CustomerMasterModel;
  customermastermodel: CustomerMasterModel = new CustomerMasterModel;
  
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerMasterService: customerMasterService,
    private saveAlert: SaveAlert,
    private modalService:ModalService) { 
      //const reg = /^(http?|https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    this.customerMasterForm = this.formBuilder.group({
      CustomerCode: [null, Validators.required],
      CustomerName: [null, Validators.required],
      Address1: [null, Validators.required],
      Address2: [null],
      City: [null],
      Country: [null],
      ContactNumber: [null],
      Email: [null],
      VatNumber: [null],
      
    });
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
        if(params['id'] != undefined) {
          this.customerId = +params['id'];
          this.editMode = true;
          this.customerData = this.customerMasterService.getCustomerMasterByKey(this.customerId) as CustomerMasterModel;
          this.ShowEditViewCustomerMaster(this.customerData);
          
          if (params['state'] === 'view')
          {
            this.disableControls();
          }
        } else {
          this.editMode = false;
        }
    });
  }

  get customerMasterFormControls() { return this.customerMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/customermaster');
  }

  
closeModal() {
  this.modalService.close('custom-modal-2');
}

  disableControls() {
    this.customerMasterFormControls.CustomerCode.disable();
    this.customerMasterFormControls.CustomerName.disable();
    this.customerMasterFormControls.Address1.disable();
    this.customerMasterFormControls.Address2.disable();
    this.customerMasterFormControls.City.disable();
    this.customerMasterFormControls.Country.disable();
    this.customerMasterFormControls.ContactNumber.disable();
    this.customerMasterFormControls.Email.disable();
    this.customerMasterFormControls.VatNumber.disable();
    //this.customerMasterFormControls.SupplierImage.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.customerId = 0;
    this.customerMasterFormControls.CustomerCode.setValue(null);
    this.customerMasterFormControls.CustomerName.setValue(null);
    this.customerMasterFormControls.Address1.setValue(null);
    this.customerMasterFormControls.Address2.setValue(null);
    this.customerMasterFormControls.City.setValue(null);
    this.customerMasterFormControls.Country.setValue(null);
    this.customerMasterFormControls.ContactNumber.setValue(null);
    this.customerMasterFormControls.Email.setValue(null);
    this.customerMasterFormControls.VatNumber.setValue(null);
    
    
  }

  ShowEditViewCustomerMaster(data: CustomerMasterModel) {
    this.customerMasterFormControls.CustomerCode.setValue(data.customerCode);
    this.customerMasterFormControls.CustomerName.setValue(data.customerName);
    this.customerMasterFormControls.Address1.setValue(data.address1);
    this.customerMasterFormControls.Address2.setValue(data.address2);
    this.customerMasterFormControls.City.setValue(data.city);
    this.customerMasterFormControls.Country.setValue(data.country);
    this.customerMasterFormControls.ContactNumber.setValue(data.contactNumber);
    this.customerMasterFormControls.Email.setValue(data.emailID);
    this.customerMasterFormControls.VatNumber.setValue(data.vatNumber);
    this.customerMasterFormControls.CustomerCode.disable();
  }

  SaveCustomerMaster(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.customerMasterForm.invalid) {
      return;
  }
      this.loading = true;
      let saveResponse: Observable<any>;
      this.customermastermodel = new CustomerMasterModel;
      this.customermastermodel.id = this.customerId;
      this.customermastermodel.customerCode = this.customerMasterFormControls.CustomerCode.value;
      this.customermastermodel.customerName = this.customerMasterFormControls.CustomerName.value;
      this.customermastermodel.address1 = this.customerMasterFormControls.Address1.value;
      this.customermastermodel.address2 = this.customerMasterFormControls.Address2.value;
      this.customermastermodel.city = this.customerMasterFormControls.City.value;
      this.customermastermodel.country = this.customerMasterFormControls.Country.value;
      this.customermastermodel.contactNumber = this.customerMasterFormControls.ContactNumber.value;
      this.customermastermodel.emailID = this.customerMasterFormControls.Email.value;
      this.customermastermodel.vatNumber = this.customerMasterFormControls.VatNumber.value;
        
    
      
      if(this.editMode){
       saveResponse = this.customerMasterService.editCustomermaster(this.customermastermodel);
      } else {
        saveResponse = this.customerMasterService.addCustomermaster(this.customermastermodel);
    }

    
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
        this.customermastermodel.id = result.id;
        this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.customerMasterService.AddOrEditRecordToCache(this.customermastermodel, this.editMode);
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
