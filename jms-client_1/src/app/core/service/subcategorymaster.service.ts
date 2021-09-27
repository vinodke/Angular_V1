import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SubCategoryMasterModel } from '../../shared/model/SubCategoryMasterModel';

@Injectable({
  providedIn: 'root'
})
export class subcategorymasterservice {
  subCategoryMasterDataCache: SubCategoryMasterModel[] = [];
  token = localStorage.getItem('access_token');
  subCategoryMasterDataByKey!: SubCategoryMasterModel;
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

  private subcategoryMasterUrl = `${environment.apiUrl}/SubCategory`;
  
  async getSubCategoryMaster() {
    if(!(this.subCategoryMasterDataCache.length > 0)){
      const data = await this.http.get<SubCategoryMasterModel[]>(this.subcategoryMasterUrl, this.httpOptions)
      .toPromise();
      this.subCategoryMasterDataCache = data;
      return data;
  }
  else{
    return this.subCategoryMasterDataCache;
  }
  }

  async onRefreshSubCategoryMaster(){
    const data = await this.http.get<SubCategoryMasterModel[]>(this.subcategoryMasterUrl, this.httpOptions)
    .toPromise();
    this.subCategoryMasterDataCache = data;
    return data;
  }

  addSubCategorymaster(subCategoryMastermodel: SubCategoryMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/SubCategory`,
          subCategoryMastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editSubCategoryMaster(subCategoryMasterModel: SubCategoryMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/SubCategory/` + subCategoryMasterModel.id,
    subCategoryMasterModel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getSubCategoryMasterByKey(SubCategoryID: number)  {
        return this.subCategoryMasterDataCache.find(item => item.id == SubCategoryID);
  }

  AddOrEditRecordToCache(subCategoryMastermodel: SubCategoryMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.subCategoryMasterDataCache.findIndex(item => item.id == subCategoryMastermodel.id);
      this.subCategoryMasterDataCache[objIndex] = subCategoryMastermodel;
    }
    else
    {
      this.subCategoryMasterDataCache.push(subCategoryMastermodel);
      this.subCategoryMasterDataCache.sort((a, b) => (a.subCategoryCode > b.subCategoryCode) ? 1 : -1);
    }
  }

  DeleteMaster(SubCategoryID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/SubCategory/` + SubCategoryID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(SubCategoryID: number) {
    const objIndex = this.subCategoryMasterDataCache.findIndex(item => item.id == SubCategoryID);
    this.subCategoryMasterDataCache.splice(objIndex,1);
    
  }

}
