import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ColorMasterModel } from '../../shared/model/ColorMasterModel';

@Injectable({
  providedIn: 'root'
})
export class colormasterservice {
  colorMasterDataCache: ColorMasterModel[] = [];
  token = localStorage.getItem('access_token');
  colorDataByKey!: ColorMasterModel;
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

  private colorMasterUrl = `${environment.apiUrl}/Color`;
  
  async getColorMaster() {
    if(!(this.colorMasterDataCache.length > 0)){
      const data = await this.http.get<ColorMasterModel[]>(this.colorMasterUrl, this.httpOptions)
      .toPromise();
      this.colorMasterDataCache = data;
      return data;
  }
  else{
    return this.colorMasterDataCache;
  }
  }

  async onRefreshColorMaster(){
    const data = await this.http.get<ColorMasterModel[]>(this.colorMasterUrl, this.httpOptions)
    .toPromise();
    this.colorMasterDataCache = data;
    return data;
  }

  addColormaster(colorMasterModel: ColorMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/Color`,
    colorMasterModel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editColorMaster(colorMasterModel: ColorMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/Color/` + colorMasterModel.id,
    colorMasterModel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getColorMasterByKey(ID: number)  {
        return this.colorMasterDataCache.find(item => item.id == ID);
  }

  AddOrEditRecordToCache(colorMasterModel: ColorMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.colorMasterDataCache.findIndex(item => item.id == colorMasterModel.id);
      this.colorMasterDataCache[objIndex] = colorMasterModel;
    }
    else
    {
      this.colorMasterDataCache.push(colorMasterModel);
      this.colorMasterDataCache.sort((a, b) => (a.colorCode > b.colorCode) ? 1 : -1);
    }
  }

  DeleteMaster(ID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Color/` + ID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(ID: number) {
    const objIndex = this.colorMasterDataCache.findIndex(item => item.id == ID);
    this.colorMasterDataCache.splice(objIndex,1);
    
  }
}
