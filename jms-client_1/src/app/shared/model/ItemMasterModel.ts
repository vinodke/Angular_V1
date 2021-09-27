export class ItemMasterModel {
    id!: number;
    itemName!: string;
    itemDesc!: string;
    itemCode!: string;
    itemReqQty!: number;
    labourCharge!: number;
    mrp!: number;
    gender!:string;
    makingChargeMin!: number;
    makingChargeMax!: number;
    categoryID!: number;
    categoryName!: string;
    subCategoryID!: number;
    subCategoryName!: string;
    karatID!: number;
    karatName!: string;
    uomid!: number;
    uomName!: string;
    colorID!: number;
    colorName!: string;
    expiryValue!: string;
    expiryPeriod!: number;
    emarladWeight!: number;
    grossWeight!: number;
    stoneWeight!: number;
    remarks!: string;
    itemCollectionID!: number;
    itemCollectionName!: string;
    itemFamilyID!: number;
    itemFamilyName!: string;
    itemGroupID!: number;
    itemGroupName!: string;
    itemBrandID!: number;
    itemBrandName!: string;
    imageList:File[]=[];
    itemSubList:ItemSubModel[]=[];
}

export class ItemSubModel {
  itemID!: number;
  imageFileName!: string;
  imageFilePath!:string;
  itemImage!:string;
}