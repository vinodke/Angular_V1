import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ItemFamilyMasterModel } from '../../shared/model/ItemFamilyMasterModel';

@Injectable({
  providedIn: 'root'
})
export class itemfamilymasterservice {
  itemFamilyMasterDataCache: ItemFamilyMasterModel[] = [];
  token = localStorage.getItem('access_token');
  itemFamilyDataByKey!: ItemFamilyMasterModel;
  selectedrowevent= new Subject<any>();
  refreshClickevent= new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
  httpOptions = {
    headers: this.headers
  };
  
  constructor(private http: HttpClient,
    private router: Router) { }

  private itemFamilyMasterUrl = `${environment.apiUrl}/ItemFamily`;
  
  async getItemFamilyMaster() {
    if(!(this.itemFamilyMasterDataCache.length > 0)){
      const data = await this.http.get<ItemFamilyMasterModel[]>(this.itemFamilyMasterUrl, this.httpOptions)
      .toPromise();
      this.itemFamilyMasterDataCache = data;
      return data;
  }
  else{
    return this.itemFamilyMasterDataCache;
  }
  }

  async onRefreshItemFamilyMaster(){
    const data = await this.http.get<ItemFamilyMasterModel[]>(this.itemFamilyMasterUrl, this.httpOptions)
    .toPromise();
    this.itemFamilyMasterDataCache = data;
    return data;
  }

  addItemFamilymaster(itemFamilyMasterModel: ItemFamilyMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/ItemFamily`,
          itemFamilyMasterModel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editItemFamilyMaster(itemFamilyMasterModel: ItemFamilyMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/ItemFamily/` + itemFamilyMasterModel.id,
         itemFamilyMasterModel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getItemFamilyMasterByKey(itemFamilyID: number)  {
        return this.itemFamilyMasterDataCache.find(item => item.id == itemFamilyID);
  }

  AddOrEditRecordToCache(itemFamilyMasterModel: ItemFamilyMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.itemFamilyMasterDataCache.findIndex(item => item.id == itemFamilyMasterModel.id);
      this.itemFamilyMasterDataCache[objIndex] = itemFamilyMasterModel;
    }
    else
    {
      this.itemFamilyMasterDataCache.push(itemFamilyMasterModel);
      this.itemFamilyMasterDataCache.sort((a, b) => (a.itemFamilyCode > b.itemFamilyCode) ? 1 : -1);
    }
  }

  DeleteMaster(ItemFamilyID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/ItemFamily/` + ItemFamilyID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(ItemFamilyID: number) {
    const objIndex = this.itemFamilyMasterDataCache.findIndex(item => item.id == ItemFamilyID);
    this.itemFamilyMasterDataCache.splice(objIndex,1);
    
  }
}
