import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../../src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AssetCategoryMasterModel } from '../../shared/model/AssetCategoryMasterModel';

@Injectable({
  providedIn: 'root'
})
export class AssetCategoryMasterService {
  assetCategoryMasterDataCache: AssetCategoryMasterModel[] = [];
  token = localStorage.getItem('access_token');
  assetCategoryMasterDataByKey!: AssetCategoryMasterModel;
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

  private assetCategoryMasterUrl = `${environment.apiUrl}/AssetCategory`;
  
  async getAssetCategoryMaster() {
    if(!(this.assetCategoryMasterDataCache.length > 0)){
      const data = await this.http.get<AssetCategoryMasterModel[]>(this.assetCategoryMasterUrl, this.httpOptions)
      .toPromise();
      this.assetCategoryMasterDataCache = data;
      return data;
  }
  else{
    return this.assetCategoryMasterDataCache;
  }
  }

  async onRefreshAssetCategoryMaster(){
    const data = await this.http.get<AssetCategoryMasterModel[]>(this.assetCategoryMasterUrl, this.httpOptions)
    .toPromise();
    this.assetCategoryMasterDataCache = data;
    return data;
  }

  addAssetCategorymaster(assetCategoryMastermodel: AssetCategoryMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/AssetCategory`,
          assetCategoryMastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editAssetCategorymaster(assetCategoryMastermodel: AssetCategoryMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/AssetCategory/` + assetCategoryMastermodel.assetCategoryId,
         assetCategoryMastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getAssetCategoryMasterByKey(assetCategoryID: number)  {
        return this.assetCategoryMasterDataCache.find(item => item.assetCategoryId == assetCategoryID);
  }

  AddOrEditRecordToCache(assetCategoryMastermodel: AssetCategoryMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.assetCategoryMasterDataCache.findIndex(item => item.assetCategoryId == assetCategoryMastermodel.assetCategoryId);
      this.assetCategoryMasterDataCache[objIndex] = assetCategoryMastermodel;
    }
    else
    {
      this.assetCategoryMasterDataCache.push(assetCategoryMastermodel);
      this.assetCategoryMasterDataCache.sort((a, b) => (a.assetCategoryCode > b.assetCategoryCode) ? 1 : -1);
    }
  }

  DeleteAssetCategoryMaster(assetCategoryID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/AssetCategory/` + assetCategoryID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(assetCategoryID: number) {
    const objIndex = this.assetCategoryMasterDataCache.findIndex(item => item.assetCategoryId == assetCategoryID);
    this.assetCategoryMasterDataCache.splice(objIndex,1);
    
  }
}
