import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppComponent } from '../../app.component';
import { AuthResponseData } from '../../shared/interface/authresponsedata';
import { User } from '../../shared/model/user';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'org-fat-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;

  /***************Declarations*******************/
  loginForm: FormGroup;
  loading = false;
  error = '';

  /**********************************************/
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public myapp: AppComponent) {

    // redirect to home if already logged in
    this.loginForm = formBuilder.group({
      title: formBuilder.control('Hello', Validators.required)
    });
  }

  ngOnInit(): void {
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      //companycode: [null, Validators.required]
    });
    this.myapp.isAuthenticated = false;
  }

  getLoginDetails(): User {
    let user = new User();
    user.userName = this.loginForm.controls.username.value;
    user.password = this.loginForm.controls.password.value;
    user.companyCode = "HOST";
    return user;
  }

  get loginFormControls() { return this.loginForm.controls; }

  onSubmit() {
    let authObservable: Observable<AuthResponseData>;
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
  }
      this.loading = true;
    authObservable = this.authenticationService.login(this.getLoginDetails());
    

    authObservable.subscribe(
      result => {
        this.myapp.isAuthenticated = true;
        this.router.navigate(['/dashboard']);
      },
      err => {
        console.log(err.error ? err.error.message : err.message);
        this.error = err.error ? err.error.message : err.message;
        this.loading = false;
      }
    );
  }
}


