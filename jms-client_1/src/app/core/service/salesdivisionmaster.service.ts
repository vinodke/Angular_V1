import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SalesDivisionMasterModel } from '../../shared/model/SalesDivisionMasterModel';

@Injectable({
  providedIn: 'root'
})
export class salesdivisionmasterservice {
  salesDivsionMasterDataCache: SalesDivisionMasterModel[] = [];
  token = localStorage.getItem('access_token');
  salesDivisionDataByKey!: SalesDivisionMasterModel;
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

  private salesDivisionMasterUrl = `${environment.apiUrl}/SalesDivision`;
  
  async getSalesDivisionMaster() {
    if(!(this.salesDivsionMasterDataCache.length > 0)){
      const data = await this.http.get<SalesDivisionMasterModel[]>(this.salesDivisionMasterUrl, this.httpOptions)
      .toPromise();
      this.salesDivsionMasterDataCache = data;
      return data;
  }
  else{
    return this.salesDivsionMasterDataCache;
  }
  }

  async onRefreshSalesDivisionMaster(){
    const data = await this.http.get<SalesDivisionMasterModel[]>(this.salesDivisionMasterUrl, this.httpOptions)
    .toPromise();
    this.salesDivsionMasterDataCache = data;
    return data;
  }

  addSalesDivisionmaster(salesDivisionMasterModel: SalesDivisionMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/SalesDivision`,
    salesDivisionMasterModel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editSalesDivisionMaster(salesDivisionMasterModel: SalesDivisionMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/SalesDivision/` + salesDivisionMasterModel.id,
    salesDivisionMasterModel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getSalesDivisionMasterByKey(ID: number)  {
        return this.salesDivsionMasterDataCache.find(item => item.id == ID);
  }

  AddOrEditRecordToCache(salesDivisionMasterModel: SalesDivisionMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.salesDivsionMasterDataCache.findIndex(item => item.id == salesDivisionMasterModel.id);
      this.salesDivsionMasterDataCache[objIndex] = salesDivisionMasterModel;
    }
    else
    {
      this.salesDivsionMasterDataCache.push(salesDivisionMasterModel);
      this.salesDivsionMasterDataCache.sort((a, b) => (a.salesDivisionName > b.salesDivisionName) ? 1 : -1);
    }
  }

  DeleteMaster(ID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/SalesDivision/` + ID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(ID: number) {
    const objIndex = this.salesDivsionMasterDataCache.findIndex(item => item.id == ID);
    this.salesDivsionMasterDataCache.splice(objIndex,1);
    
  }
}
