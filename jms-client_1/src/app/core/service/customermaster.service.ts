import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CustomerMasterModel } from '../../shared/model/CustomerMasterModel';

@Injectable({
  providedIn: 'root'
})
export class customerMasterService {
    customerMasterDataCache: CustomerMasterModel[] = [];
    token = localStorage.getItem('access_token');
    customerMasterDataByKey!: CustomerMasterModel;
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

    private customerMasterUrl = `${environment.apiUrl}/Customer`;

    async getCustomerMaster() {
        if (!(this.customerMasterDataCache.length > 0)) {
            const data = await this.http.get<CustomerMasterModel[]>(this.customerMasterUrl, this.httpOptions)
                .toPromise();
            this.customerMasterDataCache = data;
            return data;
        }
        else {
            return this.customerMasterDataCache;
        }
    }

    async getCustomerList(filterText:string | number) {
        if (!(this.customerMasterDataCache.length > 0)) {
            const data = await this.http.get<CustomerMasterModel[]>(this.customerMasterUrl, this.httpOptions)
                .toPromise();
            this.customerMasterDataCache = data;
            if(!isNaN(Number(filterText.toString())))
            {
                const filterData=this.customerMasterDataCache.filter(item=>item.contactNumber.includes(filterText.toString()));
                return filterData;
            }
            else
            {
                const filterData=this.customerMasterDataCache.filter(item=>item.customerName.includes(filterText.toString()));
                return filterData;
            }
        }
        else {
            if(!isNaN(Number(filterText.toString())))
            {
                const filterData=this.customerMasterDataCache.filter(item=>item.contactNumber.includes(filterText.toString()));
                return filterData;
            }
            else
            {
                const filterData=this.customerMasterDataCache.filter(item=>item.customerName.includes(filterText.toString()));
                return filterData;
            }
        }
    }

    async onRefreshCustomerMaster() {
        const data = await this.http.get<CustomerMasterModel[]>(this.customerMasterUrl, this.httpOptions)
            .toPromise();
        this.customerMasterDataCache = data;
        return this.customerMasterDataCache;
    }

    addCustomermaster(customerMasterModel: CustomerMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Customer`,
            customerMasterModel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editCustomermaster(customerMasterModel: CustomerMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Customer/` + customerMasterModel.id,
        customerMasterModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getCustomerMasterByKey(customerId: number) {
        return this.customerMasterDataCache.find(item => item.id == customerId);
    }

    AddOrEditRecordToCache(customerMasterModel: CustomerMasterModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.customerMasterDataCache.findIndex(item => item.id == customerMasterModel.id);
          this.customerMasterDataCache[objIndex] = customerMasterModel;
        }
        else
        {
          this.customerMasterDataCache.push(customerMasterModel);
          this.customerMasterDataCache.sort((a, b) => (a.customerCode > b.customerCode) ? 1 : -1);
        }
      }

      DeleteCustomerMaster(customerId: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Customer/` + customerId, this.httpOptions)
       .pipe(tap((res: any) => {
         return res;
       }));
      }
    
      DeleteFromCache(customerId: number) {
        const objIndex = this.customerMasterDataCache.findIndex(item => item.id == customerId);
        this.customerMasterDataCache.splice(objIndex,1);
        
      }
}