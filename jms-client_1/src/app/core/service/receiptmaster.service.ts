import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ReceiptMasterModel } from '../../shared/model//ReceiptMasterModel';

@Injectable({
  providedIn: 'root'
})
export class ReceiptMasterService {
    receiptMasterDataCache: ReceiptMasterModel[] = [];
    token = localStorage.getItem('access_token');
    receiptMasterDataByKey!: ReceiptMasterModel;
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

    private receiptMasterUrl = `${environment.apiUrl}/Receipt`;

    async getReceiptMaster() {
        if (!(this.receiptMasterDataCache.length > 0)) {
            const data = await this.http.get<ReceiptMasterModel[]>(this.receiptMasterUrl, this.httpOptions)
                .toPromise();
            this.receiptMasterDataCache = data;
            return data;
        }
        else {
            return this.receiptMasterDataCache;
        }
    }

    async onRefreshReceiptMaster() {
        const data = await this.http.get<ReceiptMasterModel[]>(this.receiptMasterUrl, this.httpOptions)
            .toPromise();
        this.receiptMasterDataCache = data;
        return this.receiptMasterDataCache;
    }

    addReceiptmaster(ReceiptMasterModel: ReceiptMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Receipt`,
            ReceiptMasterModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editReceiptmaster(receiptMasterModel: ReceiptMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Receipt/` + receiptMasterModel.receiptId,
        receiptMasterModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getReceiptMasterByKey(receiptId: string) {
        return this.receiptMasterDataCache.find(item => item.receiptId == receiptId);
    }

    AddOrEditRecordToCache(receiptMasterModel: ReceiptMasterModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.receiptMasterDataCache.findIndex(item => item.receiptId == receiptMasterModel.receiptId);
          this.receiptMasterDataCache[objIndex] = receiptMasterModel;
        }
        else
        {
          this.receiptMasterDataCache.push(receiptMasterModel);
          this.receiptMasterDataCache.sort((a, b) => (a.receiptId > b.receiptId) ? 1 : -1);
        }
      }
      
}