import { ReceiptItemsLine } from "./ReceiptItemsLine";

export class ReceiptMasterModel {
    receiptId!: string;
    refDocumentType!: string;
    refDocumentNo!: string;
    refDocumentDate!: Date;
    receiptDate!: Date;
    supplierId!: number;
    itemLines!: ReceiptItemsLine[];
    isDeleted!: boolean;
    receiptStatus!: number;
}