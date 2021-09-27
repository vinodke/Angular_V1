import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CompanyMasterModel } from '../../shared/model/CompanyMasterModel';
import { WarehouseMasterModel } from '../../shared/model/WarehouseMasterModel';

@Injectable({
  providedIn: 'root'
})
export class warehousemasterservice {
  warehouseMasterDataCache: WarehouseMasterModel[] = [];
  token = localStorage.getItem('access_token');
  warehouseMasterDataByKey!: WarehouseMasterModel;
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

  private warehouseMasterUrl = `${environment.apiUrl}/Warehouse`;
  
  async getWarehouseMaster() {
    if(!(this.warehouseMasterDataCache.length > 0)){
      const data = await this.http.get<WarehouseMasterModel[]>(this.warehouseMasterUrl, this.httpOptions)
      .toPromise();
      this.warehouseMasterDataCache = data;
      return data;
  }
  else{
    return this.warehouseMasterDataCache;
  }
  }

  async onRefreshWarehouseMaster(){
    const data = await this.http.get<WarehouseMasterModel[]>(this.warehouseMasterUrl, this.httpOptions)
    .toPromise();
    this.warehouseMasterDataCache = data;
    return data;
  }

  addWarehousemaster(warehouseMastermodel: WarehouseMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/Warehouse`,
          warehouseMastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editWarehouseMaster(warehouseMastermodel: WarehouseMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/Warehouse/` + warehouseMastermodel.id,
         warehouseMastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getWarehouseMasterByKey(warehouseID: number)  {
        return this.warehouseMasterDataCache.find(item => item.id == warehouseID);
  }

  AddOrEditRecordToCache(warehouseMastermodel: WarehouseMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.warehouseMasterDataCache.findIndex(item => item.id == warehouseMastermodel.id);
      this.warehouseMasterDataCache[objIndex] = warehouseMastermodel;
    }
    else
    {
      this.warehouseMasterDataCache.push(warehouseMastermodel);
      this.warehouseMasterDataCache.sort((a, b) => (a.warehouseCode > b.warehouseCode) ? 1 : -1);
    }
  }

  DeleteMaster(warehouseID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Warehouse/` + warehouseID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(warehouseID: number) {
    const objIndex = this.warehouseMasterDataCache.findIndex(item => item.id == warehouseID);
    this.warehouseMasterDataCache.splice(objIndex,1);
    
  }

}
