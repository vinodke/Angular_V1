import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { SubCategoryMasterModel } from '../../../../shared/model/SubCategoryMasterModel';
import { ItemMasterModel, ItemSubModel } from '../../../../shared/model/ItemMasterModel';
import { CategoryMasterModel } from '../../../../shared/model/CategoryMasterModel';
import { UOMMasterModel } from '../../../../shared/model/UOMMasterModel';
import { itemMasterService } from '../../../../core/service/itemmaster.service';
import { categorymasterservice } from '../../../../core/service/categorymaster.service';
import { subcategorymasterservice } from '../../../../core/service/subcategorymaster.service';
import { uommasterservice } from '../../../../core/service/uommaster.service';
import { ItemCollectionMasterModel } from '../../../../shared/model/ItemCollectionMasterModel';
import { ItemFamilyMasterModel } from '../../../../shared/model/ItemFamilyMasterModel';
import { ItemGroupMasterModel } from '../../../../shared/model/ItemGroupMasterModel';
import { ItemBrandMasterModel } from '../../../../shared/model/ItemBrandMasterModel';
import { itemcollectionmasterservice } from '../../../../core/service/itemcollectionmaster.service';
import { itemfamilymasterservice } from '../../../../core/service/itemfamilymaster.service';
import { itemgroupmasterservice } from '../../../../core/service/itemgroupmaster.service';
import { itembrandmasterservice } from '../../../../core/service/itembrandmaster.service';
import { ColorMasterModel } from '../../../../shared/model/ColorMasterModel';
import { KaratMasterModel } from '../../../../shared/model/KaratMasterModel';
import { karatmasterservice } from '../../../../core/service/karatmaster.service';
import { colormasterservice } from '../../../../core/service/colormaster.service';
import { stringify } from '@angular/compiler/src/util';
import { ModalService } from '../../../../core/_modal';

declare var $: any;

@Component({
  selector: 'org-fat-itemmasterform',
  templateUrl: './itemmasterform.component.html',
  styleUrls: ['./itemmasterform.component.scss']
})
export class ItemmasterformComponent implements OnInit {
  _albums:any= [];
  itemmasterform: FormGroup;
  submitted = false;
  @Input() routetype:boolean=false; 
  SubCategoryCodes: SubCategoryMasterModel[] = [];
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  productId: number=0;
  error = '';
  editMode: boolean = false;
  viewMode: boolean = false;
  itemData!: ItemMasterModel;
  itemmastermodel: ItemMasterModel = new ItemMasterModel;
  categoryCodes: CategoryMasterModel[] = [];
  itemcollections: ItemCollectionMasterModel[] = [];
  itemfamily: ItemFamilyMasterModel[] = [];
  itemgroup: ItemGroupMasterModel[] = [];
  itembrand: ItemBrandMasterModel[] = [];
  uomcodes: UOMMasterModel[] = [];
  karatcodes: KaratMasterModel[] = [];
  colorcodes: ColorMasterModel[] = [];
  SubCategoryCodesSearchHolder: SubCategoryMasterModel[] = [];
  fileImageList: File[]=[];
 galleryImageList: ItemSubModel[] = [];


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private itemmasterservice: itemMasterService,
    private categoryMasterService: categorymasterservice,
    private subCategoryMasterService: subcategorymasterservice,
    private uommasterservice: uommasterservice,
    private itemcollectionmasterservice: itemcollectionmasterservice,
    private itemfamilymasterservice: itemfamilymasterservice,
    private itemgroupmasterservice: itemgroupmasterservice,
    private itembrandmasterservice: itembrandmasterservice,
    private karatmasterservice: karatmasterservice,
    private colormasterservice: colormasterservice,
    private saveAlert: SaveAlert,
    private modalService:ModalService) { 
    this.itemmasterform = this.formBuilder.group({
      CategorySelCode: [null],
      SubCategorySelCode: [null, Validators.required],
      UOMSelCode: [null,Validators.required],
      ItemCode: [null, Validators.required],
      ItemName: [null, Validators.required],
      ItemDesc: [null],
      KaratSelCode: [null],
      ColorSelCode: [null],
      Gender: [null,Validators.required],
      ItemCollectionSelCode: [null],
      ItemFamilySelCode: [null],
      ItemGroupSelCode: [null],
      ItemBrandSelCode: [null],
      ItemReqQty: [null],
      LabourCharge: [null],
      MakingChargeMin: [null],
      MakingChargeMax: [null],
      MRP: [null],
      Remarks: [null],
      EmarladWeight: [null],
      GrossWeight: [null],
      StoneWeight: [null],
      fileInputImage: [],
    });
  }

  async ngOnInit() {
    this.categoryCodes = await this.categoryMasterService.getCategoryMaster();
    this.uomcodes =  await this.uommasterservice.getUOMMaster();
    this.SubCategoryCodes =  await this.subCategoryMasterService.getSubCategoryMaster();
    this.SubCategoryCodesSearchHolder = this.SubCategoryCodes;
    this.karatcodes =  await this.karatmasterservice.getKaratMaster();
    this.colorcodes =  await this.colormasterservice.getColorMaster();
    this.itemcollections =  await this.itemcollectionmasterservice.getItemCollectionMaster();
    this.itemfamily =  await this.itemfamilymasterservice.getItemFamilyMaster();
    this.itemgroup =  await this.itemgroupmasterservice.getItemGroupMaster();
    this.itembrand =  await this.itembrandmasterservice.getItemBrandMaster();
console.log(this.categoryCodes);
    // $('[data-toggle="lightbox"]').on("click",  (e:any) => {
    //   e.preventDefault();
    //   $(this).ekkoLightbox({
    //     alwaysShowClose: true
    //   });
    //  });
    

    // $(function () {
    //   $(document).on('click', '[data-toggle="lightbox"]', function(e:any) {
    //     alert(1);
    //     e.preventDefault();
    //     this.ekkoLightbox({
    //       alwaysShowClose: true
    //     });
    //   });
  
      // $('.filter-container').filterizr({gutterPixels: 3});
      // $('.btn[data-filter]').on('click', function(e:any) {
      //   alert(2)
      //   $('.btn[data-filter]').removeClass('active');
      //   //this.addClass('active');
      // });
    // })
    
     this.route.params.subscribe(async params => {
        if(params['id'] != undefined) {
          this.productId = +params['id'];
          this.editMode = true;
          this.itemData = this.itemmasterservice.getItemMasterByKey(this.productId) as ItemMasterModel;
          await this.ShowEditViewItemMaster(this.itemData);
          if (params['state'] == 'view')
          {
            this.viewMode=true;
            this.disableControls();
          }
        } else {
          this.viewMode=false;
          this.editMode = false;
         
        }
    });

    $('.select2bs4').select2();

    $('[name="UOMSelCode"]').on("change",  () => {
      this.itemmasterformControls.UOMSelCode.setValue($('[name="UOMSelCode"]').val());
     });
     $('[name="Gender"]').on("change",  () => {
      this.itemmasterformControls.Gender.setValue($('[name="Gender"]').val());
     });

    $('[name="SubCategorySelCode"]').on("change",  () => {
     this.itemmasterformControls.SubCategorySelCode.setValue($('[name="SubCategorySelCode"]').val());
    });

     $('[name="CategorySelCode"]').on("change",  () => {
      this.itemmasterformControls.CategorySelCode.setValue($('[name="CategorySelCode"]').val());
      this.SubCategoryCodes = this.SubCategoryCodesSearchHolder.filter(x => x.categoryID == $('[name="CategorySelCode"]').val());
     });

     $('[name="KaratSelCode"]').on("change",  () => {
      this.itemmasterformControls.KaratSelCode.setValue($('[name="KaratSelCode"]').val());
     });

     $('[name="ColorSelCode"]').on("change",  () => {
      this.itemmasterformControls.ColorSelCode.setValue($('[name="ColorSelCode"]').val());
     });

     $('[name="ItemCollectionSelCode"]').on("change",  () => {
      this.itemmasterformControls.ItemCollectionSelCode.setValue($('[name="ItemCollectionSelCode"]').val());
     });

     $('[name="ItemFamilySelCode"]').on("change",  () => {
      this.itemmasterformControls.ItemFamilySelCode.setValue($('[name="ItemFamilySelCode"]').val());
     });

     $('[name="ItemGroupSelCode"]').on("change",  () => {
      this.itemmasterformControls.ItemGroupSelCode.setValue($('[name="ItemGroupSelCode"]').val());
     });

     $('[name="ItemBrandSelCode"]').on("change",  () => {
      this.itemmasterformControls.ItemBrandSelCode.setValue($('[name="ItemBrandSelCode"]').val());
     });


  }

  get itemmasterformControls() { return this.itemmasterform.controls; }

  ShowGrid(){
    this.router.navigateByUrl('/itemmaster');
  }

  closeModal() {
    this.modalService.close('custom-modal-2');
}

  disableControls() {
    this.itemmasterformControls.UOMSelCode.disable();
    this.itemmasterformControls.SubCategorySelCode.disable();
    this.itemmasterformControls.ItemCode.disable();
    this.itemmasterformControls.ItemName.disable();
    this.itemmasterformControls.ItemDesc.disable();
    this.itemmasterformControls.CategorySelCode.disable();
    this.itemmasterformControls.KaratSelCode.disable();
    this.itemmasterformControls.ColorSelCode.disable();
    this.itemmasterformControls.Gender.disable();
    this.itemmasterformControls.ItemCollectionSelCode.disable();
    this.itemmasterformControls.ItemFamilySelCode.disable();
    this.itemmasterformControls.ItemGroupSelCode.disable();
    this.itemmasterformControls.ItemBrandSelCode.disable();
    this.itemmasterformControls.ItemReqQty.disable();
    this.itemmasterformControls.MakingChargeMin.disable();
    this.itemmasterformControls.MakingChargeMax.disable();
    this.itemmasterformControls.LabourCharge.disable();
    this.itemmasterformControls.MRP.disable();
    this.itemmasterformControls.Remarks.disable();
    this.itemmasterformControls.EmarladWeight.disable();
    this.itemmasterformControls.GrossWeight.disable();
    this.itemmasterformControls.StoneWeight.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.productId = 0;
    this.itemmasterformControls.UOMSelCode.setValue(null);
    this.itemmasterformControls.SubCategorySelCode.setValue(null);
    this.itemmasterformControls.ItemCode.setValue(null);
    this.itemmasterformControls.ItemName.setValue(null);
    this.itemmasterformControls.ItemDesc.setValue(null);
    this.itemmasterformControls.CategorySelCode.setValue(null);
    this.itemmasterformControls.KaratSelCode.setValue(null);
    this.itemmasterformControls.ColorSelCode.setValue(null);
    this.itemmasterformControls.Gender.setValue(null);
    this.itemmasterformControls.ItemCollectionSelCode.setValue(null);
    this.itemmasterformControls.ItemFamilySelCode.setValue(null);
    this.itemmasterformControls.ItemGroupSelCode.setValue(null);
    this.itemmasterformControls.ItemBrandSelCode.setValue(null);
    this.itemmasterformControls.ItemReqQty.setValue(null);
    this.itemmasterformControls.LabourCharge.setValue(null);
    this.itemmasterformControls.MakingChargeMin.setValue(null);
    this.itemmasterformControls.MakingChargeMax.setValue(null);
    this.itemmasterformControls.MRP.setValue(null);
    this.itemmasterformControls.Remarks.setValue(null);
    this.itemmasterformControls.EmarladWeight.setValue(null);
    this.itemmasterformControls.GrossWeight.setValue(null);
    this.itemmasterformControls.StoneWeight.setValue(null);
    this.itemmasterformControls.fileInputImage.setValue(null);
    this.urls=[];
    this._albums=[];
    $('select').select2().trigger('change');
  }

  async ShowEditViewItemMaster(data: ItemMasterModel) {
    if(data) {
     // this.itemmasterformControls.CategorySelCode.setValue(this.SubCategoryCodesSearchHolder.find(item => item.categoryID == data.categoryID)?.categoryID);
      this.itemmasterformControls.UOMSelCode.setValue(data.uomid);
      this.itemmasterformControls.SubCategorySelCode.setValue(data.subCategoryID);
      this.itemmasterformControls.ItemCode.setValue(data.itemCode);
      this.itemmasterformControls.ItemName.setValue(data.itemName);
      this.itemmasterformControls.ItemDesc.setValue(data.itemDesc);
      this.itemmasterformControls.CategorySelCode.setValue(data.categoryID);
      this.itemmasterformControls.KaratSelCode.setValue(data.karatID);
      this.itemmasterformControls.ColorSelCode.setValue(data.colorID);
      this.itemmasterformControls.Gender.setValue(data.gender);
      this.itemmasterformControls.ItemCollectionSelCode.setValue(data.itemCollectionID);
      this.itemmasterformControls.ItemFamilySelCode.setValue(data.itemFamilyID);
      this.itemmasterformControls.ItemGroupSelCode.setValue(data.itemGroupID);
      this.itemmasterformControls.ItemBrandSelCode.setValue(data.itemBrandID);
      this.itemmasterformControls.ItemReqQty.setValue(data.itemReqQty);
      this.itemmasterformControls.LabourCharge.setValue(data.labourCharge);
      this.itemmasterformControls.MakingChargeMin.setValue(data.makingChargeMin);
      this.itemmasterformControls.MakingChargeMax.setValue(data.makingChargeMax);
      this.itemmasterformControls.MRP.setValue(data.mrp);
      this.itemmasterformControls.Remarks.setValue(data.remarks);
      this.itemmasterformControls.EmarladWeight.setValue(data.emarladWeight);
      this.itemmasterformControls.GrossWeight.setValue(data.grossWeight);
      this.itemmasterformControls.StoneWeight.setValue(data.stoneWeight);
      this.SubCategoryCodes = this.SubCategoryCodesSearchHolder.filter(x => x.categoryID == data.categoryID);
      //this.itemmasterformControls.SubCategorySelCode.setValue(data.subCategoryID);
      //$('select').select2().trigger('change');
    //  $('.select2bs4').select2().trigger('change');
      this.itemmasterformControls.ItemCode.disable();
      this.galleryImageList = data.itemSubList;
      if(data.itemSubList!=null)
      {
      for(let i=0;i<data.itemSubList.length;i++)
      {

        this._albums.push(data.itemSubList[i].imageFilePath);
       // alert(data.itemSubList[i].imageFilePath);
        // const src = data.itemSubList[i].imageFilePath;
        // const caption = 'Image ' + i + 1;
        // const thumb = data.itemSubList[i].imageFilePath;
        // const album = {
        //    small: data.itemSubList[i].imageFilePath,
        //    medium: data.itemSubList[i].imageFilePath,
        //    big: data.itemSubList[i].imageFilePath
        // };
        // this._albums.push(album);
      }
    }
    }
    
  }

  

  SaveItemMaster(){
    this.submitted = true;
     // stop here if form is invalid
     if (this.itemmasterform.invalid) {
      return;
  }
      this.loading = true;
      let saveResponse: Observable<any>;
      
      const formData = new FormData();
      if(this.productId!=undefined)
      {
      formData.append('ID',this.productId.toString());
      }
     
      formData.append('ItemCode', this.itemmasterformControls.ItemCode.value);
      formData.append('ItemName', this.itemmasterformControls.ItemName.value);
      formData.append('itemDesc', this.itemmasterformControls.ItemDesc.value);
      formData.append('UOMID', this.itemmasterformControls.UOMSelCode.value==null?0:this.itemmasterformControls.UOMSelCode.value);
      this.itemmastermodel = new ItemMasterModel;
      this.itemmastermodel.subCategoryID = this.itemmasterformControls.SubCategorySelCode.value;
      formData.append('SubCategoryID', this.itemmasterformControls.SubCategorySelCode.value);
      this.itemmastermodel.id = this.productId;
      this.itemmastermodel.itemCode = this.itemmasterformControls.ItemCode.value;
      this.itemmastermodel.itemName = this.itemmasterformControls.ItemName.value;
      this.itemmastermodel.itemDesc = this.itemmasterformControls.ItemDesc.value;
      this.itemmastermodel.uomid = this.itemmasterformControls.UOMSelCode.value;
      const currentCategory = this.SubCategoryCodes.filter(item => item.id == this.itemmastermodel.subCategoryID)[0];
      this.itemmastermodel.categoryName = currentCategory.categoryName;
      formData.append('CategoryName', currentCategory.categoryName);
      this.itemmastermodel.subCategoryName = currentCategory.subCategoryName;
      formData.append('SubCategoryName', currentCategory.subCategoryName);
      this.itemmastermodel.categoryID=currentCategory.categoryID;
      formData.append('CategoryID', currentCategory.categoryID.toString());
      this.itemmastermodel.karatID = this.itemmasterformControls.KaratSelCode.value;
      formData.append('KaratID', this.itemmasterformControls.KaratSelCode.value==null?"0":this.itemmasterformControls.KaratSelCode.value);
      this.itemmastermodel.mrp = this.itemmasterformControls.MRP.value;
      formData.append('mrp', this.itemmasterformControls.MRP.value==null?"0":this.itemmasterformControls.MRP.value);
      this.itemmastermodel.remarks = this.itemmasterformControls.Remarks.value;
      formData.append('Remarks', this.itemmasterformControls.Remarks.value);
      this.itemmastermodel.colorID = this.itemmasterformControls.ColorSelCode.value;
      formData.append('ColorID', this.itemmasterformControls.ColorSelCode.value==null?"0":this.itemmasterformControls.ColorSelCode.value);
      this.itemmastermodel.gender = this.itemmasterformControls.Gender.value;
      formData.append('Gender', this.itemmasterformControls.Gender.value);
      this.itemmastermodel.itemCollectionID = this.itemmasterformControls.ItemCollectionSelCode.value;
      formData.append('ItemCollectionID', this.itemmasterformControls.ItemCollectionSelCode.value==null?"0":this.itemmasterformControls.ItemCollectionSelCode.value);
      this.itemmastermodel.itemFamilyID = this.itemmasterformControls.ItemFamilySelCode.value;
      formData.append('ItemFamilyID', this.itemmasterformControls.ItemFamilySelCode.value==null?"0":this.itemmasterformControls.ItemFamilySelCode.value);
      this.itemmastermodel.itemGroupID = this.itemmasterformControls.ItemGroupSelCode.value;
      formData.append('ItemGroupID', this.itemmasterformControls.ItemGroupSelCode.value==null?"0":this.itemmasterformControls.ItemGroupSelCode.value);
      this.itemmastermodel.itemBrandID = this.itemmasterformControls.ItemBrandSelCode.value;
      formData.append('ItemBrandID', this.itemmasterformControls.ItemBrandSelCode.value==null?"0":this.itemmasterformControls.ItemBrandSelCode.value);
      this.itemmastermodel.itemReqQty = this.itemmasterformControls.ItemReqQty.value;
      formData.append('ItemReqQty', this.itemmasterformControls.ItemReqQty.value==null?"0":this.itemmasterformControls.ItemReqQty.value);
      this.itemmastermodel.labourCharge = this.itemmasterformControls.LabourCharge.value;
      formData.append('LabourCharge', this.itemmasterformControls.LabourCharge.value==null?"0":this.itemmasterformControls.LabourCharge.value);
      this.itemmastermodel.makingChargeMin = this.itemmasterformControls.MakingChargeMin.value;
      formData.append('MakingChargeMin', this.itemmasterformControls.MakingChargeMin.value==null?"0":this.itemmasterformControls.MakingChargeMin.value);
      this.itemmastermodel.makingChargeMax = this.itemmasterformControls.MakingChargeMax.value;
      formData.append('MakingChargeMax', this.itemmasterformControls.MakingChargeMax.value==null?"0":this.itemmasterformControls.MakingChargeMax.value);
      this.itemmastermodel.emarladWeight = this.itemmasterformControls.EmarladWeight.value;
      formData.append('EmarladWeight', this.itemmasterformControls.EmarladWeight.value==null?"0": this.itemmasterformControls.EmarladWeight.value);
      this.itemmastermodel.grossWeight = this.itemmasterformControls.GrossWeight.value;
      formData.append('GrossWeight', this.itemmasterformControls.GrossWeight.value==null?"0": this.itemmasterformControls.GrossWeight.value);
      this.itemmastermodel.stoneWeight = this.itemmasterformControls.StoneWeight.value;
      formData.append('StoneWeight', this.itemmasterformControls.StoneWeight.value==null?"0": this.itemmasterformControls.StoneWeight.value);
      if(this.itemmastermodel.uomid!=null)
      {
      this.itemmastermodel.uomName=this.uomcodes.filter(item=>item.id==this.itemmastermodel.uomid)[0].uomName;
      formData.append('UOMName', this.uomcodes.filter(item=>item.id==this.itemmastermodel.uomid)[0].uomName);
      }
      if(this.itemmastermodel.itemBrandID!=null)
      {
      this.itemmastermodel.itemBrandName=this.itembrand.filter(item=>item.id==this.itemmastermodel.itemBrandID)[0].itemBrandName;
      formData.append('ItemBrandName',this.itembrand.filter(item=>item.id==this.itemmastermodel.itemBrandID)[0].itemBrandName);
      }
      if(this.itemmastermodel.itemCollectionID!=null)
      {
      this.itemmastermodel.itemCollectionName=this.itemcollections.filter(item=>item.id==this.itemmastermodel.itemCollectionID)[0].itemCollectionName;
      formData.append('ItemCollectionName',this.itemcollections.filter(item=>item.id==this.itemmastermodel.itemCollectionID)[0].itemCollectionName);
      }
      if(this.itemmastermodel.itemFamilyID!=null)
      {
      this.itemmastermodel.itemFamilyName=this.itemfamily.filter(item=>item.id==this.itemmastermodel.itemFamilyID)[0].itemFamilyName;
      formData.append('ItemFamilyName',this.itemfamily.filter(item=>item.id==this.itemmastermodel.itemFamilyID)[0].itemFamilyName);
      }
      if(this.itemmastermodel.itemGroupID!=null)
      {
      this.itemmastermodel.itemGroupName=this.itemgroup.filter(item=>item.id==this.itemmastermodel.itemGroupID)[0].itemGroupName;
      formData.append('ItemGroupName',this.itemgroup.filter(item=>item.id==this.itemmastermodel.itemGroupID)[0].itemGroupName);
      }
      if(this.itemmastermodel.karatID!=null)
      {
      this.itemmastermodel.karatName=this.karatcodes.filter(item=>item.id==this.itemmastermodel.karatID)[0].karatName;
      formData.append('KaratName',this.karatcodes.filter(item=>item.id==this.itemmastermodel.karatID)[0].karatName);
      }
      if(this.itemmastermodel.colorID!=null)
      {
      this.itemmastermodel.colorName=this.colorcodes.filter(item=>item.id==this.itemmastermodel.colorID)[0].colorName;
      formData.append('ColorName',this.colorcodes.filter(item=>item.id==this.itemmastermodel.colorID)[0].colorName);
      }

      if(this.fileImageList != null && this.fileImageList.length > 0) {
        for(let i=0;i<this.fileImageList.length;i++)
        {
          let imageFile: File = this.fileImageList[i];
          formData.append('ImageList', imageFile, imageFile.name);
        }
       
      }

     

      if(this.editMode){
       saveResponse = this.itemmasterservice.editItemmaster(formData,this.productId.toString());
      } else {
        saveResponse = this.itemmasterservice.addItemmaster(formData);
    }

    
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.itemmastermodel.id = result.id;
          this.ClearContents();
        }
        this.itemmastermodel.itemSubList=result.itemSubList;
        this.saveAlert.SuccessMessage();
        this.itemmasterservice.AddOrEditRecordToCache(this.itemmastermodel, this.editMode);
        this.submitted = false;
        if(this.routetype==true)
        {
          this.closeModal();
        }
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
  imageError!: string;
  urls:string[]=[];
  fileChangeEvent(fileInput:any) {
    this.imageError = '';
    const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;
    if (fileInput.target.files) {
     
      for(let i=0;i<fileInput.target.files.length;i++)
      {
        if (fileInput.target.files[i].size > max_size) {
          this.imageError =
              'Maximum size allowed is ' + max_size / 1000 + 'Mb';

          return false;
      }
      if (fileInput.target.files[i].type.includes(allowed_types)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
    }
        this.fileImageList.push(fileInput.target.files[i]);
        var imagereader =new FileReader();
          imagereader.readAsDataURL(fileInput.target.files[i]);
          imagereader.onload=(events:any)=>{
            this.urls.push(events.target.result);
          }
      }
        // Size Filter Bytes

     
        // const reader = new FileReader();
        // reader.readAsDataURL(fileInput.target.files[0]);
        // reader.onload = (e: any) => {
        //     this.cardImageBase64 = e.target.result;
        //     this.isImageSaved = true;
        //     return true;
        //   };

          return false;
        }
        return false;
  }

  removeImage(index:number) {
    if(this.urls.length>0)
    {
      this.urls.splice(index,1);
      this.fileImageList.splice(index,1);
      this.itemmasterformControls.fileInputImage.reset();
     // this.itemmasterform.get('fileInputImage')?.reset(index).removeImage();
    }
    // this.cardImageBase64 = '';
    // this.isImageSaved = false;
  }

}
