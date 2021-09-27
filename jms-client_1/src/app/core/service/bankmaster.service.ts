import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BankMasterModel } from '../../shared/model/BankMasterModel';

@Injectable({
  providedIn: 'root'
})
export class bankmasterservice {
  bankMasterDataCache: BankMasterModel[] = [];
  token = localStorage.getItem('access_token');
  bankDataByKey!: BankMasterModel;
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

  private bankMasterUrl = `${environment.apiUrl}/Bank`;
  
  async getBankMaster() {
    if(!(this.bankMasterDataCache.length > 0)){
      const data = await this.http.get<BankMasterModel[]>(this.bankMasterUrl, this.httpOptions)
      .toPromise();
      this.bankMasterDataCache = data;
      return data;
  }
  else{
    return this.bankMasterDataCache;
  }
  }

  async onRefreshBankMaster(){
    const data = await this.http.get<BankMasterModel[]>(this.bankMasterUrl, this.httpOptions)
    .toPromise();
    this.bankMasterDataCache = data;
    return data;
  }

  addBankmaster(bankMasterModel: BankMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/Bank`,
    bankMasterModel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editBankMaster(bankMasterModel: BankMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/Bank/` + bankMasterModel.id,
    bankMasterModel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getBankMasterByKey(bankID: number)  {
        return this.bankMasterDataCache.find(item => item.id == bankID);
  }

  AddOrEditRecordToCache(bankMasterModel: BankMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.bankMasterDataCache.findIndex(item => item.id == bankMasterModel.id);
      this.bankMasterDataCache[objIndex] = bankMasterModel;
    }
    else
    {
      this.bankMasterDataCache.push(bankMasterModel);
      this.bankMasterDataCache.sort((a, b) => (a.accountNumber > b.accountNumber) ? 1 : -1);
    }
  }

  DeleteMaster(ID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Bank/` + ID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(ID: number) {
    const objIndex = this.bankMasterDataCache.findIndex(item => item.id == ID);
    this.bankMasterDataCache.splice(objIndex,1);
    
  }
}
