import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { Router } from "@angular/router";
import { SessionStorageService } from "ngx-store";
import { RestApiService } from "../rest-api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder,
    public router: Router,
    public sessionStorage : SessionStorageService,
    public apimicroservice: RestApiService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'email': new FormControl('', [Validators.required,Validators.email]),
      'password': new FormControl('', [Validators.required]),
     });
  }

  login(){
    let payload = this.loginForm.value;
    this.apimicroservice.managerLogin(payload).subscribe((res) => {
        if(res.status){        
          this.apimicroservice.openSnackbar(res.message);
          this.sessionStorage.set('token', res.token);
          this.sessionStorage.set('userRefId', res.data._id);
          this.sessionStorage.set('userFullName', res.data.firstName + res.data.lastName);
          this.sessionStorage.set('email', res.data.email);
          this.router.navigate(['/employee']);
        }
      },(ERROR:HttpErrorResponse)=>{
        console.log(ERROR);
        this.apimicroservice.openSnackbar(ERROR.error.message);
      }
    );
  }

}
