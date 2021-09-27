import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RegionMasterModel } from '../../shared/model/RegionMasterModel';

@Injectable({
  providedIn: 'root'
})
export class regionmasterservice {
  regionMasterDataCache: RegionMasterModel[] = [];
  token = localStorage.getItem('access_token');
  regionDataByKey!: RegionMasterModel;
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

  private regionMasterUrl = `${environment.apiUrl}/Region`;
  
  async getRegionMaster() {
    if(!(this.regionMasterDataCache.length > 0)){
      const data = await this.http.get<RegionMasterModel[]>(this.regionMasterUrl, this.httpOptions)
      .toPromise();
      this.regionMasterDataCache = data;
      return data;
  }
  else{
    return this.regionMasterDataCache;
  }
  }

  async onRefreshRegionMaster(){
    const data = await this.http.get<RegionMasterModel[]>(this.regionMasterUrl, this.httpOptions)
    .toPromise();
    this.regionMasterDataCache = data;
    return data;
  }

  addRegionmaster(regionMastermodel: RegionMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/Region`,
          regionMastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editRegionMaster(regionMastermodel: RegionMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/Region/` + regionMastermodel.id,
         regionMastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getRegionMasterByKey(regionID: number)  {
        return this.regionMasterDataCache.find(item => item.id == regionID);
  }

  AddOrEditRecordToCache(regionMastermodel: RegionMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.regionMasterDataCache.findIndex(item => item.id == regionMastermodel.id);
      this.regionMasterDataCache[objIndex] = regionMastermodel;
    }
    else
    {
      this.regionMasterDataCache.push(regionMastermodel);
      this.regionMasterDataCache.sort((a, b) => (a.regionCode > b.regionCode) ? 1 : -1);
    }
  }

  DeleteMaster(regionID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Region/` + regionID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(regionID: number) {
    const objIndex = this.regionMasterDataCache.findIndex(item => item.id == regionID);
    this.regionMasterDataCache.splice(objIndex,1);
    
  }
}
