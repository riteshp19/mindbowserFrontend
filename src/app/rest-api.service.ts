import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable,of } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Access-Control-Allow-Credentials': 'true',
  })
};

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private APIService: string = "http://localhost:3000/api"
  constructor(private http: HttpClient, public snackBar: MatSnackBar,) {
    this.APIService = "http://localhost:3000/api";
  }

  private log(message: string) {
    console.log("service log : " + message);
  }

  openSnackbar(message: string) {
    return this.snackBar.open(message, "close",
      { verticalPosition: 'bottom', horizontalPosition: 'right', duration: 4000, panelClass: ['snackbarStyle'] });
  }

  managerLogin(Payload): Observable<any> {
    return this.http.post(this.APIService + "/manager/login", Payload)
      .pipe(
        tap(heroes => this.log(`Login`)),
      );
  }

  register(Payload): Observable<any> {
    return this.http.post(this.APIService + "/manager/register", Payload)
      .pipe(
        tap(heroes => this.log(`Login`)),
      );
  }

  addEmployeeData(Payload): Observable<any> {
    return this.http.post(this.APIService + "/employee/addEmployee", Payload)
      .pipe(
        tap(heroes => this.log(`Data Saved`)),
      );
  }
  getEmployeesData(pageNo,size): Observable<any> {
    return this.http.get(this.APIService + "/employee/getAllEmployees?pageNo="+pageNo+"&size="+size)
      .pipe(
        tap(heroes => this.log(`Data Received`)),
      );
  }
  getEmployeeId(id): Observable<any> {
    return this.http.get(this.APIService + "/employee/getEmployeeById?id="+id)
      .pipe(
        tap(heroes => this.log(`Data Received`)),
      );
  }
  updateEmployee(id,payload): Observable<any> {
    return this.http.put(this.APIService + "/employee/editEmployee?id="+id,payload)
      .pipe(
        tap(heroes => this.log(`Data Received`)),
      );
  }
  deleteEmployee(id): Observable<any> {
    return this.http.delete(this.APIService + "/employee/deleteEmployee?id="+id)
      .pipe(
        tap(heroes => this.log(`Data Received`)),
      );
  }

  
}
