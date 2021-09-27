import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CompanyMasterModel } from '../../shared/model/CompanyMasterModel';

@Injectable({
  providedIn: 'root'
})
export class companymasterservice {
  companyMasterDataCache: CompanyMasterModel[] = [];
  token = localStorage.getItem('access_token');
  companyMasterDataByKey!: CompanyMasterModel;
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

  private companyMasterUrl = `${environment.apiUrl}/Company`;
  
  async getCompanyMaster() {
    if(!(this.companyMasterDataCache.length > 0)){
      const data = await this.http.get<CompanyMasterModel[]>(this.companyMasterUrl, this.httpOptions)
      .toPromise();
      this.companyMasterDataCache = data;
      return data;
  }
  else{
    return this.companyMasterDataCache;
  }
  }

  async onRefreshCompanyMaster(){
    const data = await this.http.get<CompanyMasterModel[]>(this.companyMasterUrl, this.httpOptions)
    .toPromise();
    this.companyMasterDataCache = data;
    return data;
  }

  addCompanymaster(companyMastermodel: CompanyMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/Company`,
          companyMastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editCompanyMaster(companyMastermodel: CompanyMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/Company/` + companyMastermodel.companyName,
         companyMastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getCompanyMasterByKey(companyID: string)  {
        return this.companyMasterDataCache.find(item => item.companyName == companyID);
  }

  AddOrEditRecordToCache(companyMastermodel: CompanyMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.companyMasterDataCache.findIndex(item => item.companyName == companyMastermodel.companyName);
      this.companyMasterDataCache[objIndex] = companyMastermodel;
    }
    else
    {
      this.companyMasterDataCache.push(companyMastermodel);
      this.companyMasterDataCache.sort((a, b) => (a.companyCode > b.companyCode) ? 1 : -1);
    }
  }

  DeleteMaster(companyID: string) {
    return this.http.delete<any>(`${environment.apiUrl}/Company/` + companyID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(companyID: string) {
    const objIndex = this.companyMasterDataCache.findIndex(item => item.companyName == companyID);
    this.companyMasterDataCache.splice(objIndex,1);
    
  }

}
