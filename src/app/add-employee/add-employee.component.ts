import { Component, Inject, Input, OnInit } from "@angular/core";
import {FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { RestApiService } from '../rest-api.service';
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog, MatDialogRef, MatDialogConfig,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeComponent } from '../employee/employee.component';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  @Input() empRef : EmployeeComponent;
  employee : FormGroup;
  updatebutton = false;
  submitbutton = true;
  id: any;
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEmployeeComponent>,@Inject(MAT_DIALOG_DATA) public data:any,
    public apimicroservice: RestApiService) { }

  ngOnInit() {
    this.employee = this.fb.group({
      'empId': new FormControl('', [Validators.required]),
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'address': new FormControl('', [Validators.required]),
      'dob': new FormControl('', [Validators.required]),
      'mobile': new FormControl('', [Validators.required]),
      'city': new FormControl('', [Validators.required])
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
        'firstName': new FormControl(empdata.firstName, [Validators.required]),
        'lastName': new FormControl(empdata.lastName, [Validators.required]),
        'address': new FormControl(empdata.address, [Validators.required]),
        'dob': new FormControl(empdata.dob, [Validators.required]),
        'mobile': new FormControl(empdata.mobile, [Validators.required,Validators.maxLength(10)]),
        'city': new FormControl(empdata.city, [Validators.required])
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
          this.dialogRef.close();
        } else {
          this.apimicroservice.openSnackbar(res.message);
        }
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
          this.dialogRef.close();
        } else {
          this.apimicroservice.openSnackbar(res.message);
        }
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
