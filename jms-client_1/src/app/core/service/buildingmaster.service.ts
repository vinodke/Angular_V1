import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BuildingMasterModel } from '../../shared/model//BuildingMasterModel';

@Injectable({
  providedIn: 'root'
})
export class BuildingmasterService {
    buildingmasterDataCache: BuildingMasterModel[] = [];
    token = localStorage.getItem('access_token');
    buildingMasterDataByKey!: BuildingMasterModel;
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

    private buildingMasterUrl = `${environment.apiUrl}/Building`;

    async getBuildingMaster() {
        if (!(this.buildingmasterDataCache.length > 0)) {
            const data = await this.http.get<BuildingMasterModel[]>(this.buildingMasterUrl, this.httpOptions)
                .toPromise();
            this.buildingmasterDataCache = data;
            return data;
        }
        else {
            return this.buildingmasterDataCache;
        }
    }

    async onRefreshBuildingmaster() {
        const data = await this.http.get<BuildingMasterModel[]>(this.buildingMasterUrl, this.httpOptions)
            .toPromise();
        this.buildingmasterDataCache = data;
        return this.buildingmasterDataCache;
    }

    addBuildingmaster(buildingmastermodel: BuildingMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Building`,
            buildingmastermodel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editBuildingmaster(buildingmastermodel: BuildingMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Building/` + buildingmastermodel.buildingID,
            buildingmastermodel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    getBuildingMasterByKey(buildingID: number) {
        return this.buildingmasterDataCache.find(item => item.buildingID == buildingID);
    }

    AddOrEditRecordToCache(buildingmastermodel: BuildingMasterModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.buildingmasterDataCache.findIndex(item => item.buildingID == buildingmastermodel.buildingID);
          this.buildingmasterDataCache[objIndex] = buildingmastermodel;
        }
        else
        {
          this.buildingmasterDataCache.push(buildingmastermodel);
          this.buildingmasterDataCache.sort((a, b) => (a.buildingCode > b.buildingCode) ? 1 : -1);
        }
      }

      DeleteBuildingMaster(buildingID: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Building/` + buildingID, this.httpOptions)
       .pipe(tap((res: any) => {
         return res;
       }));
      }
    
      DeleteFromCache(buildingID: number) {
        const objIndex = this.buildingmasterDataCache.findIndex(item => item.buildingID == buildingID);
        this.buildingmasterDataCache.splice(objIndex,1);
        
      }
}