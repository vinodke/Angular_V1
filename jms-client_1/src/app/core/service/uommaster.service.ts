import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UOMMasterModel } from '../../shared/model/UOMMasterModel';


@Injectable({
  providedIn: 'root'
})
export class uommasterservice {
  uomMasterDataCache: UOMMasterModel[] = [];
  token = localStorage.getItem('access_token');
  uomDataByKey!: UOMMasterModel;
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

  private uomMasterUrl = `${environment.apiUrl}/UOM`;
  
  async getUOMMaster() {
    if(!(this.uomMasterDataCache.length > 0)){
      const data = await this.http.get<UOMMasterModel[]>(this.uomMasterUrl, this.httpOptions)
      .toPromise();
      this.uomMasterDataCache = data;
      return data;
  }
  else{
    return this.uomMasterDataCache;
  }
  }

  async onRefreshUOMMaster(){
    const data = await this.http.get<UOMMasterModel[]>(this.uomMasterUrl, this.httpOptions)
    .toPromise();
    this.uomMasterDataCache = data;
    return data;
  }

  addUOMmaster(uomMasterModel: UOMMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/UOM`,
    uomMasterModel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editUOMMaster(uomMasterModel: UOMMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/UOM/` + uomMasterModel.id,
    uomMasterModel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getUOMMasterByKey(UOMID: number)  {
        return this.uomMasterDataCache.find(item => item.id == UOMID);
  }

  AddOrEditRecordToCache(uomMasterModel: UOMMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.uomMasterDataCache.findIndex(item => item.id == uomMasterModel.id);
      this.uomMasterDataCache[objIndex] = uomMasterModel;
    }
    else
    {
      this.uomMasterDataCache.push(uomMasterModel);
      this.uomMasterDataCache.sort((a, b) => (a.uomCode > b.uomCode) ? 1 : -1);
    }
  }

  DeleteMaster(ID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/UOM/` + ID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(ID: number) {
    const objIndex = this.uomMasterDataCache.findIndex(item => item.id == ID);
    this.uomMasterDataCache.splice(objIndex,1);
    
  }
}
