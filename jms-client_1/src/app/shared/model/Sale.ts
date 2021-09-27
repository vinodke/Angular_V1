import { SalePaymentMethods } from "./SalePaymentMethods";
import { SaleSub } from "./SaleSub";

export class Sale {
    invoiceNo !:string;
   invoiceDate !:Date;
    customerID !:number;
    customerCode!:string;
    customerName!:string;
    remarks!:string;
    warehouseID!:number;
    warehouseCode!:string;
    warehouseName!:string;
    salesManID!:number;
    salesManCode!:string;
    salesManName!:string;
    cashCounterID!:number;
    cashCounterName!:string;
    saleSub !: SaleSub[];
    salePaymentMethods !: SalePaymentMethods[];
}

export class ItemListDTO {
    serialNumber!:string;
    itemID!:number;
    itemCode!:string;
    itemName!:string;
    priceWithoutTax:number=0;
    labourCharge:number=0;
    labourTax:number=0;
    itemTax:number=0;
    itemTaxAmount:number=0;
    labourTaxAmount:number=0;
    qty!:number;
    goldWeight:number=0;
    stoneWeight:number=0;
    goldPrice:number=0;
    discountPercentage:number=0;
    discountAmount:number=0;
    discountTotalAmount:number=0;
}

export class ItemAddedListDTO {
    serialNumber!:string;
    itemID!:number;
    itemCode!:string;
    itemName!:string;
    priceWithoutTax:number=0;
    constPriceWithoutTax:number=0;
    labourCharge:number=0;
    constLabourCharge:number=0;
    labourTax:number=0;
    itemTax:number=0;
    qty!:number;
    TotalPrice:number=0;
    TotalTax:number=0;
    grossAmount:number=0;
    Price:number=0;
    constPrice:number=0;
    taxAmount:number=0;
    goldWeight:number=0;
    stoneWeight:number=0;
    goldPrice:number=0;
    discountPercentage:number=0;
    discountAmount:number=0;
    discountTotalAmount:number=0;
    itemTaxAmount:number=0;
    labourTaxAmount:number=0;
}