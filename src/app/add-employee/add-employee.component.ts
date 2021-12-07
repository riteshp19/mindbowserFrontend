import { Component, Inject, OnInit } from "@angular/core";
import {FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { RestApiService } from '../rest-api.service';
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  employee : FormGroup;
  updatebutton = false;
  submitbutton = true;
  id: any;
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public router : Router,
    public dialogRef: MatDialogRef<AddEmployeeComponent>,@Inject(MAT_DIALOG_DATA) public data:any,
    public apimicroservice: RestApiService) { }

  ngOnInit() {
    this.employee = this.fb.group({
      'empId': new FormControl('', [Validators.required]),
      'firstName': new FormControl('', [Validators.required,Validators.pattern("^[a-zA-Z ]*$")]),
      'lastName': new FormControl('', [Validators.required,Validators.pattern("^[a-zA-Z ]*$")]),
      'address': new FormControl('', [Validators.required]),
      'dob': new FormControl('', [Validators.required]),
      'mobile': new FormControl('', [Validators.required,Validators.pattern("(0|91)?[7-9][0-9]{9}")]),
      'city': new FormControl('', [Validators.required,Validators.pattern("^[a-zA-Z ]*$")])
     });
     if (this.data == 'Add') {
      this.updatebutton = false;
      this.submitbutton = true;
    }else{
      this.getDialogData();
    }
  }

  getDialogData(){
    let empdata = this.data;
    if(empdata != ''){
      this.updatebutton = true;
      this.submitbutton = false;
      this.employee = this.fb.group({
        'empId': new FormControl(empdata.empId, [Validators.required]),
        'firstName': new FormControl(empdata.firstName, [Validators.required,Validators.pattern("^[a-zA-Z ]*$")]),
        'lastName': new FormControl(empdata.lastName, [Validators.required,Validators.pattern("^[a-zA-Z ]*$")]),
        'address': new FormControl(empdata.address, [Validators.required]),
        'dob': new FormControl(empdata.dob, [Validators.required]),
        'mobile': new FormControl(empdata.mobile, [Validators.required,Validators.pattern("(0|91)?[7-9][0-9]{9}")]),
        'city': new FormControl(empdata.city, [Validators.required,Validators.pattern("^[a-zA-Z ]*$")])
      });
      this.id = empdata._id;
    }else{
      this.updatebutton = false;
      this.submitbutton = true;
    }
  }

  saveEmployee(){
    if (this.employee.valid) {
      let payload = this.employee.value;
      this.apimicroservice.addEmployeeData(payload).subscribe(res => {
        if (res.status) {
          this.apimicroservice.openSnackbar(res.message);
          this.dialogRef.close({event:'reload'});
        } else {
          this.apimicroservice.openSnackbar(res.message);
        }
      },(ERROR:HttpErrorResponse)=>{
        console.log(ERROR);
        this.apimicroservice.openSnackbar(ERROR.error.message);
      })
    } else {
      this.employee.get('empId').markAsTouched();
      this.employee.get('firstName').markAsTouched();
      this.employee.get('lastName').markAsTouched();
      this.employee.get('address').markAsTouched();
      this.employee.get('dob').markAsTouched();
      this.employee.get('mobile').markAsTouched();
      this.employee.get('city').markAsTouched();
    }
  }

  updateEmployee(){
    if (this.employee.valid) {
      let payload = this.employee.value;
      console.log(payload);
      this.apimicroservice.updateEmployee(this.id,payload).subscribe(res => {
        if (res.status) {
          this.apimicroservice.openSnackbar(res.message);
          this.dialogRef.close({event:'reload'});
        } else {
          this.apimicroservice.openSnackbar(res.message);
        }
      },(ERROR:HttpErrorResponse)=>{
        console.log(ERROR);
        this.apimicroservice.openSnackbar(ERROR.error.message);
      })
    } else {
      this.employee.get('empId').markAsTouched();
      this.employee.get('firstName').markAsTouched();
      this.employee.get('lastName').markAsTouched();
      this.employee.get('address').markAsTouched();
      this.employee.get('dob').markAsTouched();
      this.employee.get('mobile').markAsTouched();
      this.employee.get('city').markAsTouched();
    }
  }

  close(){
    this.dialogRef.close();
  }

}
