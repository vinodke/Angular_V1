import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditmasterService } from '../../../../core/service/auditmaster.service';
import { DepartmentmasterService } from '../../../../core/service/departmentmaster.service';
import { AuditMasterModel } from '../../../../shared/model/audit-master-model';
import { DepartmentMasterModel } from '../../../../shared/model/DepartmentMasterModel';
import { Observable } from 'rxjs';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { DatePipe } from '@angular/common';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';
declare var $: any;

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-auditmasterform',
  templateUrl: './auditmasterform.component.html',
  styleUrls: ['./auditmasterform.component.css']
})
export class AuditmasterformComponent implements OnInit {
  @Input() name: string = 'auditmasterverify';
  @ViewChild('Image', { static: false })
  Image!: ElementRef;
  auditMasterForm: FormGroup;

  submitted = false;
  departmentCodes: DepartmentMasterModel[] = [];
  warehouseCodes: WarehouseMasterModel[] = [];
  loading = false;
  public test: any[] = [];
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  isVerifyEvent: boolean = false;
  subscription!: Subscription;
  AuditId!: string;
  error = '';
  editMode: boolean = false;
  public auditData!: AuditMasterModel;
  auditmastermodel: AuditMasterModel = new AuditMasterModel;
  selectedFile!: ImageSnippet;
  imageError!: string;
  isImageSaved!: boolean;
  cardImageBase64!: string;
  audits: AuditMasterModel[] = [];
  auditCandidateList: any[] = [];
  locationMasterData: any[] = []
  candidateData: any
  candidateLocationCode: any
  public candidatesLists: any[] = []
  public location: any
  public arra: any[] = []
  public arra_ids: any[] = []
  auditVerifyForm: FormGroup;
  auditVerify: any;
  selectedNodes: any;
  isRowUnSelected: boolean = true;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private locationMaster: LocationmasterService,
    private auditMasterService: AuditmasterService,
    private departmentMasterService: DepartmentmasterService,
    private warehouseMasterService: warehousemasterservice,
    private datePipe: DatePipe,
    private saveAlert: SaveAlert,
    private inactivateAlert: InactivateAlert) {
    this.auditMasterForm = this.formBuilder.group({
      warehouseID: [null, Validators.required],
      auditID: [null],
      remark: [null, Validators.required],
      toBeAuditedOn: [null, Validators.required],
      auditCandidateList: ["", Validators.required]

    });

    this.auditVerifyForm = this.formBuilder.group({
      Locations: new FormControl([], Validators.required)
    });
  }


  async ngOnInit() {
    console.log('form')
    const candidates = await this.auditMasterService.getCondidateList({}) as any[];
    console.log(candidates)

    this.auditCandidateList = candidates.filter((c: any) => c.candidateLocationID);
    this.subscription = this.auditMasterService.selectedrowevent.subscribe(
      (e) => {
        this.isRowUnSelected = false;
        this.selectedNodes = e.data;
      }
    )
    this.locationMaster.getLocationMaster().then((res) => {
      this.test = res
      for (var i = 0; i <= this.test.length; i++) {
        for (var j = 0; j <= candidates.length; j++) {
          if (this.test[i]['locationCode'] == candidates[j]['candidateLocationCode'] && this.test[i]['locationName'] == candidates[j]['candidateLocationName']) {
            this.arra_ids.push(candidates[j])
            break
          }
        }
      }
    }


    )

    this.departmentCodes = await this.departmentMasterService.getDepartmentMaster();
    this.warehouseCodes = await this.warehouseMasterService.getWarehouseMaster();
    this.audits = await this.auditMasterService.getAuditMaster();
    // const candidates = await this.auditMasterService.getCondidateList({}) as any[];
    // this.auditCandidateList = candidates.filter(c => c.candidateLocationID);

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.AuditId = params['id'];
        this.editMode = true;
        this.auditData = this.auditMasterService.getAuditMasterByKey(this.AuditId) as AuditMasterModel;
        this.auditMasterService.getCondidateList({
          "auditID": this.auditData.auditID,
          "companyID": this.auditData.companyID,
          "warehouseID": this.auditData.warehouseID,
        }).then(data => {
          this.auditMasterForm.patchValue({ auditCandidateList: data.map((x: any) => x.candidateLocationID) })
        });

        this.ShowEditViewAuditMaster(this.auditData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
        else if (params['state'] === 'verify') {
          this.isVerifyEvent = true;
        }
      } else {
        this.editMode = false;
      }
    });

    // $('.select2bs4').select2();
    // $('[name="warehouseSelCode"]').on("change",  () => {
    //   this.auditMasterFormControls.warehouseSelCode.setValue($('[name="warehouseSelCode"]').val()); 
    //  });
    // $('[name="departmentSelCode"]').on("change",  () => {
    //  this.auditMasterFormControls.departmentSelCode.setValue($('[name="departmentSelCode"]').val());
    // });

  }

  wareHouse(data: any) {
    this.WarehouseCode?.setValue(data.target.value)
  }

  get WarehouseCode() {
    return this.auditMasterForm.get('WarehouseCode')
  }

  get auditMasterFormControls() { return this.auditMasterForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/auditmaster');
  }

  disableControls() {
    this.auditMasterForm.disable()
    // this.auditMasterFormControls.Remark.disable();
    // this.auditMasterFormControls.WarehouseCode.disable();
    // this.auditMasterFormControls.AuditId.disable();
    // this.auditMasterFormControls.SystemLocationCode.disable();
    //this.auditMasterFormControls.EmployeeImage.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {

    this.AuditId = "";
    this.auditMasterFormControls.Remark.setValue(null);
    this.auditMasterFormControls.WarehouseCode.setValue(null);
    this.auditMasterFormControls.AuditId.setValue(null);
    this.auditMasterFormControls.SystemLocationCode.setValue(null);
    $('select').select2().trigger('change');
    //this.Image.nativeElement.value = '';
    this.cardImageBase64 = '';
    this.isImageSaved = false;

  }

  ShowEditViewAuditMaster(data: AuditMasterModel) {
    this.auditMasterForm.patchValue({ ...data, toBeAuditedOn: this.dateFormatForForm(data.toBeAuditedOn) });
  }

  dateFormatForForm(date: any, format?: string) {
    return this.datePipe.transform(date, format ? format : 'yyyy-MM-dd');
  }

  SaveAuditMaster() {
    // stop here if form is invalid
    if (!this.auditMasterForm.valid) {
      //this.submitted = true;
      alert('enter all fields')
      return;
    }

    this.loading = true;
    let saveResponse: Observable<any>;
    if (this.editMode) {
      saveResponse = this.auditMasterService.editAuditmaster(this.auditMasterForm.value);
    } else {
      saveResponse = this.auditMasterService.addAuditmaster(this.auditMasterForm.value);
    }

    saveResponse.subscribe(
      result => {
        // if (!this.editMode) {
        //   this.auditmastermodel.AuditID = result.auditID;
        //   this.ClearContents();
        // }
        this.saveAlert.SuccessMessage();
        this.submitted = false;
        this.ShowGrid();
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

  AuditDiscrepancy() {
    debugger
    this.auditVerify = this.auditVerifyForm.value;
    if (this.auditVerifyForm.valid) {
      this.inactivateAlert.VerifyConfirmBox(this.selectedNodes.auditID, this.auditVerify.Locations)
    } else {
      alert("Please select location");
    }


  }

  oAuditDiscrepancyRowClick(event: any) {

  }

  getRowData(data: any) {
    if (data[0].status === 30) {
      console.log(data[0].status);
    }
    else {
      console.log(data[0].status)
    }
    //alert(data[0].status);
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.auditMasterService.refreshClickevent.next();
  }
}

