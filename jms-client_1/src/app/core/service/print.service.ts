import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PrintModel } from '../../shared/model/PrintModel';
import { POReceiptFilter, ReceiptModel } from '../../shared/model/ReceiptModel';
import { ItemListDTO, Sale } from '../../shared/model/Sale';

@Injectable({
  providedIn: 'root'
})
export class printService {
    ItemSearchList:ItemListDTO[]=[];
    serialDataCache: PrintModel[] = [];
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

    private receiptUrl = `${environment.apiUrl}/Print`;

    DeleteReceipt(receiptNumber: string) {
        return this.http.delete<any>(`${environment.apiUrl}/Receipt/` + receiptNumber, this.httpOptions)
       .pipe(tap((res: any) => {
         return res;
       }));
      }

    async getSerials(DocumentNo:string) {
        const data = await this.http.get<PrintModel[]>(`${environment.apiUrl}/Print/GetSerials/` + DocumentNo
        , this.httpOptions)
        .toPromise();
    this.serialDataCache = data;
    return data;
    }

    async getRePrintData() {
        const data = await this.http.get<PrintModel[]>(`${environment.apiUrl}/Print/GetRePrintData/`
        , this.httpOptions)
        .toPromise();
    this.serialDataCache = data;
    return data;
    }


    updatePrint(printModel: PrintModel[]) {
        return this.http.post<any>(`${environment.apiUrl}/Print/SavePrint`,
        printModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
      
}