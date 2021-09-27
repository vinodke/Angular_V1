import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgInputNumberField } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CategoryMasterModel } from '../../shared/model/CategoryMasterModel';

@Injectable({
  providedIn: 'root'
})
export class categorymasterservice {
  categoryMasterDataCache: CategoryMasterModel[] = [];
  token = localStorage.getItem('access_token');
  categoryDataByKey!: CategoryMasterModel;
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

  private categoryMasterUrl = `${environment.apiUrl}/Category`;
  
  async getCategoryMaster() {
    if(!(this.categoryMasterDataCache.length > 0)){
      const data = await this.http.get<CategoryMasterModel[]>(this.categoryMasterUrl, this.httpOptions)
      .toPromise();
      this.categoryMasterDataCache = data;
      return data;
  }
  else{
    return this.categoryMasterDataCache;
  }
  }

  async onRefreshCategoryMaster(){
    const data = await this.http.get<CategoryMasterModel[]>(this.categoryMasterUrl, this.httpOptions)
    .toPromise();
    this.categoryMasterDataCache = data;
    return data;
  }

  addCategorymaster(categoryMastermodel: CategoryMasterModel){
    return this.http.post<any>(`${environment.apiUrl}/Category`,
    categoryMastermodel
        , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }

  editCategoryMaster(categoryMastermodel: CategoryMasterModel){
    return this.http.put<any>(`${environment.apiUrl}/Category/` + categoryMastermodel.id,
    categoryMastermodel , this.httpOptions)
        .pipe(tap((res: any) => {
          return res;
        }));
  }
  getCategoryMasterByKey(categoryID: number)  {
        return this.categoryMasterDataCache.find(item => item.id == categoryID);
  }

  AddOrEditRecordToCache(categoryMastermodel: CategoryMasterModel, editMode: boolean){
    if(editMode)
    {
      const objIndex = this.categoryMasterDataCache.findIndex(item => item.id == categoryMastermodel.id);
      this.categoryMasterDataCache[objIndex] = categoryMastermodel;
    }
    else
    {
      this.categoryMasterDataCache.push(categoryMastermodel);
      this.categoryMasterDataCache.sort((a, b) => (a.categoryCode > b.categoryCode) ? 1 : -1);
    }
  }

  DeleteMaster(ID: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Category/` + ID, this.httpOptions)
   .pipe(tap((res: any) => {
     return res;
   }));
  }

  DeleteFromCache(ID: number) {
    const objIndex = this.categoryMasterDataCache.findIndex(item => item.id == ID);
    this.categoryMasterDataCache.splice(objIndex,1);
    
  }
}
