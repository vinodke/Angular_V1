import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { colormasterservice } from '../../../../core/service/colormaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { ColorMasterModel } from '../../../../shared/model/ColorMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-colormasterform',
  templateUrl: './colormasterform.component.html',
  styleUrls: ['./colormasterform.component.scss']
})
export class ColormasterformComponent implements OnInit {

  ColorMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  colorId!: number;
  error = '';
  editMode: boolean = false;
  colorData!: ColorMasterModel;
  colorMasterModel: ColorMasterModel = new ColorMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private colorMasterService: colormasterservice) { 
      this.ColorMasterForm = this.formBuilder.group({
        ColorCode: ['', Validators.required],
        ColorName: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.colorId = +params['id'];
        this.editMode = true;
        this.colorData = this.colorMasterService.getColorMasterByKey(this.colorId) as ColorMasterModel;
        this.ShowEditViewColorMaster(this.colorData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  }

  get ColorMasterFormControls() { return this.ColorMasterForm.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/colormaster');
  }

  disableControls() {
    this.ColorMasterFormControls.ColorCode.disable();
    this.ColorMasterFormControls.ColorName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.colorId = 0;
    this.ColorMasterFormControls.ColorCode.setValue(null);
    this.ColorMasterFormControls.ColorName.setValue(null);
  }

  ShowEditViewColorMaster(data: ColorMasterModel) {
    this.ColorMasterFormControls.ColorCode.setValue(data.colorCode);
    this.ColorMasterFormControls.ColorName.setValue(data.colorName);
    this.ColorMasterFormControls.ColorCode.disable();
  }

  SaveColorMaster(){
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.ColorMasterForm.invalid) {
    return;
}
    this.loading = true;
    this.colorMasterModel=new ColorMasterModel;
    this.colorMasterModel.id = this.colorId;
    this.colorMasterModel.colorCode = this.ColorMasterFormControls.ColorCode.value;
    this.colorMasterModel.colorName = this.ColorMasterFormControls.ColorName.value;
    
    if(this.editMode){
     saveResponse = this.colorMasterService.editColorMaster(this.colorMasterModel);
    } else {
      saveResponse = this.colorMasterService.addColormaster(this.colorMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
        this.colorMasterModel.id = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.colorMasterService.AddOrEditRecordToCache(this.colorMasterModel, this.editMode);
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
