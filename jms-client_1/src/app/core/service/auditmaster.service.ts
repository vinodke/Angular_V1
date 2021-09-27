import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { audit, map, tap } from 'rxjs/operators';
import { AuditMasterModel } from '../../shared/model/audit-master-model';
import { AuditVerifyModel } from '../../shared/model/audit-verify-model';

@Injectable({
  providedIn: 'root'
})
export class AuditmasterService {

  auditMasterDataCache: AuditMasterModel[] = [];
  token = localStorage.getItem('access_token');
  auditMasterDataByKey!: AuditMasterModel;
  selectedrowevent = new Subject<any>();
  refreshClickevent = new Subject<any>();
  headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
  httpOptions = {
    headers: this.headers
  };

  constructor(private http: HttpClient,
    private router: Router) { }

  private auditMasterUrl = `${environment.apiUrl}/Audit`;

  async getAuditMaster() {
    if (!(this.auditMasterDataCache.length > 0)) {
      const data = await this.http.post<AuditMasterModel[]>(this.auditMasterUrl + '/GetAuditHead', {
        "auditID": "",
        "companyID": "",
        "warehouseID": "",
        "status":""
      }, this.httpOptions)
        .toPromise();
      this.auditMasterDataCache = data;
      return data;
    }
    else {
      return this.auditMasterDataCache;
    }
  }

  async getAuditVerifyReport(auditID: string) {
      const data = await this.http.post<AuditVerifyModel[]>(this.auditMasterUrl + '/GetAuditReport', {
        "auditID": auditID,
        "companyID": "HOST",
        "warehouseID": "1",
      },  this.httpOptions)
        .toPromise();
      return data;
  }
  async onRefreshAuditVerifyReport() {
      const data = await this.http.post<AuditVerifyModel[]>(this.auditMasterUrl + '/GetAuditReport', {

      },  this.httpOptions)
        .toPromise();
      return data;
  }

  async onRefreshAuditMaster() {
    const data = await this.http.post<AuditMasterModel[]>(this.auditMasterUrl + '/GetAuditHead',
      {
        "auditID": "",
        "companyID": "",
        "warehouseID": "",
        "status": ""
      },
      this.httpOptions)
      .toPromise();
    this.auditMasterDataCache = data;
    return this.auditMasterDataCache;
  }

  addAuditmaster(auditMasterModel: AuditMasterModel) {
    return this.http.post<any>(`${environment.apiUrl}/Audit/CreateAudit`,
      auditMasterModel
      , this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  editAuditmaster(auditMasterModel: AuditMasterModel) {
    return this.http.post<any>(`${environment.apiUrl}/Audit/EditAudit`,
      auditMasterModel, this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  async getCondidateList(audit:any) {
    const data = await this.http.post<any>(`${environment.apiUrl}/Audit/GetAuditCandidateList`,audit, this.httpOptions)
      .toPromise();
    return data;
  }

  getAuditMasterByKey(auditId: string) {
    return this.auditMasterDataCache.find(item => item.auditID == auditId);
  }

  AddOrEditRecordToCache(auditMasterModel: AuditMasterModel, editMode: boolean) {
    if (editMode) {
      const objIndex = this.auditMasterDataCache.findIndex(item => item.auditID == auditMasterModel.auditID);
      this.auditMasterDataCache[objIndex] = auditMasterModel;
    }
    else {
      this.auditMasterDataCache.push(auditMasterModel);
      this.auditMasterDataCache.sort((a, b) => (a.ItemName > b.ItemName) ? 1 : -1);
    }
  }

  DeleteAuditMaster(auditId: string) {
    return this.http.delete<any>(`${environment.apiUrl}/Audit/` + auditId, this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  DeleteFromCache(auditId: string) {
    const objIndex = this.auditMasterDataCache.findIndex(item => item.auditID == auditId);
    this.auditMasterDataCache.splice(objIndex, 1);
  }


  releaseAuditmaster(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/Audit/ReleaseAudit`,
      data, this.httpOptions)
      .pipe(tap((res: any) => {
        return res;
      }));
  }

  veridyAuditmaster(auditId: string, data: any) {
    debugger
    return this.http.post<any>(`${environment.apiUrl}/Audit/AcceptLocationMismatch/` + auditId,
      data, this.httpOptions)
      .pipe(tap((res: any) => {
        debugger
        return res;
      }));
  }
}
