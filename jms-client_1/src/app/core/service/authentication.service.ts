import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { AuthResponseData } from '../../shared/interface/authresponsedata';
import { User } from '../../shared/model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(userDetails:User) {
    return this.http.post<AuthResponseData>(`${environment.apiUrl}/User/authenticate`,
      {
        "companyID": userDetails.companyCode,
        "applicationID": "FATWEBUI",
        "userName": userDetails.userName,
        "password": userDetails.password
      })
      .pipe(tap((res: AuthResponseData) => {
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('roleName', res.roleName);
        localStorage.setItem('userName', res.userName);
        localStorage.setItem('appID', 'FATWEBUI');
        localStorage.setItem('employeeID', res.employeeID.toString());
        localStorage.setItem('warehouseID', res.warehouseID.toString());
        //console.log(res.token);
        //console.log(this.someSharedService.serverToken);
        return res;
      }))
  }
}
