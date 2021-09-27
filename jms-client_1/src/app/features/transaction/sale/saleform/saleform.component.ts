import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { cashcountermasterservice } from '../../../../core/service/cashcountermaster.service';
import { customerMasterService } from '../../../../core/service/customermaster.service';
import { EmployeeMasterService } from '../../../../core/service/employeemaster.service';
import { paymentmethodService } from '../../../../core/service/paymentmethod.service';
import { saleService } from '../../../../core/service/sale.service';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { ModalService } from '../../../../core/_modal';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { CashCounterMasterModel } from '../../../../shared/model/CashCounterMasterModel';
import { CustomerMasterModel } from '../../../../shared/model/CustomerMasterModel';
import { EmployeeMasterModel } from '../../../../shared/model/EmployeeMasterModel';
import { PaymentMethodModel } from '../../../../shared/model/PaymentMethodModel';
import { ItemAddedListDTO, ItemListDTO, Sale } from '../../../../shared/model/Sale';
import { SalePaymentMethods } from '../../../../shared/model/SalePaymentMethods';
import { SaleSub } from '../../../../shared/model/SaleSub';
import { WarehouseMasterModel } from '../../../../shared/model/WarehouseMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-saleform',
  templateUrl: './saleform.component.html',
  styleUrls: ['./saleform.component.scss']
})
export class SaleformComponent implements OnInit {
  isPaytoContinue:boolean=false;
  isitemexpanded:boolean=false;
  iscustomerexpanded:boolean=false;
ismoreactions:boolean=false;
paymentMethods!:PaymentMethodModel[];
paymentMethodsCache!:PaymentMethodModel[];
warehouses:WarehouseMasterModel[]=[];
warehousesCache:WarehouseMasterModel[]=[];
employees:EmployeeMasterModel[]=[];
employeesCache:EmployeeMasterModel[]=[];
cashcounters:CashCounterMasterModel[]=[];
cashcountersCache:CashCounterMasterModel[]=[];
rowData!:ItemListDTO[];
rowAddData!:ItemAddedListDTO[];
columnItemDefs: any;
columnCustomerDefs: any;
ItemsListLine!:ItemListDTO;
ItemsAddedLine!:ItemAddedListDTO;
columnItemAddDefs:any;
customerList!:CustomerMasterModel[];
customerSelected!:CustomerMasterModel;
saleForm: FormGroup;
SubTotal!:number;
discountTotalDis!:number;
submitted:boolean=false;
TaxAmount!:number;
totalItems!:number;
saleModel:Sale=new Sale;
saleSub:SaleSub[]=[];
saleSubModel:SaleSub=new SaleSub;
salePaymentMethods:SalePaymentMethods[]=[];
salePaymentMethodsModel:SalePaymentMethods=new SalePaymentMethods;
itemAdded:boolean=false;
warehouseID!:any;
customernotselected:boolean=false;
completeSaleError = '';
error:string='';
payItemError = '';
itemError:string='';
@ViewChild('agGrid') agGrid!: AgGridAngular;
@ViewChild('agItemAddGrid') agItemAddGrid!: AgGridAngular;
@ViewChild('agCustomerGrid') agCustomerGrid!: AgGridAngular;
  constructor(private modalService:ModalService,
    private customermasterservice: customerMasterService,private formBuilder: FormBuilder,
    private saleservice:saleService,private paymentmethodsService:paymentmethodService
    ,private employeemasterservice:EmployeeMasterService, private warehousemasterservice:warehousemasterservice,
    private Cashcountermasterservice:cashcountermasterservice,private saveAlert: SaveAlert) {
      this.saleForm = this.formBuilder.group({
      SearchCustomer: [null],
      SearchItem: [null],
      WarehouseSelCode:[null,Validators.required],
      EmployeeSelCode:[null,Validators.required],
      CashCounterSelCode:[null,Validators.required],
      DiscountPercentage: [null],
      DiscountAmount:[null],
      GoldWeight:[null],
      StoneWeight:[null],
      AmounttoPay:[null]
    });
     }

     RemoveItem(index:number)
     {
       this.rowAddData.splice(index,1);
       this.calculateTotal(this.rowAddData);
       if(this.rowAddData.length<=0)
       {
         this.itemAdded=false;
       }
     }

  async ngOnInit() {

    $('.select2bs4').select2();
    $('[name="WarehouseSelCode"]').on("change",  () => {
     this.saleFormControls.WarehouseSelCode.setValue($('[name="WarehouseSelCode"]').val());
     this.warehouseID=$('[name="WarehouseSelCode"]').val();
     this.addSelectList();
    });
    $('[name="CashCounterSelCode"]').on("change",  () => {
      this.saleFormControls.CashCounterSelCode.setValue($('[name="CashCounterSelCode"]').val());
     });
     $('[name="EmployeeSelCode"]').on("change",  () => {
      this.saleFormControls.EmployeeSelCode.setValue($('[name="EmployeeSelCode"]').val());
     });
     this.warehouseID=localStorage.getItem('warehouseID');
     this.warehouses=await this.warehousemasterservice.getWarehouseMaster();
     this.saleFormControls.WarehouseSelCode.setValue(localStorage.getItem('warehouseID'));
      this.addSelectList();
    this.SubTotal=0.00;
    this.TaxAmount=0.00;
    this.rowData=[];
    this.rowAddData=[];
    this.columnItemDefs = [
      { headerName:'Tag No', field: 'serialNumber', sortable: true, filter: true, resizable: true},
      { headerName:'Item Code', field: 'itemCode', sortable: true, filter: true, resizable: true},
      { headerName:'Item Name', field: 'itemName', sortable: true, filter: true, resizable: true},
      { headerName:'PriceWithoutTax', field: 'priceWithoutTax', sortable: true, filter: true, resizable: true,width:250,hide: true,
      suppressToolPanel: true},
      { headerName:'LabourCharge', field: 'labourCharge', sortable: true, filter: true, resizable: true,width:250,hide: true,
      suppressToolPanel: true},
      { headerName:'LabourTax', field: 'labourTax', sortable: true, filter: true, resizable: true,width:250,hide: true,
      suppressToolPanel: true},
      { headerName:'ItemTax', field: 'itemTax', sortable: true, filter: true, resizable: true,width:250,hide: true,
      suppressToolPanel: true},
      { headerName:'ItemID', field: 'itemID', sortable: true, filter: true, resizable: true,width:250,hide: true,
      suppressToolPanel: true},
      { headerName:'Gold Weight', field: 'goldweight', sortable: true, filter: true, resizable: true,width:250,hide: true,
      suppressToolPanel: true},
      { headerName:'Stone Weight', field: 'stoneWeight', sortable: true, filter: true, resizable: true,width:250,hide: false,
      suppressToolPanel: false},
      
     ];

     this.columnCustomerDefs = [
      { headerName:'Customer Code', field: 'customerCode', sortable: true, filter: true, resizable: true, },
      { headerName:'Customer Name', field: 'customerName', sortable: true, filter: true, resizable: true,},
      { headerName:'Contact No', field: 'contactNumber', sortable: true, filter: true, resizable: true},
      { headerName:'Email', field: 'emailID', sortable: true, filter: true, resizable: true},
     ];

     this.columnItemAddDefs = [
      { headerName:'Item Code', field: 'itemCode', sortable: true, filter: true, resizable: true,width:200 },
      { headerName:'Item Name', field: 'itemName', sortable: true, filter: true, resizable: true,width:250},
      { headerName:'Qty', field: 'qty', sortable: true, filter: true, resizable: true,width:150,editable:true},
      { headerName:'Price', field: 'price', sortable: true, filter: true, resizable: true,width:150},
      { headerName:'Tax Amount', field: 'taxAmount', sortable: true, filter: false, resizable: true,width:150},
     ];
  }
  loading:boolean=false;
  completeSale()
  {
    this.completeSaleError='';
    if(this.rowAddData.length<=0)
    {
      this.completeSaleError='No item added for sale';
      return;
    }
    if(this.salePaymentMethods.length<=0)
    {
      this.completeSaleError='Please add payment method details';
      return;
    }
    if(this.customerID==0 || this.customerID==null)
    {
      this.completeSaleError='Please select customer';
      return;
    }
    let saveResponse: Observable<any>;
    this.loading = true;
    this.saleModel =new Sale;
    this.saleModel.customerID=this.customerSelected.id;
    this.saleModel.customerName=this.customerSelected.customerName;
    this.saleModel.invoiceNo='';
    this.saleModel.customerCode=this.customerSelected.customerCode;
    this.saleModel.cashCounterID=this.saleFormControls.CashCounterSelCode.value;
    this.saleModel.cashCounterName=this.cashcountersCache.filter(item=>item.id==this.saleFormControls.CashCounterSelCode.value)[0].cashCounterName;
    this.saleModel.salesManID=this.saleFormControls.EmployeeSelCode.value;
    this.saleModel.salesManCode=this.employeesCache.filter(item=>item.id==this.saleFormControls.EmployeeSelCode.value)[0].employeeCode;
    this.saleModel.salesManName=this.employeesCache.filter(item=>item.id==this.saleFormControls.EmployeeSelCode.value)[0].employeeName;
    this.saleModel.warehouseID=this.saleFormControls.WarehouseSelCode.value;
    console.log(this.warehousesCache);
    this.saleModel.warehouseCode=this.warehouses.filter(item=>item.id==this.saleFormControls.WarehouseSelCode.value)[0].warehouseCode;
    this.saleModel.warehouseName=this.warehouses.filter(item=>item.id==this.saleFormControls.WarehouseSelCode.value)[0].warehouseName;
    this.saleSub=[];
    this.rowAddData.forEach(element => {
      this.saleSubModel=new SaleSub;
      this.saleSubModel.invoiceNo='';
      this.saleSubModel.itemID=element.itemID;
      this.saleSubModel.itemCode=element.itemCode;
      this.saleSubModel.itemName=element.itemName;
      this.saleSubModel.serialNumber=element.serialNumber;
      this.saleSubModel.qty=1;
      this.saleSubModel.stoneWeight=element.stoneWeight;
      this.saleSubModel.goldWeight=element.goldWeight;
      this.saleSubModel.discountAmount=element.discountAmount;
      this.saleSubModel.discountPercentage=element.discountPercentage;
      this.saleSubModel.itemVat=element.itemTax;
      this.saleSubModel.itemVatAmount=element.itemTaxAmount;
      this.saleSubModel.labourVat=element.labourTax;
      this.saleSubModel.labourVatAmount=element.labourTaxAmount;
      this.saleSubModel.grossAmount=element.grossAmount;
      this.saleSubModel.finalAmount=element.TotalPrice;
      this.saleSub.push(this.saleSubModel);
    });
    this.saleModel.saleSub=this.saleSub;
    this.saleModel.salePaymentMethods=this.salePaymentMethods;
    console.log(this.saleModel);
    saveResponse = this.saleservice.addSale(this.saleModel);
    saveResponse.subscribe(
      result => {
        
        this.saveAlert.SuccessMessage();
        this.submitted = false;
        this.loading = false;
        this.clearContents();
      },
      err => {
        this.completeSaleError = err.error ? err.error : err.message;
        this.loading = false;
      }
    );
  }

  get saleFormControls() { return this.saleForm.controls; }

  clearContents()
  {
    this.salePaymentMethods=[];
    this.saleSub=[];
    this.saleModel=new Sale;
    this.ItemsAddedLine=new ItemAddedListDTO;
    this.rowAddData=[];
    this.rowData=[];
this.customerSelected=new CustomerMasterModel;
this.customerID=0;
this.saleFormControls.EmployeeSelCode.setValue('');
this.saleFormControls.AmounttoPay.setValue('');
this.isPaytoContinue=false;
this.SubTotal=0;
this.discountTotalDis=0;
this.TaxAmount=0;
this.saleFormControls.SearchCustomer.setValue('');
this.totalItems=0;
$('[name="EmployeeSelCode"]').select2().trigger('change');

  }

  async selectPaymentMethod()
  {
    this.submitted=true;
    this.payItemError='';
    if(this.customerSelected==null)
    {
      this.customernotselected=true;
      this.payItemError='Please select customer';
      return;
    }
    if(this.rowAddData.length<=0)
    {
      this.payItemError='Please add items to continue';
      return;
    }
    this.salePaymentMethods=[];
    if(this.saleForm.valid)
    {
    this.saleFormControls.AmounttoPay.setValue(this.SubTotal.toString());
    this.isPaytoContinue=true;
    this.calculatePaymentLeft(this.SubTotal,0);
    }
  }
  async addSelectList()
  {
    this.employeesCache=await this.employeemasterservice.getEmployeeMaster();
this.cashcountersCache=await this.Cashcountermasterservice.getCashCounterMaster();
this.employees=this.employeesCache.filter(item=>item.warehouseID==this.warehouseID)
this.cashcounters=this.cashcountersCache.filter(item=>item.warehouseID==this.warehouseID)
    this.paymentMethodsCache=await this.paymentmethodsService.getPaymentMethod();
    this.paymentMethods=this.paymentMethodsCache.filter(item=>item.warehouseID==this.warehouseID)
  }
  IntcalculatePaymentLeft()
  {
    if(this.salePaymentMethods.length<=0)
    this.calculatePaymentLeft(this.SubTotal,this.saleFormControls.AmounttoPay.value);
    else
    {
      let recievedAmountSum: number = this.salePaymentMethods.map(a => a.recievedAmount).reduce(function(a, b)
      {
        return parseFloat(a.toString()) + parseFloat(b.toString());
      });
      this.calculatePaymentLeft(this.SubTotal,parseFloat(this.saleFormControls.AmounttoPay.value)+parseFloat(recievedAmountSum.toString()));
    }
  }
  paymentMethodClicked(paymentData:PaymentMethodModel)
  {
    this.completeSaleError='';
this.salePaymentMethodsModel=new SalePaymentMethods;
this.salePaymentMethodsModel.paymentMethodID=paymentData.id;
this.salePaymentMethodsModel.paymentMethodName=paymentData.paymentMethodName;
this.salePaymentMethodsModel.recievedAmount=this.saleFormControls.AmounttoPay.value;
this.salePaymentMethods.push(this.salePaymentMethodsModel);
let recievedAmountSum: number = this.salePaymentMethods.map(a => a.recievedAmount).reduce(function(a, b)
      {
        return parseFloat(a.toString()) + parseFloat(b.toString());
      });
this.saleFormControls.AmounttoPay.setValue(this.SubTotal- recievedAmountSum);
this.calculatePaymentLeft(this.SubTotal,recievedAmountSum);
  }
  RemovePayMethod(salePaymentMethods1:SalePaymentMethods, index:number)
  {
    this.salePaymentMethods.splice(index,1);
    let recievedAmountSum: number=0;
    if(this.salePaymentMethods.length>0)
    {
      recievedAmountSum= this.salePaymentMethods.map(a => a.recievedAmount).reduce(function(a, b)
      {
        return parseFloat(a.toString()) + parseFloat(b.toString());
      });
    }
    else
    {
    this.saleFormControls.AmounttoPay.setValue(this.SubTotal);
    recievedAmountSum=0;
    }
    
    this.calculatePaymentLeft(this.SubTotal,parseFloat(recievedAmountSum.toString()));
    this.saleFormControls.AmounttoPay.setValue(this.amounttopay);
  }
  isAmounttoPayInvalid:boolean=false;
  isAmounttoPayCompleted:boolean=false;
  calculatePaymentLeft(balanceamount:number,recievedAmount:number)
  {
    this.isAmounttoPayInvalid=false;
    if(this.saleFormControls.AmounttoPay.value==0 || this.saleFormControls.AmounttoPay.value==null || this.saleFormControls.AmounttoPay.value=='')
    {
      this.isAmounttoPayInvalid=true;
    }
if(this.saleFormControls.AmounttoPay.value==this.SubTotal)
{
  this.amounttopaytext='Edit to make a partial payment.';
  this.amounttopay=this.SubTotal;
}
else if((balanceamount)>this.SubTotal)
{
  this.amounttopaytext='Payment exceeded than expected!';
  this.isAmounttoPayInvalid=true;
}
else
{
  this.amounttopay=(balanceamount-recievedAmount);
  if(this.amounttopay==0)
  {
    this.isAmounttoPayInvalid=false;
  }
  this.amounttopaytext='SAR ' + this.amounttopay + ' left to pay'
}
  }
  BacktoInvoice()
  {
    this.isPaytoContinue=false;
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }
  iscustomer:boolean=false;
  showForm(id: string,btnid:string)
  {
    this.iscustomer=false;
    if(btnid=="customer")
    this.iscustomer=true;
    this.modalService.open(id);
  }

  MoreActions()
  {
    this.ismoreactions=!this.ismoreactions;
  }

  enterStoneWeight(event:any)
  {
    this.stonenonnumber=false;
    if(isNaN(event.target.value))
    {
      this.stonenonnumber=true;
    }
  }
  goldnonnumber:boolean=false;
  stonenonnumber:boolean=false;
  discountpercnumber:boolean=false;
  discountamountnumber:boolean=false;
  UpdateRowItem(selectedData:ItemAddedListDTO,index:number)
  {
    selectedData.goldWeight=$('#goldWeight-' + index).val()==null ||$('#goldWeight-' + index).val()=='' ? 0 :$('#goldWeight-' + index).val();
    selectedData.stoneWeight=$('#stoneWeight-' + index).val()==null ||$('#stoneWeight-' + index).val()=='' ? 0 :$('#stoneWeight-' + index).val();
    selectedData.discountPercentage=$('#discountPerc-' + index).val()==null ||$('#discountPerc-' + index).val()=='' ? 0 :$('#discountPerc-' + index).val();
    selectedData.discountAmount=$('#discountAmount-' + index).val()==null ||$('#discountAmount-' + index).val()=='' ? 0 :$('#discountAmount-' + index).val();
        this.CalculateLineTotal(selectedData);
        this.rowAddData[index]=this.ItemsAddedLine;
        this.calculateTotal(this.rowAddData);
  }
  enterGoldWeight(event:any,selectedData:ItemAddedListDTO,index:number)
  {
    if(!isNaN(event.target.value))
    {
      this.goldnonnumber=false;
      // if(event.target.value>0)
      // {
      //   selectedData.goldWeight=event.target.value;
      //   this.AddandcalculateLineTotal(selectedData);
      //   this.rowAddData[index]=this.ItemsAddedLine;
      //   this.calculateTotal(this.rowAddData);
      // }

    }
   else
   {
    this.goldnonnumber=true;
     //alert("Please enter numeric");
   }
  }
  enterDiscountPercentage(event:any,selectedData:ItemAddedListDTO,index:number)
  {
    if(!isNaN(event.target.value))
    {
      this.discountpercnumber=false;
      // if(event.target.value>0)
      // {
      //   selectedData.discountPercentage=event.target.value;
      //   selectedData.discountAmount=0;
      //   this.AddandcalculateLineTotal(selectedData);
      //   this.rowData[index]=this.ItemsAddedLine;
      //   this.calculateTotal(this.rowAddData);
      // }

    }
   else
   {
    this.discountpercnumber=true;
   }
  }

  enterDiscountAmount(event:any,selectedData:ItemAddedListDTO,index:number)
  {
    if(!isNaN(event.target.value))
    {
      this.discountamountnumber=false;
      // if(event.target.value>0)
      // {
      //   selectedData.discountAmount=event.target.value;
      //   selectedData.discountPercentage=0;
      //   this.AddandcalculateLineTotal(selectedData);
      //   this.rowData[index]=this.ItemsAddedLine;
      //   this.calculateTotal(this.rowAddData);
      // }

    }
   else
   {
    this.discountamountnumber=true;
   }
  }

  calculateTotal(itemsAdded:ItemAddedListDTO[])
  {
    if(this.rowAddData.length>0)
    {
      let sumPrice: number = this.rowAddData.map(a => a.TotalPrice).reduce(function(a, b)
      {
        return a + b;
      });
      let sumTax: number = this.rowAddData.map(a => a.TotalTax).reduce(function(a, b)
      {
        return a + b;
      });
      let discountTotal: number=0;
      this.rowAddData.forEach(element => {
        discountTotal+= parseFloat(element.discountTotalAmount.toString());
      });
     
      this.discountTotalDis=+discountTotal;
          this.SubTotal=+sumPrice.toFixed(2);
          this.TaxAmount=+sumTax.toFixed(2);
          this.totalItems=this.rowAddData.length;
          
    }
    else
    {
      this.SubTotal=0;
          this.TaxAmount=0;
          this.totalItems=0;
          this.discountTotalDis=0;
    }
    
  }

  CalculateLineTotal(selectedData:ItemAddedListDTO)
  {
    this.ItemsAddedLine=selectedData;
    selectedData.labourCharge=selectedData.constLabourCharge;
    if(selectedData.goldWeight>0)
    {
      this.ItemsAddedLine.priceWithoutTax= +((selectedData.goldPrice/1000)*(selectedData.goldWeight*1000)).toFixed(2);
    }
    else
    this.ItemsAddedLine.priceWithoutTax=selectedData.goldPrice;
    this.ItemsAddedLine.discountPercentage=selectedData.discountPercentage;
    this.ItemsAddedLine.discountAmount=selectedData.discountAmount;
    if(selectedData.discountPercentage>0)
    {
      selectedData.discountTotalAmount=+((selectedData.constLabourCharge*selectedData.discountPercentage)/100).toFixed(2);
      selectedData.labourCharge=selectedData.constLabourCharge-selectedData.discountTotalAmount;
      this.ItemsAddedLine.discountAmount=selectedData.discountTotalAmount;
      this.ItemsAddedLine.discountTotalAmount=selectedData.discountTotalAmount;
    }
    else
    {
      this.ItemsAddedLine.discountTotalAmount=0;
    }
    if(selectedData.discountAmount>0)
    {
      selectedData.discountTotalAmount=selectedData.discountAmount;
      selectedData.labourCharge=+(selectedData.constLabourCharge-selectedData.discountAmount).toFixed(2);
      this.ItemsAddedLine.discountTotalAmount=selectedData.discountTotalAmount;
    }
    else
    {
      this.ItemsAddedLine.discountTotalAmount=0;
    }
    var itemTaxAmount =( this.ItemsAddedLine.priceWithoutTax * selectedData.itemTax)/100;
    var labourTaxamount=(selectedData.labourCharge*selectedData.labourTax)/100;
    var actualLabourTax=(selectedData.constLabourCharge*selectedData.labourTax)/100;
    var totalTax= (itemTaxAmount + labourTaxamount)
    var TotalPrice=( this.ItemsAddedLine.priceWithoutTax + totalTax + selectedData.labourCharge);
    var grossPrice=(parseFloat(this.ItemsAddedLine.priceWithoutTax.toString()) + parseFloat(itemTaxAmount.toString()) + parseFloat(actualLabourTax.toString()) + parseFloat(selectedData.constLabourCharge.toString()) );
    this.ItemsAddedLine.TotalPrice=+TotalPrice.toFixed(2);
    this.ItemsAddedLine.Price=+TotalPrice.toFixed(2);
    this.ItemsAddedLine.grossAmount=grossPrice;
    this.ItemsAddedLine.itemTax=selectedData.itemTax;
    this.ItemsAddedLine.labourCharge=selectedData.labourCharge;
    this.ItemsAddedLine.labourTax=selectedData.labourTax;
    this.ItemsAddedLine.labourTaxAmount=labourTaxamount;
    this.ItemsAddedLine.itemTaxAmount=itemTaxAmount;
    this.ItemsAddedLine.TotalTax=totalTax;
    this.ItemsAddedLine.taxAmount=totalTax;
  }

  AddLine(selectedData:any)
  {
    this.ItemsAddedLine=new ItemAddedListDTO;
    this.ItemsAddedLine.itemCode=selectedData.itemCode;
    this.ItemsAddedLine.itemID=selectedData.itemID;
    this.ItemsAddedLine.itemName=selectedData.itemName;
    this.ItemsAddedLine.qty=selectedData.qty;
    this.ItemsAddedLine.serialNumber=selectedData.serialNumber;
    this.ItemsAddedLine.goldWeight=selectedData.goldWeight;
    this.ItemsAddedLine.stoneWeight=selectedData.stoneWeight;
    this.ItemsAddedLine.goldPrice=selectedData.priceWithoutTax;
    this.ItemsAddedLine.constLabourCharge=selectedData.labourCharge;
    this.ItemsAddedLine.itemTax=selectedData.itemTax;
    this.ItemsAddedLine.labourTax=selectedData.labourTax;
    this.ItemsAddedLine.priceWithoutTax=selectedData.priceWithoutTax;
    this.ItemsAddedLine.stoneWeight=selectedData.stoneWeight;
    this.ItemsAddedLine.goldWeight=selectedData.goldWeight;
    this.ItemsAddedLine.labourCharge=selectedData.labourCharge;
    this.CalculateLineTotal(this.ItemsAddedLine);
    this.rowAddData.push(this.ItemsAddedLine);
  }

  onRowClick(event: any)
  {
    this.itemError='';
    this.itemAdded=true;
    this.ItemsListLine=new ItemListDTO;
    this.ItemsListLine = this.agGrid.api.getSelectedRows()[0];
    this.ItemsListLine.qty=1;
    console.log(this.ItemsListLine);
    var listData=this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID && item.serialNumber==this.ItemsListLine.serialNumber)[0];
    if(listData!=null)
    {
      this.itemError='Tag already added';
      // alert('')
        return;
      // if(serialExist!=null)
      // {
        
      // }
      // this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].qty++;
      // this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].serialNumber.push(this.ItemsListLine.serialNumber);
      // this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].TotalPrice= this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].qty *  this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].Price;
      // this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].TotalTax= this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].qty *  this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].taxAmount;
      // alert(this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].serialNumber);
    }
    else
    {
      this.AddLine(this.ItemsListLine);
    }
    this.calculateTotal(this.rowAddData);
    // this.agItemAddGrid.api.setRowData(this.rowAddData);
    // this.agItemAddGrid.api.redrawRows();
    this.isitemexpanded=false;
    this.saleFormControls.SearchItem.setValue('');
  }

  onEnterClick(data: ItemListDTO)
  {
    this.itemAdded=true;
    this.ItemsListLine=new ItemListDTO;
    this.ItemsListLine = data;
    this.ItemsListLine.qty=1;
    this.itemError='';
    this.ItemsListLine.goldPrice=this.ItemsListLine.priceWithoutTax;
    // this.ItemsAddedLine.constLabourCharge=this.ItemsListLine.labourCharge;
    console.log(this.ItemsListLine);
    var listData=this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID && item.serialNumber==this.ItemsListLine.serialNumber)[0];
    if(listData!=null)
    {
      this.itemError='Tag already added';
      // alert('Already added')
        return;
      // if(serialExist!=null)
      // {
        
      // }
      // this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].qty++;
      // this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].serialNumber.push(this.ItemsListLine.serialNumber);
      // this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].TotalPrice= this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].qty *  this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].Price;
      // this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].TotalTax= this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].qty *  this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].taxAmount;
      // alert(this.rowAddData.filter(item=>item.itemID==this.ItemsListLine.itemID)[0].serialNumber);
    }
    else
    {
      // this.ItemsAddedLine=new ItemAddedListDTO;
      // this.ItemsAddedLine.itemCode=this.ItemsListLine.itemCode;
      // this.ItemsAddedLine.itemID=this.ItemsListLine.itemID;
      // this.ItemsAddedLine.itemName=this.ItemsListLine.itemName;
      // this.ItemsAddedLine.qty=this.ItemsListLine.qty;
      // this.ItemsAddedLine.goldWeight=this.ItemsListLine.goldWeight;
      // this.ItemsAddedLine.stoneWeight=this.ItemsListLine.stoneWeight;
      // this.ItemsAddedLine.serialNumber=this.ItemsListLine.serialNumber;
      // if(this.ItemsAddedLine.goldWeight>0)
      // {
      //   this.ItemsListLine.priceWithoutTax= +((this.ItemsListLine.goldPrice/1000)*(this.ItemsAddedLine.goldWeight*1000)).toFixed(2);
      // }
      // const itemTaxAmount =(this.ItemsListLine.priceWithoutTax * this.ItemsListLine.itemTax)/100;
      // const labourTax=(this.ItemsListLine.labourCharge*this.ItemsListLine.labourTax)/100;
      // const totalTax= (itemTaxAmount + labourTax)
      // const TotalPrice=(this.ItemsListLine.priceWithoutTax + totalTax);
      // this.ItemsAddedLine.TotalPrice=+TotalPrice.toFixed(2);
      // this.ItemsAddedLine.Price=+TotalPrice.toFixed(2);
      // this.ItemsAddedLine.itemTax=this.ItemsListLine.itemTax;
      // this.ItemsAddedLine.labourCharge=this.ItemsListLine.labourCharge;
      // this.ItemsAddedLine.labourTax=this.ItemsListLine.labourTax;
      // this.ItemsAddedLine.priceWithoutTax=this.ItemsListLine.priceWithoutTax;
      // this.ItemsAddedLine.TotalTax=totalTax;
      // this.ItemsAddedLine.taxAmount=totalTax;
      // this.rowAddData.push(this.ItemsAddedLine);
      this.AddLine(this.ItemsListLine);
      this.saleFormControls.SearchItem.setValue('');
    }
    this.calculateTotal(this.rowAddData);
    // this.agItemAddGrid.api.setRowData(this.rowAddData);
    // this.agItemAddGrid.api.redrawRows();
    this.isitemexpanded=false;
  }

  qtyEnter(event:any,index:number)
  {
    if(event.target.value!='')
    this.rowAddData[index].qty=event.target.value;
  }
customerID!:number;
CustomerSelected!:string;
amounttopaytext:string='Edit to make a partial payment.';
amounttopay!:number;
  onCustomerRowClick(event: any)
  {
    this.customerSelected=this.agCustomerGrid.api.getSelectedRows()[0];
    this.customerID=this.customerSelected.id;
    this.CustomerSelected=this.customerSelected.customerName + ' , ' + this.customerSelected.contactNumber;
    this.saleFormControls.SearchCustomer.setValue(this.CustomerSelected)
    this.iscustomerexpanded=false;
    this.customernotselected=false;
  }
  onAddRowClick(event:any)
  {

  }

 async toggleitem(event:any)
  {
    if(event.keyCode==13)
    {
      if(event.target.value!='')
      {
      this.rowData=await this.saleservice.getItemSearchList(event.target.value);
      console.log(this.rowData);
      if(this.rowData[0].serialNumber== event.target.value)
      {
        this.onEnterClick(this.rowData[0]);
      }
      else
      {
        this.isitemexpanded=true;
        this.agGrid.api.setRowData(this.rowData);
        this.agGrid.api.redrawRows();
      }
      }
  else
  this.isitemexpanded=false;
    }
    else
    {
      if(event.target.value!='')
      {
      this.rowData=await this.saleservice.getItemSearchList(event.target.value);
      this.isitemexpanded=true;
      console.log(this.rowData);
      this.agGrid.api.setRowData(this.rowData);
      this.agGrid.api.redrawRows();
      }
  else
  this.isitemexpanded=false;
    }
   
  }

  async togglecustomer(event:any)
  {
    this.customerList=[];
    if(event.target.value!='')
    {
this.iscustomerexpanded=true;
this.customerList=await this.customermasterservice.getCustomerList(event.target.value);
    this.agGrid.api.setRowData(this.rowData);
    this.agGrid.api.redrawRows();
    }
else
this.iscustomerexpanded=false;
  }

}
