import { Component, Inject, OnInit } from "@angular/core";
import {FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { RestApiService } from '../rest-api.service';
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog, MatDialogRef, MatDialogConfig,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  configForm: FormGroup;
  updateButton = false;
  deleteButton = false;
  value: any;


  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<PopupComponent>,@Inject(MAT_DIALOG_DATA) public data:any,
    public apimicroservice: RestApiService) { }

  ngOnInit() {
    this.value = this.data;
    if(this.value == 'Delete'){
      this.deleteButton = true;
      this.updateButton = false;
    }else if(this.value == 'Update'){
      this.deleteButton = false;
      this.updateButton = true;
    }
  }

}
