import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SideMenuItems } from '../../shared/model/SideMenuItems';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SidebarnavService {
    token = localStorage.getItem('access_token');
    roleName = localStorage.getItem('roleName');
    
    headers = new HttpHeaders()
    .set('authorization', "Bearer " + this.token)
    .set('Content-Type', 'application/json');;
    appID = localStorage.getItem('appID');
    httpOptions = {
        headers: this.headers
    };
    appRoleMenuURL = `${environment.apiUrl}/AppRoleMenu/` + this.appID + '/' + this.roleName;
 
  constructor(private http: HttpClient) { }

 
  getSideNavItems() {
    console.log(this.appRoleMenuURL);
    return this.http.get<SideMenuItems[]>(this.appRoleMenuURL, this.httpOptions);
  }

  ngAfterViewInit() {
    $('[data-widget="treeview"]').Treeview('init'); 
  }

  
}
