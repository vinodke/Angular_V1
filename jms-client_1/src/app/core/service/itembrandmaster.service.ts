import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ItemBrandMasterModel } from '../../shared/model/ItemBrandMasterModel';

@Injectable({
  providedIn: 'root'
})
export class itembrandmasterservice {
  itemBrandMasterDataCache: ItemBrandMasterModel[] = [];
  token = localStorage.getItem('access_token');
  itemBrandDataByKey!: ItemBrandMasterModel;
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

  private itemBrandMasterUrl = `${environment.apiUrl}/ItemBrand`;
  
  async getItemBrandMaster() {
    if(!(this.itemBrandMasterDataCache.length > 0)){
      const data = await this.http.get<ItemBrandMasterModel[]>(this.itemBrandMasterUrl, this.httpOptions)
      .toPromise();
      this.itemBrandMasterDataCache = data;
      return data;
  }
  else{
    return this.itemBrandMasterDataCache;
  }
  }

  async onRefreshItemBrandMaster(){
    const data = await this.http.get<ItemBrandMasterModel[]>(this.itemBrandMasterUrl, this.httpOptions)
    .toPromise();
    this.itemBrandMasterDataCache = data;
    return data;
  }

  addItemBrandmaster(itemBrandMastermodel: ItemBrandMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/ItemBrand`,
          itemBrandMastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editItemBrandMaster(itemBrandMastermodel: ItemBrandMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/ItemBrand/` + itemBrandMastermodel.id,
         itemBrandMastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getItemBrandMasterByKey(itemBrandID: number)  {
        return this.itemBrandMasterDataCache.find(item => item.id == itemBrandID);
  }

  AddOrEditRecordToCache(itemBrandMastermodel: ItemBrandMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.itemBrandMasterDataCache.findIndex(item => item.id == itemBrandMastermodel.id);
      this.itemBrandMasterDataCache[objIndex] = itemBrandMastermodel;
    }
    else
    {
      this.itemBrandMasterDataCache.push(itemBrandMastermodel);
      this.itemBrandMasterDataCache.sort((a, b) => (a.itemBrandCode > b.itemBrandCode) ? 1 : -1);
    }
  }

  DeleteMaster(itemBrandID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/ItemBrand/` + itemBrandID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(itemBrandID: number) {
    const objIndex = this.itemBrandMasterDataCache.findIndex(item => item.id == itemBrandID);
    this.itemBrandMasterDataCache.splice(objIndex,1);
    
  }
}
