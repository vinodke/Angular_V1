import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AssetAuditModel } from '../../shared/model/AssetAuditModel';

@Injectable({
  providedIn: 'root'
})
export class AssetAuditService {
    assetAuditDataCache: AssetAuditModel[] = [];
    token = localStorage.getItem('access_token');
    assetAuditDataByKey!: AssetAuditModel;
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

    private assetAuditUrl = `${environment.apiUrl}/Audit`;

    async getAssetAudit() {
        if (!(this.assetAuditDataCache.length > 0)) {
            const data = await this.http.get<AssetAuditModel[]>(this.assetAuditUrl, this.httpOptions)
                .toPromise();
            this.assetAuditDataCache = data;
            return data;
        }
        else {
            return this.assetAuditDataCache;
        }
    }

    async onRefreshAssetAudit() {
        const data = await this.http.get<AssetAuditModel[]>(this.assetAuditUrl, this.httpOptions)
            .toPromise();
        this.assetAuditDataCache = data;
        return this.assetAuditDataCache;
    }

    addAssetAudit(additionalCostDetailsModel: AssetAuditModel) {
        return this.http.post<any>(`${environment.apiUrl}/Audit`,
            additionalCostDetailsModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editAssetAuditmaster(additionalCostDetailsModel: AssetAuditModel) {
        return this.http.put<any>(`${environment.apiUrl}/Audit/` + additionalCostDetailsModel.auditId,
        additionalCostDetailsModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getAssetAuditByKey(additionalCostId: number) {
        return this.assetAuditDataCache.find(item => item.auditId == additionalCostId);
    }

    DeleteAssetAudit(auditId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Audit/` + auditId, this.httpOptions)
       .pipe(tap((res: any) => {
         return res;
       }));
      }
    
      DeleteFromCache(additionalCostId: number) {
        const objIndex = this.assetAuditDataCache.findIndex(item => item.auditId == additionalCostId);
        this.assetAuditDataCache.splice(objIndex,1);
        
      }

      AddOrEditRecordToCache(additionalCostDetailsModel: AssetAuditModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.assetAuditDataCache.findIndex(item => item.auditId == additionalCostDetailsModel.auditId);
          this.assetAuditDataCache[objIndex] = additionalCostDetailsModel;
        }
        else
        {
          this.assetAuditDataCache.push(additionalCostDetailsModel);
          this.assetAuditDataCache.sort((a, b) => (a.auditNo > b.auditNo) ? 1 : -1);
        }
      }
}