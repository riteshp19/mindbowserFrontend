import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import {FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { RestApiService } from "../rest-api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder,
    public apimicroservice: RestApiService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      'firstName': new FormControl('', (Validators.required)),
      'lastName': new FormControl('', (Validators.required)),
      'email': new FormControl('', [Validators.required,Validators.email]),
      'dob': new FormControl('', [Validators.required]),
      'address': new FormControl('', [Validators.required]),
      'company': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required,Validators.minLength(8)]),
     });
  }

  signUp() {
    let payload = this.registerForm.value;
    if(this.registerForm.valid){
      this.apimicroservice.register(payload).subscribe(res => {
        if (res.status) {
          this.apimicroservice.openSnackbar("User Registered Successfully")
          this.ngOnInit();
        } else {
          this.apimicroservice.openSnackbar("Something went Wrong")
        }
      }, (ERROR: HttpErrorResponse) => {
        this.apimicroservice.openSnackbar(ERROR.error.message);
      });
    }
  }

}
