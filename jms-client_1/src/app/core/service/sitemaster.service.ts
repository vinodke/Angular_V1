import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SiteMasterModel } from '../../shared/model/sitemastermodel';

@Injectable({
  providedIn: 'root'
})
export class SitemasterService {
  sitemasterDataCache: SiteMasterModel[] = [];
  token = localStorage.getItem('access_token');
  siteMasterDataByKey!: SiteMasterModel;
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

  private siteMasterUrl = `${environment.apiUrl}/Site`;
  
  async getSiteMaster() {
    if(!(this.sitemasterDataCache.length > 0)){
      const data = await this.http.get<SiteMasterModel[]>(this.siteMasterUrl, this.httpOptions)
      .toPromise();
      this.sitemasterDataCache = data;
      return data;
  }
  else{
    return this.sitemasterDataCache;
  }
  }

  async onRefreshSitemaster(){
    const data = await this.http.get<SiteMasterModel[]>(this.siteMasterUrl, this.httpOptions)
    .toPromise();
    this.sitemasterDataCache = data;
    return data;
  }

  addSitemaster(sitemastermodel: SiteMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/Site`,
          sitemastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editSitemaster(sitemastermodel: SiteMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/Site/` + sitemastermodel.siteID,
         sitemastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getSiteMasterByKey(siteID: number)  {
        return this.sitemasterDataCache.find(item => item.siteID == siteID);
  }

  AddOrEditRecordToCache(siteMasterModel: SiteMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.sitemasterDataCache.findIndex(item => item.siteID == siteMasterModel.siteID);
      this.sitemasterDataCache[objIndex] = siteMasterModel;
    }
    else
    {
      this.sitemasterDataCache.push(siteMasterModel);
      this.sitemasterDataCache.sort((a, b) => (a.siteCode > b.siteCode) ? 1 : -1);
    }
  }

  DeleteSiteMaster(siteID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Site/` + siteID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(siteID: number) {
    const objIndex = this.sitemasterDataCache.findIndex(item => item.siteID == siteID);
    this.sitemasterDataCache.splice(objIndex,1);
    
  }
}
