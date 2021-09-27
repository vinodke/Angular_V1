import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ItemMasterModel } from '../../shared/model/ItemMasterModel';

@Injectable({
  providedIn: 'root'
})
export class itemMasterService {
    itemmasterDataCache: ItemMasterModel[] = [];
    token = localStorage.getItem('access_token');
    itemMasterDataByKey!: ItemMasterModel;
    selectedrowevent= new Subject<any>();
    refreshClickevent= new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private itemMasterUrl = `${environment.apiUrl}/Item`;

    async getItemMaster() {
        if (!(this.itemmasterDataCache.length > 0)) {
            const data = await this.http.get<ItemMasterModel[]>(this.itemMasterUrl, this.httpOptions)
                .toPromise();
            this.itemmasterDataCache = data;
            return data;
        }
        else {
            return this.itemmasterDataCache;
        }
    }

    async onRefreshItemmaster() {
        const data = await this.http.get<ItemMasterModel[]>(this.itemMasterUrl, this.httpOptions)
            .toPromise();
        this.itemmasterDataCache = data;
        return data;
    }

    addItemmaster(formData: FormData) {
        formData.forEach((value,key) => {
            console.log(key+"-"+value)
          });
        return this.http.post<any>(`${environment.apiUrl}/Item`,
        formData
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editItemmaster(itemMasterModel: FormData,id:string) {
        return this.http.put<any>(`${environment.apiUrl}/Item/` + id,
            itemMasterModel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getItemMasterByKey(itemID: number) {
        return this.itemmasterDataCache.find(item => item.id == itemID);
    }

    AddOrEditRecordToCache(itemMasterModel: ItemMasterModel, editMode: boolean){
        if(editMode)
        {
          const objIndex = this.itemmasterDataCache.findIndex(item => item.id == itemMasterModel.id);
          this.itemmasterDataCache[objIndex] = itemMasterModel;
        }
        else
        {
          this.itemmasterDataCache.push(itemMasterModel);
          this.itemmasterDataCache.sort((a, b) => (a.itemCode > b.itemCode) ? 1 : -1);
        }
      }

      DeleteItemMaster(itemID: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Item/` + itemID, this.httpOptions)
       .pipe(tap((res: any) => {
         return res;
       }));
      }
    
      DeleteFromCache(itemID: number) {
        const objIndex = this.itemmasterDataCache.findIndex(item => item.id == itemID);
        this.itemmasterDataCache.splice(objIndex,1);
        
      }
}