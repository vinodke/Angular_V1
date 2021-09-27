import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
  })

  export class DownloadService {
    token = localStorage.getItem('access_token');
    headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.token);
    httpOptions = {
        responseType: 'blob' as 'json',
        headers: this.headers
    };

    constructor(private http: HttpClient) { }
    
    DownloadFile(documentId: string) {
       return this.http.get( `${environment.apiUrl}/Files/` + documentId, this.httpOptions);
      }
  }