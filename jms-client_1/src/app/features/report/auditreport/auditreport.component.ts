import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { itemMasterService } from 'src/app/core/service/itemmaster.service';
import { AuditreportService } from 'src/app/core/service/auditreport.service';
import { warehousemasterservice } from 'src/app/core/service/warehousemaster.service';
import { ItemMasterModel } from 'src/app/shared/model/ItemMasterModel';
import { AuditReport, AuditReportDetail, AuditReportFilter, TabModel } from 'src/app/shared/model/auditreport';
import { WarehouseMasterModel } from 'src/app/shared/model/WarehouseMasterModel';
import * as XLSX from 'xlsx'; 
//import * as html2pdf from 'html2pdf.js';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare var $: any;

@Component({
  selector: 'app-auditreport',
  templateUrl: './auditreport.component.html',
  styleUrls: ['./auditreport.component.css']
})
export class AuditreportComponent implements OnInit {

  //@ViewChild('excelsummary', {static: false}) excelsummary: ElementRef;
  fileName= 'AuditReportSummary.xlsx'; 
  AuditReportForm: FormGroup;
  warehouseCodes:WarehouseMasterModel[]=[];
  itemcodes:ItemMasterModel[]=[];
  auditReportSummary:AuditReport[]=[];
  auditReportAllDetail:AuditReportDetail[]=[];
  auditReportDetail:AuditReportDetail[]=[];
  selectedTab='custom-tabs-two-home';
  tab1:string='';
  tab2:string='';
  tablist1:TabModel[]=[];
  tabModel:TabModel=new TabModel;
  tablist:string[]=[];
  submitted = true;
  totalCount!: number;
  foundCount!: number;
  missingCount!:number;
  locationMismatchCount!:number;
  unknownCount!:number;
  locationCount!: number;
  mismatchApprovedCount!:number;

  constructor(private formBuilder: FormBuilder,private warehousemasterservice:warehousemasterservice,
    private itemmasterservice:itemMasterService,private auditreportservice:AuditreportService) { 
    this.AuditReportForm = this.formBuilder.group({
      auditID: "",
      fromDate: [null],
      toDate:[null],
      warehouseID: "",
      StatusID: "",

    });
  }

  async ngOnInit() {
    this.tabModel.TabName='custom-tabs-two-home'
    this.tabModel.TabSelected=true;
    this.tabModel.TabActive='active'
    this.tabModel.TabText='Summary Report'
    this.tablist1.push(this.tabModel);
    this.tabModel=new TabModel;
    this.tabModel.TabName='custom-tabs-two-profile'
    this.tabModel.TabSelected=false;
    this.tabModel.TabActive=''
    this.tabModel.TabText='Detail Report'
    this.tablist1.push(this.tabModel);
    this.selectedTab='custom-tabs-two-home';
    this.tab1='active show';
    this.tab2='';
    console.log(this.tablist1);
    this.SetDatePickerInitValue(); 
    $('.select2bs4').select2();
     this.warehouseCodes=await this.warehousemasterservice.getWarehouseMaster();
     this.itemcodes=await this.itemmasterservice.getItemMaster();
     $('[name="auditID"]').on("change",  () => {
      this.AuditReportFormControls.auditID.setValue($('[name="auditID"]').val());
     });
     $('[name="warehouseID"]').on("change",  () => {
      this.AuditReportFormControls.warehouseID.setValue($('[name="warehouseID"]').val());
     });
     $('[name="fromDate"]').on("change",  () => {
      this.AuditReportFormControls.fromDate.setValue($('[name="fromDate"]').val());
     });
     $('[name="toDate"]').on("change",  () => {
      this.AuditReportFormControls.toDate.setValue($('[name="toDate"]').val());
     });

     $('[name="StatusID"]').on("change",  () => {
      this.AuditReportFormControls.StatusID.setValue($('[name="StatusID"]').val());
      this.fnFilterReportDetails();
     });
     var auditreportsummaryFilter:AuditReportFilter=new AuditReportFilter;
     auditreportsummaryFilter.auditID=this.AuditReportFormControls.auditID.value;
     auditreportsummaryFilter.warehouseID=this.AuditReportFormControls.warehouseID.value;
     auditreportsummaryFilter.fromDate=$('#fromDate .datetimepicker-input').val();
     auditreportsummaryFilter.toDate=$('#toDate .datetimepicker-input').val();
     console.log(auditreportsummaryFilter);
    this.auditReportSummary= await this.auditreportservice.getAuditReportSummary(auditreportsummaryFilter);
   
    var auditreportsummaryFilter:AuditReportFilter=new AuditReportFilter;
    auditreportsummaryFilter.auditID="";
    this.auditReportDetail=[];
    this.auditReportDetail= await this.auditreportservice.getAuditReportDetail(auditreportsummaryFilter);
    this.auditReportAllDetail = this.auditReportDetail;
this.getAllReportCount();
    }
    
    get AuditReportFormControls() { return this.AuditReportForm.controls; }

    async ViewSummaryClicked()
  {
     var auditreportsummaryFilter:AuditReportFilter=new AuditReportFilter;
     auditreportsummaryFilter.auditID=this.AuditReportFormControls.auditID.value;
     auditreportsummaryFilter.warehouseID=this.AuditReportFormControls.warehouseID.value;
     auditreportsummaryFilter.fromDate=$('#fromDate .datetimepicker-input').val();
     auditreportsummaryFilter.toDate=$('#toDate .datetimepicker-input').val();
     console.log(auditreportsummaryFilter);
    this.auditReportSummary= await this.auditreportservice.getAuditReportSummary(auditreportsummaryFilter);
  }
  ClearSummary()
  {
    this.auditReportSummary=[];
    this.SetDatePickerInitValue(); 
    this.AuditReportFormControls.auditID.setValue('');
    this.AuditReportFormControls.warehouseID.setValue('');
    $('[name="warehouseID"]').select2().trigger('change');
    this.AuditReportFormControls.DetailauditID.setValue('');
    this.AuditReportFormControls.DetailwarehouseID.setValue('');
    $('[name="DetailwarehouseID"]').select2().trigger('change');
  }

  async ShowItemDetail(auditreportsummary:AuditReport,indexofSummary:number)
  {
    var auditreportsummaryFilter:AuditReportFilter=new AuditReportFilter;
    auditreportsummaryFilter.auditID=auditreportsummary.auditID;
    this.auditReportDetail=[];
    debugger
    this.auditReportDetail= await this.auditreportservice.getAuditReportDetail(auditreportsummaryFilter);
    this.auditReportAllDetail = this.auditReportDetail;
    this.getAllReportCount();
    this.selectedTab='custom-tabs-two-profile';
    this.tab1='';
    this.tab2='active show';
    this.tablist1[0].TabActive='';
    this.tablist1[0].TabSelected=false;
    this.tablist1[1].TabActive='active';
    this.tablist1[1].TabSelected=true;
  }

  async ViewDetailClicked()
  {
    var auditreportsummaryFilter:AuditReportFilter=new AuditReportFilter;
    auditreportsummaryFilter.auditID=this.AuditReportFormControls.auditID.value;
     console.log(auditreportsummaryFilter);
    this.auditReportDetail= await this.auditreportservice.getAuditReportDetail(auditreportsummaryFilter);
    this.auditReportAllDetail = this.auditReportDetail;
    this.getAllReportCount();
  }
  ClearDetail()
  {
    this.auditReportDetail=[];
    this.auditReportAllDetail = this.auditReportDetail;
  }
  SelectTab(tab:TabModel,indexOfelement:number)
  {
    this.tablist1.forEach(element => {
      if(element.TabName==tab.TabName)
      {
        element.TabActive='active';
        element.TabSelected=true;
        this.selectedTab=element.TabName;
        if(indexOfelement==0)
        {
          this.tab1='active show';
          this.tab2='';
        }
        else if(indexOfelement==1)
        {
          this.tab1='';
          this.tab2='active show';
        }
      }
      else
      {
        element.TabActive='';
        element.TabSelected=false;
        if(indexOfelement==0)
        {
          this.tab1='active show';
          this.tab2='';
        }
        else if(indexOfelement==1)
        {
          this.tab1='';
          this.tab2='active show';
        }
      }
    });
    console.log(this.tablist1);
  }

  exportexcelsummary(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('excelsummary'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, 'AuditReportSummary.xlsx');
			
    }

   async exportpdfsummary() 
    {
      $('#excelsummarydiv').removeClass('tableFixHead');
      var HTML_Width = $(".canvas_summary_pdf").width();
      var HTML_Height = $(".canvas_summary_pdf").height();
      var top_left_margin = 15;
      var PDF_Width = HTML_Width+(top_left_margin*2);
      var PDF_Height:any = (PDF_Width*1.5)+(top_left_margin*2);
      var canvas_image_width = HTML_Width;
      var canvas_image_height = HTML_Height;
      
      var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
      
  
     await html2canvas($(".canvas_summary_pdf")[0],{allowTaint:true}).then(async function(canvas) {
        canvas.getContext('2d');
        
        console.log(canvas.height+"  "+canvas.width);
        
        
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        console.log(PDF_Width+"  "+PDF_Height);
        var pdf = new jspdf.jsPDF('p','pt',[PDF_Width, PDF_Height]);
        // pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
        console.log(top_left_margin);
        
        for (var i = 0; i <= totalPDFPages; i++) { 
          console.log(PDF_Width+"  "+PDF_Height);
          if(i==0)
          {
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
          }
          else
          {
            pdf.addPage([PDF_Width, PDF_Height],'p');
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
          }
        }
         pdf.save("AuditReportSummary.pdf");
         $('#excelsummarydiv').addClass('tableFixHead');
          }); 
    }

    exportexcelDetail(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('exceldetail'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, 'AuditReportDetail.xlsx');
			
    }

    

   async exportpdfDetail()
    {
      $('#exceldetaildiv').removeClass('tableFixHead');
      var HTML_Width = $(".canvas_detail_pdf").width();
      var HTML_Height = $(".canvas_detail_pdf").height();
      var top_left_margin = 15;
      var PDF_Width = HTML_Width+(top_left_margin*2);
      var PDF_Height:any = (PDF_Width*1.5)+(top_left_margin*2);
      var canvas_image_width = HTML_Width;
      var canvas_image_height = HTML_Height;
      
      var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
      
  
     await html2canvas($(".canvas_detail_pdf")[0],{allowTaint:true}).then(async function(canvas) {
        canvas.getContext('2d');
        
        console.log(canvas.height+"  "+canvas.width);
        
        
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        console.log(PDF_Width+"  "+PDF_Height);
        var pdf = new jspdf.jsPDF('p','pt',[PDF_Width, PDF_Height]);
        // pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
        console.log(top_left_margin);
        
        for (var i = 0; i <= totalPDFPages; i++) { 
          console.log(PDF_Width+"  "+PDF_Height);
          if(i==0)
          {
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
          }
          else
          {
            pdf.addPage([PDF_Width, PDF_Height],'p');
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
          }
        }
         pdf.save("AuditReportDetail.pdf");
         $('#exceldetaildiv').addClass('tableFixHead');
          });
         
    }

    private SetDatePickerInitValue() {
      const today = new Date();
      const fromdefault = (today.getFullYear() - 1) + '-' +(today.getMonth()) + '-' + today.getDate();
      const todefault = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
      $('#fromDate').datetimepicker({
        format: 'yyyy-MM-DD'
      });
  
      $('#toDate').datetimepicker({
        format: 'yyyy-MM-DD'
      });
  
      $('[name="fromDate"]').on("change", () => {
        this.AuditReportFormControls.fromDate.setValue($('[name="fromDate"]').val());
      });
      $('[name="toDate"]').on("change", () => {
        this.AuditReportFormControls.toDate.setValue($('[name="toDate"]').val());
      });
  
      $("#fromDate .datetimepicker-input").val(fromdefault); // Assign the value
      $("#fromDate .datetimepicker-input").trigger("click"); // Trigger click
      $("#toDate .datetimepicker-input").val(todefault); // Assign the value
      $("#toDate .datetimepicker-input").trigger("click"); // Trigger click

    }

    private getAllReportCount(){
      this.totalCount = this.auditReportDetail.length;
    this.missingCount = this.auditReportDetail.filter(x => x.statusText =="Missing").length;
    this.foundCount = this.auditReportDetail.filter(x => x.statusText== "Found").length;
    this.locationCount = this.auditReportDetail.filter(x => x.statusText== "Location").length;
    this.unknownCount = this.auditReportDetail.filter(x => x.statusText=="Unknown").length;
    this.locationMismatchCount = this.auditReportDetail.filter(x => x.statusText == "Location Mismatch").length;
    this.mismatchApprovedCount = this.auditReportDetail.filter(x => x.statusText=="Mismatch Approved").length;
    }

    fnFilterReportDetails(){
      
      var SelectedStatus = this.AuditReportFormControls.StatusID.value;
      
      if(SelectedStatus == "" || SelectedStatus == null){
        this.auditReportDetail = this.auditReportAllDetail;
      }else{
        this.auditReportDetail = this.auditReportAllDetail.filter(x => x.statusText== SelectedStatus);
      }
      this.getAllReportCount();
    }
}
