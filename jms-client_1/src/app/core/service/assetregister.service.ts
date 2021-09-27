import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AssetRegisterDetailsModel } from '../../shared/model/AssetRegisterDetailsModel';
import { AssetRegisterModel } from '../../shared/model/AssetRegisterModel';

@Injectable({
  providedIn: 'root'
})
export class AssetRegisterService {
    assetRegisterDataCache: AssetRegisterModel[] = [];
    token = localStorage.getItem('access_token');
    assetRegisterDataByKey!: AssetRegisterModel;
    assetRegisterDetailsDataCache: AssetRegisterDetailsModel[] = [];
    selectedrowevent= new Subject<any>();
    refreshClickevent= new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token);
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private assetRegisterUrl = `${environment.apiUrl}/Asset`;

    async getAssetRegister() {
        if (!(this.assetRegisterDataCache.length > 0)) {
            const data = await this.http.get<AssetRegisterModel[]>(this.assetRegisterUrl, this.httpOptions)
                .toPromise();
            this.assetRegisterDataCache = data;
            return data;
        }
        else {
            return this.assetRegisterDataCache;
        }
    }

    getAssetRegisterDetails(serialNumber: string) {
        const data = this.http.get<AssetRegisterDetailsModel>(this.assetRegisterUrl + '/' + serialNumber + '/details', this.httpOptions);
        return data;
    }

    async onRefreshAssetRegister() {
        const data = await this.http.get<AssetRegisterModel[]>(this.assetRegisterUrl, this.httpOptions)
            .toPromise();
        this.assetRegisterDataCache = data;
        return this.assetRegisterDataCache;
    }

    addRegistermaster(formData: FormData) {
        return this.http.post<any>(`${environment.apiUrl}/Asset`,
            formData
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editRegistermaster(formData: FormData, serialNo: string) {
        return this.http.put<any>(`${environment.apiUrl}/Asset/` + serialNo,
            formData, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getAssetRegisterByKey(serialNumber: string) {
        const data =  this.http.get<AssetRegisterModel>(this.assetRegisterUrl + '/' + serialNumber, this.httpOptions);
        return data;
        //return this.assetRegisterDataCache.find(item => item.serialNo == serialNumber);
    }

    DeleteAssetRegister(assetRegisterId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Asset/` + assetRegisterId, this.httpOptions)
       .pipe(tap((res: any) => {
         return res;
       }));
      }
    
      DeleteFromCache(assetRegisterId: number) {
        const objIndex = this.assetRegisterDataCache.findIndex(item => item.assetRegisterId == assetRegisterId);
        this.assetRegisterDataCache.splice(objIndex,1);
        
      }

      AddOrEditRecordToCache(assetRegisterModel: AssetRegisterModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.assetRegisterDataCache.findIndex(item => item.serialNo == assetRegisterModel.serialNo);
          this.assetRegisterDataCache[objIndex] = assetRegisterModel;
        }
        else
        {
          this.assetRegisterDataCache.push(assetRegisterModel);
          this.assetRegisterDataCache.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : -1);
        }
      }
}