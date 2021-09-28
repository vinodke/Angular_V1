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
import { AgGridAngular } from 'ag-grid-angular';
import { PrintModel } from '../../../../shared/model/PrintModel';
import { printService } from '../../../../core/service/print.service';
import { AuditVerifyModel } from '../../../../shared/model/audit-verify-model';
import { LocationMismatch } from '../../../../shared/model/location-mismatch';
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

  @ViewChild('agGridVerify') agGridVerify!: AgGridAngular;
  columnAuditVerifyDefs: any;
  rowData: any;
  locationMismatch: LocationMismatch[] = [];
  isRePrintRowSelected: boolean = false;
  verifySerialNoList: any[] = [];
  rowSelection: string = '';

  submitted = false;
  departmentCodes: DepartmentMasterModel[] = [];
  warehouseCodes: WarehouseMasterModel[] = [];
  loading = false;
  public test: any[] = [];
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  isVerifyEvent: boolean = true;
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
  verifyAuditID: string = '';
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private locationMaster: LocationmasterService,
    private auditMasterService: AuditmasterService,
    private departmentMasterService: DepartmentmasterService,
    private warehouseMasterService: warehousemasterservice,
    private datePipe: DatePipe,
    private saveAlert: SaveAlert,
    private inactivateAlert: InactivateAlert, private printService: printService) {
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

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        if (params['state'] === 'verify') {
          this.verifyAuditID = params.id;
          this.isVerifyEvent = true;
        }
        else {
          this.AuditId = params['id'];
          this.isVerifyEvent = false;
        }
      }
    });
    if (!this.isVerifyEvent) {


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
        } else {
          this.editMode = false;
        }
      });
    }
    
    if (this.isVerifyEvent) {
      this.rowSelection = 'multiple';

      this.columnAuditVerifyDefs = [
        {
          headerName: 'Audit ID', field: 'auditID', sortable: true, filter: true, resizable: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true
        },
        { headerName: 'System Location Code', field: 'systemLocationCode', sortable: true, filter: true, resizable: true },
        { headerName: 'Scan Location Code', field: 'scanLocationCode', sortable: true, filter: true, resizable: true },
        { headerName: 'Serial Number', field: 'serialNumber', sortable: true, filter: true, resizable: true },
        { headerName: 'Status', field: 'statusText', sortable: true, filter: true, resizable: true },
        { headerName: 'Item Code', field: 'itemCode', sortable: true, filter: true, resizable: true },
        { headerName: 'Item Name', field: 'itemName', sortable: true, filter: true, resizable: true },
      ];

      this.LoadAuditVerifyList(this.verifyAuditID);
    }
    

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
    //let selectedNodes = this.agGridVerify.api.getSelectedNodes().fi;

    this.verifySerialNoList = [];

    const selectedNodes = this.agGridVerify.api.getSelectedNodes() as any[];
    for (let i = 0; i < selectedNodes.length; i++) {
      let rowdata = selectedNodes[i].data.serialNumber;
      this.verifySerialNoList.push(rowdata);
    }
    console.log(this.verifySerialNoList);
    if (this.verifySerialNoList.length > 0) {
      this.inactivateAlert.VerifyConfirmBox(this.verifyAuditID, this.verifySerialNoList)
    } else {
      alert("Please select atleast one audit");
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

  onRePrintRowClick(event: any) {
    
    this.isRowUnSelected = false;
    this.isRePrintRowSelected = true;
  }

  async LoadAuditVerifyList(auditID: string) {
    this.rowData = await this.auditMasterService.getAuditVerifyReport(auditID);
    this.locationMismatch = this.rowData.locationMismatch;
    this.agGridVerify.api.setRowData(this.locationMismatch);
    this.agGridVerify.api.redrawRows();
  }

  VerifyAudit() {
    this.submitted = true;
    let selectedNodes = this.agGridVerify.api.getSelectedNodes();
    let selectedData = selectedNodes.map<LocationMismatch>(node => node.data);
    let saveResponse: Observable<any>;
    //saveResponse = this.printService.updatePrint(selectedData);
    //saveResponse.subscribe(
    //  result => {
    //    this.submitted = false;
    //    this.WriteZPL(selectedData);
    //  },
    //  err => {
    //    this.printSaleError = err.error ? err.error : err.message;
    //  }
    //);
  }
}

