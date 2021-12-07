import { Component, Inject, OnInit, Output, TemplateRef } from "@angular/core";
import {FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { RestApiService } from "../rest-api.service";
import { PopupComponent } from '../popup/popup.component';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { MatDialog } from "@angular/material";
import { SessionStorageService } from "ngx-store";
import { Router } from "@angular/router";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Output() addEmp : AddEmployeeComponent;
  events: string[] = [];
  opened: boolean;
  employees: any;
  employeeForm: FormGroup;
  page: any = 1;
  size: any = 5;
  totalLength: any;
  updateButton: boolean;
  submitButton: boolean;
  cid: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public router : Router,
    public sessionStorage : SessionStorageService,
    public apimicroservice: RestApiService) { }

  ngOnInit(){
    this.employeeForm = this.fb.group({
      'empId': new FormControl('', [Validators.required]),
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'address': new FormControl('', [Validators.required]),
      'dob': new FormControl('', [Validators.required]),
      'mobile': new FormControl('', [Validators.required]),
      'city': new FormControl('', [Validators.required])
     });
    this.getEmployees();
  }

  logout(){
    this.sessionStorage.clear();
    this.router.navigate(['login'])
  }

  getEmployees(){
    this.apimicroservice.getEmployeesData(this.page,this.size).subscribe(res=>{
      if(res.status){
        this.employees = res.data.employeeData;
        this.totalLength = res.data.totalItems;
        // this.apimicroservice.openSnackbar(res.message);
      }else{
        this.apimicroservice.openSnackbar(res.message);
      }
    })
  }
  
  prepopulation(id){
    this.apimicroservice.getEmployeeId(id).subscribe(res => {
     let data = res.data[0];
      if(res.status){
        this.updateButton = true;
        this.submitButton = false;
        this.employeeForm = this.fb.group({
          'empId': new FormControl(data.empId, [Validators.required]),
          'firstName': new FormControl(data.firstName, [Validators.required]),
          'lastName': new FormControl(data.lastName, [Validators.required]),
          'address': new FormControl(data.address, [Validators.required]),
          'dob': new FormControl(data.dob, [Validators.required]),
          'mobile': new FormControl(data.mobile, [Validators.required]),
          'city': new FormControl(data.city, [Validators.required]),
         });
        this.cid = data._id;
      }else{
        this.apimicroservice.openSnackbar(res.message);
      }
    });
  
  }

  employeeUpdate(id,payload){
    this.apimicroservice.updateEmployee(id,payload).subscribe(res => {
      if(res.status){
        this.apimicroservice.openSnackbar(res.message);
        this.updateButton = false;
        this.submitButton = true;
        this.ngOnInit();
      }else{
        this.apimicroservice.openSnackbar(res.message);
      }
    });
  }


  delete(id){
    this.apimicroservice.deleteEmployee(id).subscribe(res=>{
      if(res.status){
        this.apimicroservice.openSnackbar(res.message);
        this.ngOnInit();
      }else{
        this.apimicroservice.openSnackbar(res.message);
      }
    })
  }

  openDialog(id) {
    const dialogRef = this.dialog.open(PopupComponent,{
      data : "Delete"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.delete(id);
      }
    });
  }

  receiveMessage($event) {
    console.log("message",$event);
    
  }
  addEmployee() {
    const addEmployee = this.dialog.open(AddEmployeeComponent,{
      data : "Add"
    });
  }

  updateDialog(id) {
    this.apimicroservice.getEmployeeId(id).subscribe(res => {
      if(res.status){
        let data = res.data[0];
        const updatePopup = this.dialog.open(AddEmployeeComponent,{
          data : data,
      })
    }
  })}

  onPageChange(event){
    this.page = event;
    console.log(this.page);
    this.apimicroservice.getEmployeesData(this.page,this.size).subscribe(res=>{
      if(res.status){
        this.employees = res.data.employeeData;
        this.totalLength = res.data.totalItems;
        // this.apimicroservice.openSnackbar(res.message);
      }else{
        this.apimicroservice.openSnackbar(res.message);
      }
    })
  }

}
