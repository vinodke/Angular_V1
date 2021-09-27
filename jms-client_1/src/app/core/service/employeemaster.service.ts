import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { EmployeeMasterModel } from '../../shared/model//EmployeeMasterModel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeMasterService {
    employeeMasterDataCache: EmployeeMasterModel[] = [];
    token = localStorage.getItem('access_token');
    employeeMasterDataByKey!: EmployeeMasterModel;
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

    private employeeMasterUrl = `${environment.apiUrl}/Employee`;

    async getEmployeeMaster() {
        if (!(this.employeeMasterDataCache.length > 0)) {
            const data = await this.http.get<EmployeeMasterModel[]>(this.employeeMasterUrl, this.httpOptions)
                .toPromise();
            this.employeeMasterDataCache = data;
            return data;
        }
        else {
            return this.employeeMasterDataCache;
        }
    }

    async onRefreshEmployeeMaster() {
        const data = await this.http.get<EmployeeMasterModel[]>(this.employeeMasterUrl, this.httpOptions)
            .toPromise();
        this.employeeMasterDataCache = data;
        return this.employeeMasterDataCache;
    }

    addEmployeemaster(employeeMasterModel: EmployeeMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Employee`,
            employeeMasterModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editEmployeemaster(employeeMasterModel: EmployeeMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Employee/` + employeeMasterModel.id,
            employeeMasterModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getEmployeeMasterByKey(employeeId: number) {
        return this.employeeMasterDataCache.find(item => item.id == employeeId);
    }

    AddOrEditRecordToCache(employeeMasterModel: EmployeeMasterModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.employeeMasterDataCache.findIndex(item => item.id == employeeMasterModel.id);
          this.employeeMasterDataCache[objIndex] = employeeMasterModel;
        }
        else
        {
          this.employeeMasterDataCache.push(employeeMasterModel);
          this.employeeMasterDataCache.sort((a, b) => (a.employeeCode > b.employeeCode) ? 1 : -1);
        }
      }

      DeleteEmployeeMaster(employeeId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Employee/` + employeeId, this.httpOptions)
       .pipe(tap((res: any) => {
         return res;
       }));
      }
    
      DeleteFromCache(employeeId: number) {
        const objIndex = this.employeeMasterDataCache.findIndex(item => item.id == employeeId);
        this.employeeMasterDataCache.splice(objIndex,1);
        
      }
}