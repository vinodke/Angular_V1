import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ItemGroupMasterModel } from '../../shared/model/ItemGroupMasterModel';

@Injectable({
  providedIn: 'root'
})
export class itemgroupmasterservice {
  itemGroupMasterDataCache: ItemGroupMasterModel[] = [];
  token = localStorage.getItem('access_token');
  itemGroupDataByKey!: ItemGroupMasterModel;
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

  private itemGroupMasterUrl = `${environment.apiUrl}/ItemGroup`;
  
  async getItemGroupMaster() {
    if(!(this.itemGroupMasterDataCache.length > 0)){
      const data = await this.http.get<ItemGroupMasterModel[]>(this.itemGroupMasterUrl, this.httpOptions)
      .toPromise();
      this.itemGroupMasterDataCache = data;
      return data;
  }
  else{
    return this.itemGroupMasterDataCache;
  }
  }

  async onRefreshItemGroupMaster(){
    const data = await this.http.get<ItemGroupMasterModel[]>(this.itemGroupMasterUrl, this.httpOptions)
    .toPromise();
    this.itemGroupMasterDataCache = data;
    return data;
  }

  addItemGroupmaster(itemGroupMasterModel: ItemGroupMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/ItemGroup`,
          itemGroupMasterModel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editItemGroupMaster(itemGroupMasterModel: ItemGroupMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/ItemGroup/` + itemGroupMasterModel.id,
    itemGroupMasterModel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getItemGroupMasterByKey(ItemGroupID: number)  {
        return this.itemGroupMasterDataCache.find(item => item.id == ItemGroupID);
  }

  AddOrEditRecordToCache(itemGroupMasterModel: ItemGroupMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.itemGroupMasterDataCache.findIndex(item => item.id == itemGroupMasterModel.id);
      this.itemGroupMasterDataCache[objIndex] = itemGroupMasterModel;
    }
    else
    {
      this.itemGroupMasterDataCache.push(itemGroupMasterModel);
      this.itemGroupMasterDataCache.sort((a, b) => (a.itemGroupCode > b.itemGroupCode) ? 1 : -1);
    }
  }

  DeleteMaster(ItemGroupID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/ItemGroup/` + ItemGroupID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(ItemGroupID: number) {
    const objIndex = this.itemGroupMasterDataCache.findIndex(item => item.id == ItemGroupID);
    this.itemGroupMasterDataCache.splice(objIndex,1);
    
  }
}
