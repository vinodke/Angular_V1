import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CashCounterMasterModel } from '../../shared/model/CashCounterMasterModel';

@Injectable({
  providedIn: 'root'
})
export class cashcountermasterservice {
  cashCounterMasterDataCache: CashCounterMasterModel[] = [];
  token = localStorage.getItem('access_token');
  cashCounterDataByKey!: CashCounterMasterModel;
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

  private cashCounterMasterUrl = `${environment.apiUrl}/CashCounter`;
  
  async getCashCounterMaster() {
    if(!(this.cashCounterMasterDataCache.length > 0)){
      const data = await this.http.get<CashCounterMasterModel[]>(this.cashCounterMasterUrl, this.httpOptions)
      .toPromise();
      this.cashCounterMasterDataCache = data;
      return data;
  }
  else{
    return this.cashCounterMasterDataCache;
  }
  }

  async onRefreshCashCounterMaster(){
    const data = await this.http.get<CashCounterMasterModel[]>(this.cashCounterMasterUrl, this.httpOptions)
    .toPromise();
    this.cashCounterMasterDataCache = data;
    return data;
  }

  addCashCountermaster(cashCounterMasterModel: CashCounterMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/CashCounter`,
    cashCounterMasterModel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editCashCounterMaster(cashCounterMasterModel: CashCounterMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/CashCounter/` + cashCounterMasterModel.id,
    cashCounterMasterModel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getCashCounterMasterByKey(bankID: number)  {
        return this.cashCounterMasterDataCache.find(item => item.id == bankID);
  }

  AddOrEditRecordToCache(CashCounterMasterModel: CashCounterMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.cashCounterMasterDataCache.findIndex(item => item.id == CashCounterMasterModel.id);
      this.cashCounterMasterDataCache[objIndex] = CashCounterMasterModel;
    }
    else
    {
      this.cashCounterMasterDataCache.push(CashCounterMasterModel);
      this.cashCounterMasterDataCache.sort((a, b) => (a.cashCounterName > b.cashCounterName) ? 1 : -1);
    }
  }

  DeleteMaster(ID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/CashCounter/` + ID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(ID: number) {
    const objIndex = this.cashCounterMasterDataCache.findIndex(item => item.id == ID);
    this.cashCounterMasterDataCache.splice(objIndex,1);
    
  }
}
