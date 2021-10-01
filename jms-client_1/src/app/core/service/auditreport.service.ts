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
import { AuditReport, AuditReportDetail, AuditReportFilter } from 'src/app/shared/model/auditreport';

@Injectable({
  providedIn: 'root'
})
export class AuditreportService {
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


    private receiptUrl = `${environment.apiUrl}/Audit`;

    async getAuditReportSummary(AuditReportFilterModel :AuditReportFilter) {
   
        const data= await this.http.post<AuditReport[]>(`${environment.apiUrl}/Audit/GetAuditHeadReport`,
        AuditReportFilterModel, this.httpOptions).toPromise();
        console.log(data);
        return data;
    }

    async getAuditReportDetail(AuditReportFilterModel :AuditReportFilter) {
        const data= await this.http.post<AuditReportDetail[]>(`${environment.apiUrl}/Audit/GetAuditDetailWebReport`,
        {
          "auditID": AuditReportFilterModel.auditID
        }, this.httpOptions).toPromise();
        console.log(data);
        return data;
    }

}
