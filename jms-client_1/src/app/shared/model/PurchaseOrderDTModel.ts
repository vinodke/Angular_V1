export class PurchaseOrderDTModel{
    poNumber!: string;
    poLineNumber!: string;
    itemID!: number;
    orderQty!: number;
    uomid!: number;
    lineStatus!: number;
    isDeleted!: boolean;
    itemName!: string;
    itemDesc!: string;
    uomName!: string;
    metalWeight!:number;
    stoneWeight!:number;
}