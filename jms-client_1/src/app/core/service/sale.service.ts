import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { POReceiptFilter, ReceiptModel } from '../../shared/model/ReceiptModel';
import { ItemListDTO, Sale } from '../../shared/model/Sale';

@Injectable({
  providedIn: 'root'
})
export class saleService {
    ItemSearchList:ItemListDTO[]=[];
    receiptDataCache: ReceiptModel[] = [];
    token = localStorage.getItem('access_token');
    receiptDataByKey!: ReceiptModel;
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

    private receiptUrl = `${environment.apiUrl}/Receipt`;

    DeleteReceipt(receiptNumber: string) {
        return this.http.delete<any>(`${environment.apiUrl}/Receipt/` + receiptNumber, this.httpOptions)
       .pipe(tap((res: any) => {
         return res;
       }));
      }

    async getReceiptMaster() {
        if (!(this.receiptDataCache.length > 0)) {
            const data = await this.http.get<ReceiptModel[]>(this.receiptUrl, this.httpOptions)
                .toPromise();
            this.receiptDataCache = data;
            return data;
        }
        else {
            return this.receiptDataCache;
        }
    }

    async getItemSearchList(filterText:string) {
        const data = await this.http.get<ItemListDTO[]>(`${environment.apiUrl}/Sale/GetItems/` + filterText
        , this.httpOptions)
        .toPromise();
        console.log(data);
            return data;
    }

    async getViewReceipt(receiptFilterModel :POReceiptFilter) {
        const data= await this.http.post<ReceiptModel[]>(`${environment.apiUrl}/Receipt/GetReceiptViewDetails`,
        receiptFilterModel, this.httpOptions).toPromise();
        console.log(data);
        return data;
    }

    async getEditViewReceipt(receiptFilterModel :POReceiptFilter) {
        const data= await this.http.post<ReceiptModel[]>(`${environment.apiUrl}/Receipt/GetReceiptEditViewDetails`,
        receiptFilterModel, this.httpOptions).toPromise();
        console.log(data);
        return data;
    }

    async getReceiptDetails(receiptModel :POReceiptFilter) {
        const data= await this.http.post<ReceiptModel>(`${environment.apiUrl}/Receipt/GetReceiptPODetails`,
        receiptModel, this.httpOptions).toPromise();
        console.log(data);
        return data;
    }

    async onRefreshPurchaseOrderMaster() {
        const data = await this.http.get<ReceiptModel[]>(this.receiptUrl, this.httpOptions)
            .toPromise();
        this.receiptDataCache = data;
        return this.receiptDataCache;
    }

    addSale(saleModel: Sale) {
        return this.http.post<any>(`${environment.apiUrl}/Sale/SaveSale`,
        saleModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editReceipt(receiptMasterModel: ReceiptModel) {
        console.log(receiptMasterModel);
        return this.http.put<any>(`${environment.apiUrl}/Receipt/` + receiptMasterModel.receiptNumber,
        receiptMasterModel, this.httpOptions)
            .pipe(tap((res: any) => {
                console.log(res);
                return res;
            }));
    }
    approveReceipt(receiptNumber: string) {
        return this.http.post<any>(`${environment.apiUrl}/Receipt/ApproveReceipt/` + receiptNumber,'', this.httpOptions)
            .pipe(tap((res: any) => {
                console.log(res);
                return res;
            }));
    }
    async getReceiptByKey(receiptNumber: string) {
        const data = await this.http.get<ReceiptModel>(`${environment.apiUrl}/Receipt/GetReceiptDetailsAsync/` + receiptNumber
        , this.httpOptions)
        .toPromise();
        console.log(data);
    return data;
    }

    AddOrEditRecordToCache(purchaseOrderMasterModel: ReceiptModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.receiptDataCache.findIndex(item => item.receiptNumber == purchaseOrderMasterModel.receiptNumber);
          this.receiptDataCache[objIndex] = purchaseOrderMasterModel;
        }
        else
        {
          this.receiptDataCache.push(purchaseOrderMasterModel);
          this.receiptDataCache.sort((a, b) => (a.receiptNumber > b.receiptNumber) ? 1 : -1);
        }
      }
      
}