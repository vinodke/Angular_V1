import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { KaratMasterModel } from '../../shared/model/KaratMasterModel';

@Injectable({
  providedIn: 'root'
})
export class karatmasterservice {
  karatMasterDataCache: KaratMasterModel[] = [];
  token = localStorage.getItem('access_token');
  karatDataByKey!: KaratMasterModel;
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

  private karatMasterUrl = `${environment.apiUrl}/Karat`;
  
  async getKaratMaster() {
    if(!(this.karatMasterDataCache.length > 0)){
      const data = await this.http.get<KaratMasterModel[]>(this.karatMasterUrl, this.httpOptions)
      .toPromise();
      this.karatMasterDataCache = data;
      return data;
  }
  else{
    return this.karatMasterDataCache;
  }
  }

  async onRefreshKaratMaster(){
    const data = await this.http.get<KaratMasterModel[]>(this.karatMasterUrl, this.httpOptions)
    .toPromise();
    this.karatMasterDataCache = data;
    return data;
  }

  addKaratmaster(karatMastermodel: KaratMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/Karat`,
          karatMastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editKaratMaster(karatMastermodel: KaratMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/Karat/` + karatMastermodel.id,
         karatMastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getKaratMasterByKey(KaratID: number)  {
        return this.karatMasterDataCache.find(item => item.id == KaratID);
  }

  AddOrEditRecordToCache(karatMastermodel: KaratMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.karatMasterDataCache.findIndex(item => item.id == karatMastermodel.id);
      this.karatMasterDataCache[objIndex] = karatMastermodel;
    }
    else
    {
      this.karatMasterDataCache.push(karatMastermodel);
      this.karatMasterDataCache.sort((a, b) => (a.karatCode > b.karatCode) ? 1 : -1);
    }
  }

  DeleteMaster(karatID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Karat/` + karatID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(karatID: number) {
    const objIndex = this.karatMasterDataCache.findIndex(item => item.id == karatID);
    this.karatMasterDataCache.splice(objIndex,1);
    
  }
}
