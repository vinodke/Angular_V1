import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PurchaseOrderModel } from '../../shared/model/PurchaseOrderModel';

@Injectable({
  providedIn: 'root'
})
export class purchaseorderService {
    purchaseOrderMasterDataCache: PurchaseOrderModel[] = [];
    token = localStorage.getItem('access_token');
    purchaseOrderMasterDataByKey!: PurchaseOrderModel;
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

    private purchaseOrderMasterUrl = `${environment.apiUrl}/PurchaseOrder`;

    DeletePO(PoNumber: string) {
        return this.http.delete<any>(`${environment.apiUrl}/PurchaseOrder/` + PoNumber, this.httpOptions)
       .pipe(tap((res: any) => {
         return res;
       }));
      }

    async getPurchaseMaster() {
        if (!(this.purchaseOrderMasterDataCache.length > 0)) {
            const data = await this.http.get<PurchaseOrderModel[]>(this.purchaseOrderMasterUrl, this.httpOptions)
                .toPromise();
            this.purchaseOrderMasterDataCache = data;
            return data;
        }
        else {
            return this.purchaseOrderMasterDataCache;
        }
    }

    async getViewPurchaseMaster(purchaseOrderModel :PurchaseOrderModel) {
        const data= await this.http.post<PurchaseOrderModel[]>(`${environment.apiUrl}/PurchaseOrder/GetPODetails`,
        purchaseOrderModel, this.httpOptions).toPromise();
        console.log(data);
        return data;
    }

    async onRefreshPurchaseOrderMaster() {
        const data = await this.http.get<PurchaseOrderModel[]>(this.purchaseOrderMasterUrl, this.httpOptions)
            .toPromise();
        this.purchaseOrderMasterDataCache = data;
        return this.purchaseOrderMasterDataCache;
    }

    addPurchaseOrdermaster(receiptMasterModel: PurchaseOrderModel) {
        return this.http.post<any>(`${environment.apiUrl}/PurchaseOrder`,
        receiptMasterModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editPurchaseOrdermaster(receiptMasterModel: PurchaseOrderModel) {
        console.log(receiptMasterModel);
        return this.http.put<any>(`${environment.apiUrl}/PurchaseOrder/` + receiptMasterModel.poNumber,
        receiptMasterModel, this.httpOptions)
            .pipe(tap((res: any) => {
                console.log(res);
                return res;
            }));
    }
    approvePO(poNumber: string) {
        return this.http.post<any>(`${environment.apiUrl}/PurchaseOrder/ApprovePO/` + poNumber,"", this.httpOptions)
            .pipe(tap((res: any) => {
                console.log(res);
                return res;
            }));
    }
    async getPurchaseOrderMasterByKey(poNumber: string) {
        const data = await this.http.get<PurchaseOrderModel>(`${environment.apiUrl}/PurchaseOrder/GetOrderDetailsAsync/` + poNumber
        , this.httpOptions)
        .toPromise();
        console.log(data);
    return data;
    }

    AddOrEditRecordToCache(purchaseOrderMasterModel: PurchaseOrderModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.purchaseOrderMasterDataCache.findIndex(item => item.poNumber == purchaseOrderMasterModel.poNumber);
          this.purchaseOrderMasterDataCache[objIndex] = purchaseOrderMasterModel;
        }
        else
        {
          this.purchaseOrderMasterDataCache.push(purchaseOrderMasterModel);
          this.purchaseOrderMasterDataCache.sort((a, b) => (a.poNumber > b.poNumber) ? 1 : -1);
        }
      }
      
}