import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BrandMasterModel } from '../../shared/model/BrandMasterModel';
import { TaxMasterModel } from '../../shared/model/TaxMasterModel';

@Injectable({
  providedIn: 'root'
})
export class taxmasterService {
  taxmasterDataCache: TaxMasterModel[] = [];
  token = localStorage.getItem('access_token');
  taxMasterDataByKey!: TaxMasterModel;
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

  private taxMasterUrl = `${environment.apiUrl}/TaxMaster`;
  
  async getTaxMaster() {
    if(!(this.taxmasterDataCache.length > 0)){
      const data = await this.http.get<TaxMasterModel[]>(this.taxMasterUrl, this.httpOptions)
      .toPromise();
      this.taxmasterDataCache = data;
      return data;
  }
  else{
    return this.taxmasterDataCache;
  }
  }

  async onRefreshTaxmaster(){
    const data = await this.http.get<TaxMasterModel[]>(this.taxMasterUrl, this.httpOptions)
    .toPromise();
    this.taxmasterDataCache = data;
    return data;
  }

  addTaxmaster(taxmastermodel: TaxMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/TaxMaster`,
    taxmastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editTaxmaster(taxmastermodel: TaxMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/TaxMaster/` + taxmastermodel.id,
    taxmastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getTaxMasterByKey(taxID: number)  {
        return this.taxmasterDataCache.find(item => item.id == taxID);
  }

  AddOrEditRecordToCache(taxmastermodel: TaxMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.taxmasterDataCache.findIndex(item => item.id == taxmastermodel.id);
      this.taxmasterDataCache[objIndex] = taxmastermodel;
    }
    else
    {
      this.taxmasterDataCache.push(taxmastermodel);
      this.taxmasterDataCache.sort((a, b) => (a.id > b.id) ? 1 : -1);
    }
  }

  DeleteTaxMaster(taxID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/TaxMaster/` + taxID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(taxID: number) {
    const objIndex = this.taxmasterDataCache.findIndex(item => item.id == taxID);
    this.taxmasterDataCache.splice(objIndex,1);
    
  }
}
