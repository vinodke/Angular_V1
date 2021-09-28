import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { printService } from '../../../../core/service/print.service';
import { PrintModel } from '../../../../shared/model/PrintModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-tagprintform',
  templateUrl: './tagprintform.component.html',
  styleUrls: ['./tagprintform.component.scss']
})
export class TagprintformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('agGridReprint') agGridReprint!: AgGridAngular;
  TagPrintForm: FormGroup;
  isRowSelected:boolean=false;
  isSubmitted:boolean=false;
  printList:PrintModel[]=[];
  rePrintList:PrintModel[]=[];
  selectedToPrint:PrintModel[]=[];
  printModel!:PrintModel;
  columnPrintDefs:any;
  columnRePrintDefs:any;
  printSaleError='';
  submitted:boolean=false;
  isRePrintRowSelected:boolean=false;
  constructor(private formBuilder: FormBuilder,private printService:printService) {
    this.TagPrintForm = this.formBuilder.group({
      DocumentNo: [null,Validators.required]
    });

   }

  ngOnInit(): void {
    this.columnPrintDefs=[
      { headerName:'Serial Number', field: 'serialNumber', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true},
      { headerName:'Gold Weight', field: 'goldWeight', sortable: true, filter: true, resizable: true, singleClickEdit: true,editable: true,},
      { headerName:'Stone Weight', field: 'stoneWeight', sortable: true, filter: true, resizable: true, singleClickEdit: true,editable: true,},
      { headerName:'Item Code', field: 'itemCode', sortable: true, filter: true, resizable: true},
      { headerName:'Warehouse Code', field: 'warehouseCode', sortable: true, filter: true, resizable: true},
      { headerName:'Document No', field: 'documentNumber', sortable: true, filter: true, resizable: true},
      { headerName:'Supplier Name', field: 'supplierName', sortable: true, filter: true, resizable: true},
      
     ];
     this.columnRePrintDefs=[
      { headerName:'Serial Number', field: 'serialNumber', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true},
      { headerName:'Gold Weight', field: 'goldWeight', sortable: true, filter: true, resizable: true, singleClickEdit: true,editable: true,},
      { headerName:'Stone Weight', field: 'stoneWeight', sortable: true, filter: true, resizable: true, singleClickEdit: true,editable: true,},
      { headerName:'Item Code', field: 'itemCode', sortable: true, filter: true, resizable: true},
      { headerName:'Warehouse Code', field: 'warehouseCode', sortable: true, filter: true, resizable: true},
     ];
  }
  onPrintRowClick(event:any)
  {
    debugger
    this.isRowSelected=true;
  }
  get TagPrintFormControls() { return this.TagPrintForm.controls; }

 async ViewClicked()
 {
   debugger
    this.isSubmitted=false;
    if(this.TagPrintFormControls.DocumentNo.value==null || this.TagPrintFormControls.DocumentNo.value=='')
    {
      this.isSubmitted=true;
      return;
    }
    this.printList = await this.printService.getSerials(this.TagPrintFormControls.DocumentNo.value);

  }

  onRePrintRowClick(event:any)
  {
    debugger
    this.isRePrintRowSelected=true;
  }

 async LoadReprintList()
  {
    this.rePrintList = await this.printService.getRePrintData();
    this.agGridReprint.api.setRowData(this.rePrintList);
    this.agGridReprint.api.redrawRows();
  }

  DesignZPL()
  {
  var zpl=  '^XA<br>' +
            '^RS8<br>' +
            '^RFW,H<br>' +
            '^FD[RFID]<br>' +
'^FS<br>'+
'^FO320,110<br>'+
'^BY1<br>'+
'^BCI,30,N,N,N<br>'+
'^FD[BARCODE]<br>'+
'^FS<br>'+
'^FO320,90<br>'+
'^ADN,5,5<br>'+
'^FD[BARCODE]<br>'+
'^FS<br>'+
'^FO320,70<br>'+
'^ADN,5,5<br>'+
'^FD[LINE2]<br>'+
'^FS<br>'+
'^FO395,70<br>'+
'^ADN,5,5<br>'+
'^FD[LINE3]<br>'+
'^FS<br>'+
'^FO320,192<br>'+
'^ADN,5,5<br>'+
'^FD[LINE4] G<br>'+
'^FS<br>'+
'^FO320,215<br>'+
'^ADN,5,5<br>'+
'^FD[LINE5]<br>'+
'^FS<br>'+
'^FO320,170<br>'+
'^ADN,5,5<br>'+
'^FD[LINE6]<br>'+
'^FS<br>'+
'^FO320,170<br>'+
'^ADN,5,5<br>'+
'^FD[LINE7]<br>'+
'^FS<br>'+
'^FO320,170<br>'+
'^ADN,5,5<br>'+
'^FD[LINE8]<br>'+
'^FS<br>'+
'^FO320,170<br>'+
'^ADN,5,5<br>'+
'^FD[LINE9]<br>'+
'^FS<br>'+
'^FO320,170<br>'+
'^ADN,5,5<br>'+
'^FD[LINE10]<br>'+
'^FS<br>'+
'^XZ<br>';
return zpl;
  }

  WriteZPL(selectedData:PrintModel[])
  {
    var finalPrintZPL='';
    selectedData.forEach(element => {
  var printZPL=this.DesignZPL();
  printZPL=printZPL.replace('[RFID]',element.serialNumber);
  printZPL=printZPL.replace('[BARCODE]',element.serialNumber);
  printZPL=printZPL.replace('[BARCODE]',element.serialNumber);
  printZPL=printZPL.replace('[LINE2]',element.itemCode);
  printZPL=printZPL.replace('[LINE3]',element.goldWeight.toString() + ' g');
  finalPrintZPL += printZPL;
});
    let printContents, popupWin;
   // printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin?.document.open();
    popupWin?.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${finalPrintZPL}</body>
      </html>`
    );
    popupWin?.document.close();
  }

  PrintTag()
  {
    debugger
    this.submitted=true;
    let selectedNodes = this.agGrid.api.getSelectedNodes();
    let selectedData = selectedNodes.map<PrintModel>(node => node.data);
    // selectedData.forEach(element => {
    //   var index=this.printList.findIndex(p=>p.serialNumber==element.serialNumber && p.itemCode==element.itemCode);
    //   this.printList.splice(index,1);
    // });
    
    let saveResponse: Observable<any>;
    saveResponse = this.printService.updatePrint(selectedData);
    saveResponse.subscribe(
      result => {
        this.submitted = false;
        selectedData.forEach(element => {
          var index=this.printList.findIndex(p=>p.serialNumber==element.serialNumber && p.itemCode==element.itemCode);
          this.printList.splice(index,1);
        });
        this.WriteZPL(selectedData);
        this.agGrid.api.setRowData(this.printList);
        this.agGrid.api.redrawRows();
      },
      err => {
        this.printSaleError = err.error ? err.error : err.message;
      }
    );
  }

  RePrintTag()
  {
    this.submitted=true;
    let selectedNodes = this.agGridReprint.api.getSelectedNodes();
    let selectedData = selectedNodes.map<PrintModel>(node => node.data);
    let saveResponse: Observable<any>;
    saveResponse = this.printService.updatePrint(selectedData);
    saveResponse.subscribe(
      result => {
        this.submitted = false;
        this.WriteZPL(selectedData);
      },
      err => {
        this.printSaleError = err.error ? err.error : err.message;
      }
    );
  }

}
