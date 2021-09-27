import { ReceiptDetailsModel } from "./ReceiptDetailsModel";

export class ReceiptModel {
    receiptNumber!: string;
    receiptType!: string;
    receiptDate!: Date;
    status!:number;
    supplierInvoiceNo!: string;
    supplierInvoiceDate!: Date;
    warehouseID!: number;
    remarks!: string;
    reference1Type!:string;
    reference1Value!:string;
    reference2Type!:string;
    reference2Value!:string;
    reference3Type!:string;
    reference3Value!:string;
    receiptDetails!: ReceiptDetailsModel[];
    isDeleted!: boolean;
    fromDate!:Date;
    toDate!:Date;
    extReceiptNo!:string;
    exportStatus!:string;
    exportDate!:Date;
    exportMessage!:string;
    warehouseName!:string;
    // documentList:File[]=[];
    supplierID!:number;
    supplierName!:string;
    poDate!:Date;
    poNumber!:string;
    fromWarehouseID!:number;
    fromWarehouseName!:string;
    transferDate!:Date;
    SupplierInvoiceDate!:Date;
}

export class POReceiptFilter
{
    poNumber!:string;
    supplierID!:number;
    receiptNumber!:string;
    fromDate!:Date;
    toDate!:Date;
    fromWarehouseID!:number;
    status!:number;
    receiptType!:string;
}