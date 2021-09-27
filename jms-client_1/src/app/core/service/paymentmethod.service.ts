import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PaymentMethodModel } from '../../shared/model/PaymentMethodModel';

@Injectable({
  providedIn: 'root'
})
export class paymentmethodService {
  paymentMethodDataCache: PaymentMethodModel[] = [];
  token = localStorage.getItem('access_token');
  paymentMethodDataByKey!: PaymentMethodModel;
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

  private paymentmethodUrl = `${environment.apiUrl}/PaymentMethod`;
  
  async getPaymentMethod() {
    if(!(this.paymentMethodDataCache.length > 0)){
      const data = await this.http.get<PaymentMethodModel[]>(this.paymentmethodUrl, this.httpOptions)
      .toPromise();
      this.paymentMethodDataCache = data;
      return data;
  }
  else{
    return this.paymentMethodDataCache;
  }
  }

  async onRefreshPaymentMethod(){
    const data = await this.http.get<PaymentMethodModel[]>(this.paymentmethodUrl, this.httpOptions)
    .toPromise();
    this.paymentMethodDataCache = data;
    return data;
  }

  addPaymentMethod(paymentMethodModel: PaymentMethodModel){
    return this.http.post<any>(`${environment.apiUrl}/PaymentMethod`,
    paymentMethodModel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editPaymentMethod(paymentMethodModel: PaymentMethodModel){
    return this.http.put<any>(`${environment.apiUrl}/PaymentMethod/` + paymentMethodModel.id,
    paymentMethodModel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getPaymentMethodByKey(paymentMethodID: number)  {
        return this.paymentMethodDataCache.find(item => item.id == paymentMethodID);
  }

  AddOrEditRecordToCache(paymentMethodModel: PaymentMethodModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.paymentMethodDataCache.findIndex(item => item.id == paymentMethodModel.id);
      this.paymentMethodDataCache[objIndex] = paymentMethodModel;
    }
    else
    {
      this.paymentMethodDataCache.push(paymentMethodModel);
      this.paymentMethodDataCache.sort((a, b) => (a.id > b.id) ? 1 : -1);
    }
  }

  DeletePaymentMethod(paymentMethodID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/PaymentMethod/` + paymentMethodID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(taxID: number) {
    const objIndex = this.paymentMethodDataCache.findIndex(item => item.id == taxID);
    this.paymentMethodDataCache.splice(objIndex,1);
    
  }
}
