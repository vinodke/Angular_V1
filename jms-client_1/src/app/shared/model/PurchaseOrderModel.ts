import { PurchaseOrderDTModel } from "./PurchaseOrderDTModel";

export class PurchaseOrderModel {
    poNumber!: string;
    poType!: string;
    poDate!: Date;
    supplierID!: number;
    status!: number;
    remarks!: string;
    supplierName!:string;
    itemLines!: PurchaseOrderDTModel[];
    isDeleted!: boolean;
    fromDate!:Date;
    toDate!:Date;
    totalPurchaseQty!:number;
    recWareHouseID!:number;
    recWarehouseName!:string;
}