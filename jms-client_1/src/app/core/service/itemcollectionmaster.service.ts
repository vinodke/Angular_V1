import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ItemCollectionMasterModel } from '../../shared/model/ItemCollectionMasterModel';

@Injectable({
  providedIn: 'root'
})
export class itemcollectionmasterservice {
  itemCollectionMasterDataCache: ItemCollectionMasterModel[] = [];
  token = localStorage.getItem('access_token');
  itemCollectionDataByKey!: ItemCollectionMasterModel;
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

  private itemCollectionMasterUrl = `${environment.apiUrl}/ItemCollection`;
  
  async getItemCollectionMaster() {
    if(!(this.itemCollectionMasterDataCache.length > 0)){
      const data = await this.http.get<ItemCollectionMasterModel[]>(this.itemCollectionMasterUrl, this.httpOptions)
      .toPromise();
      this.itemCollectionMasterDataCache = data;
      return data;
  }
  else{
    return this.itemCollectionMasterDataCache;
  }
  }

  async onRefreshItemCollectionMaster(){
    const data = await this.http.get<ItemCollectionMasterModel[]>(this.itemCollectionMasterUrl, this.httpOptions)
    .toPromise();
    this.itemCollectionMasterDataCache = data;
    return data;
  }

  addItemCollectionmaster(itemCollectionMastermodel: ItemCollectionMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/ItemCollection`,
          itemCollectionMastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editItemCollectionMaster(itemCollectionMastermodel: ItemCollectionMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/ItemCollection/` + itemCollectionMastermodel.id,
         itemCollectionMastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getItemCollectionMasterByKey(itemCollectionID: number)  {
        return this.itemCollectionMasterDataCache.find(item => item.id == itemCollectionID);
  }

  AddOrEditRecordToCache(itemCollectionMastermodel: ItemCollectionMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.itemCollectionMasterDataCache.findIndex(item => item.id == itemCollectionMastermodel.id);
      this.itemCollectionMasterDataCache[objIndex] = itemCollectionMastermodel;
    }
    else
    {
      this.itemCollectionMasterDataCache.push(itemCollectionMastermodel);
      this.itemCollectionMasterDataCache.sort((a, b) => (a.itemCollectionCode > b.itemCollectionCode) ? 1 : -1);
    }
  }

  DeleteMaster(itemCollectionID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/ItemCollection/` + itemCollectionID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(itemCollectionID: number) {
    const objIndex = this.itemCollectionMasterDataCache.findIndex(item => item.id == itemCollectionID);
    this.itemCollectionMasterDataCache.splice(objIndex,1);
    
  }
}
