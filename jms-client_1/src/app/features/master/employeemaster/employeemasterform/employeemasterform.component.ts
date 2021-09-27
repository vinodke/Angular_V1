import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeMasterService } from '../../../../core/service/employeemaster.service';
import { DepartmentmasterService } from '../../../../core/service/departmentmaster.service';
import { EmployeeMasterModel } from '../../../../shared/model/EmployeeMasterModel';
import { DepartmentMasterModel } from '../../../../shared/model/DepartmentMasterModel';
import { Observable } from 'rxjs';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
declare var $: any;

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'org-fat-employeeMasterForm',
  templateUrl: './employeemasterform.component.html',
  styleUrls: ['./employeemasterform.component.scss']
})
export class EmployeemasterformComponent implements OnInit {
  @ViewChild('Image', {static: false})
  Image!: ElementRef;
  employeeMasterForm: FormGroup;
  submitted = false;
  departmentCodes: DepartmentMasterModel[] = [];
  warehouseCodes: WarehouseMasterModel[] = [];
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  employeeId!: number;
  error = '';
  editMode: boolean = false;
  employeeData!: EmployeeMasterModel;
  employeemastermodel: EmployeeMasterModel = new EmployeeMasterModel;
  selectedFile!: ImageSnippet;
  imageError!: string;
  isImageSaved!: boolean;
  cardImageBase64!: string;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeMasterService: EmployeeMasterService,
    private departmentMasterService: DepartmentmasterService,
    private warehouseMasterService: warehousemasterservice,
    private saveAlert: SaveAlert) { 
    this.employeeMasterForm = this.formBuilder.group({
      warehouseSelCode: [null, Validators.required],
      departmentSelCode: [null, Validators.required],
      EmployeeCode: [null, Validators.required],
      EmployeeName: [null, Validators.required],
      Designation: [null, Validators.required],
      ContactNumber: [null],
      Email: [null],
      Address1: [null],
      Address2: [null],
      City: [null],
      Country: [null]
    });
  }


  async ngOnInit() {
    this.departmentCodes =  await this.departmentMasterService.getDepartmentMaster();
    this.warehouseCodes =  await this.warehouseMasterService.getWarehouseMaster();
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.employeeId = +params['id'];
        this.editMode = true;
        this.employeeData = this.employeeMasterService.getEmployeeMasterByKey(this.employeeId) as EmployeeMasterModel;
        this.ShowEditViewEmployeeMaster(this.employeeData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });

    $('.select2bs4').select2();
    $('[name="warehouseSelCode"]').on("change",  () => {
      this.employeeMasterFormControls.warehouseSelCode.setValue($('[name="warehouseSelCode"]').val());
     });
    $('[name="departmentSelCode"]').on("change",  () => {
     this.employeeMasterFormControls.departmentSelCode.setValue($('[name="departmentSelCode"]').val());
    });
   
  }

  get employeeMasterFormControls() { return this.employeeMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/employeemaster');
  }

  disableControls() {
    this.employeeMasterFormControls.warehouseSelCode.disable();
    this.employeeMasterFormControls.departmentSelCode.disable();
    this.employeeMasterFormControls.EmployeeCode.disable();
    this.employeeMasterFormControls.EmployeeName.disable();
    this.employeeMasterFormControls.ContactNumber.disable();
    this.employeeMasterFormControls.Designation.disable();
    this.employeeMasterFormControls.Email.disable();
    this.employeeMasterFormControls.Address1.disable();
    this.employeeMasterFormControls.Address2.disable();
    this.employeeMasterFormControls.City.disable();
    this.employeeMasterFormControls.Country.disable();
    //this.employeeMasterFormControls.EmployeeImage.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.employeeId = 0;
    this.employeeMasterFormControls.warehouseSelCode.setValue(null);
    this.employeeMasterFormControls.departmentSelCode.setValue(null);
    this.employeeMasterFormControls.EmployeeCode.setValue(null);
    this.employeeMasterFormControls.EmployeeName.setValue(null);
    this.employeeMasterFormControls.ContactNumber.setValue(null);
    this.employeeMasterFormControls.Designation.setValue(null);
    this.employeeMasterFormControls.Email.setValue(null);
    this.employeeMasterFormControls.Address1.setValue(null);
    this.employeeMasterFormControls.Address2.setValue(null);
    this.employeeMasterFormControls.City.setValue(null);
    this.employeeMasterFormControls.Country.setValue(null);
    $('select').select2().trigger('change');
    //this.Image.nativeElement.value = '';
    this.cardImageBase64 = '';
    this.isImageSaved = false;
    
  }

  ShowEditViewEmployeeMaster(data: EmployeeMasterModel) {
    this.employeeMasterFormControls.warehouseSelCode.setValue(data.warehouseID);
    this.employeeMasterFormControls.departmentSelCode.setValue(data.departmentID);
    this.employeeMasterFormControls.EmployeeCode.setValue(data.employeeCode);
    this.employeeMasterFormControls.EmployeeName.setValue(data.employeeName);
    this.employeeMasterFormControls.ContactNumber.setValue(data.contactNumber);
    this.employeeMasterFormControls.Designation.setValue(data.designation);
    this.employeeMasterFormControls.Email.setValue(data.mailID);
    this.employeeMasterFormControls.Address1.setValue(data.address1);
    this.employeeMasterFormControls.Address2.setValue(data.address2);
    this.employeeMasterFormControls.City.setValue(data.city);
    this.employeeMasterFormControls.Country.setValue(data.country);
    // this.cardImageBase64 = atob(data.image);
    // this.isImageSaved = true;
    this.employeeMasterFormControls.EmployeeCode.disable();
  }

  SaveEmployeeMaster(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.employeeMasterForm.invalid) {
      return;
  }
      this.loading = true;
      let saveResponse: Observable<any>;
      this.employeemastermodel = new EmployeeMasterModel;
      this.employeemastermodel.warehouseID = this.employeeMasterFormControls.warehouseSelCode.value;
      this.employeemastermodel.departmentID = this.employeeMasterFormControls.departmentSelCode.value;
      this.employeemastermodel.id = this.employeeId;
      this.employeemastermodel.employeeCode = this.employeeMasterFormControls.EmployeeCode.value;
      this.employeemastermodel.employeeName = this.employeeMasterFormControls.EmployeeName.value;
      this.employeemastermodel.mailID = this.employeeMasterFormControls.Email.value;
      this.employeemastermodel.designation = this.employeeMasterFormControls.Designation.value;
      this.employeemastermodel.contactNumber = this.employeeMasterFormControls.ContactNumber.value;
      this.employeemastermodel.address1 = this.employeeMasterFormControls.Address1.value;
      this.employeemastermodel.address2 = this.employeeMasterFormControls.Address2.value;
      this.employeemastermodel.city = this.employeeMasterFormControls.City.value;
      this.employeemastermodel.country = this.employeeMasterFormControls.Country.value;
      // this.employeemastermodel.image = btoa(this.cardImageBase64);
      const currentDepartment = this.departmentCodes.filter(item => item.id == this.employeemastermodel.departmentID)[0];
        this.employeemastermodel.departmentCode = currentDepartment.departmentCode;
        this.employeemastermodel.departmentName = currentDepartment.departmentName;
        const currentWarehouse = this.warehouseCodes.filter(item => item.id == this.employeemastermodel.warehouseID)[0];
        this.employeemastermodel.warehouseName = currentWarehouse.warehouseName;
        this.employeemastermodel.warehouseCode = currentWarehouse.warehouseCode;
        
    
      
      if(this.editMode){
       saveResponse = this.employeeMasterService.editEmployeemaster(this.employeemastermodel);
      } else {
        saveResponse = this.employeeMasterService.addEmployeemaster(this.employeemastermodel);
    }

    
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.employeemastermodel.id = result.id;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.employeeMasterService.AddOrEditRecordToCache(this.employeemastermodel, this.editMode);
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

  fileChangeEvent(fileInput: any) {
    this.imageError = '';
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';

            return false;
        }

        if (fileInput.target.files[0].type.includes(allowed_types)) {
            this.imageError = 'Only Images are allowed ( JPG | PNG )';
            return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(fileInput.target.files[0]);
        reader.onload = (e: any) => {
            this.cardImageBase64 = e.target.result;
            this.isImageSaved = true;
            return true;
          };

          return false;
        }
        return false;
  }

  removeImage() {
    this.cardImageBase64 = '';
    this.isImageSaved = false;
  }
}

