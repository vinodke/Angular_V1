import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'org-fat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated: boolean = false;
  title = "jms-app";
  

  constructor() {
  }
  ngAfterContentChecked() {
    setTimeout(() => {
        this.isAuthenticated = localStorage.getItem('userName') != null;
    }, 1);
  }

  ngOnInit(){
    // if  (!this.isAuthenticated)
    // {
    //   this.router.navigate(['/login']);
    // }
  }

  
}
