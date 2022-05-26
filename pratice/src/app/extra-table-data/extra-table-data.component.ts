import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-extra-table-data',
  templateUrl: './extra-table-data.component.html',
  styleUrls: ['./extra-table-data.component.scss']
})
export class ExtraTableDataComponent implements OnInit {
  dataSource: any;
  length: any;
  rows: [];
  ColumnMode = ColumnMode;
  // @Input()  public loggedIn:boolean;
  @Output() toggle = new EventEmitter();
  @Input() row: any;
  createPost: FormGroup;
  date = new Date();
  @Output() greetEvent = new EventEmitter();





  displayedColumns: string[] = ['link'];


  constructor(private service: ApisService, private snackBar: MatSnackBar, private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log(this.row);
    this.createPost = this.fb.group({
      name: [''],
     
    })
  }
  callParentGreet(eve) {
    console.log("gsgfgksfsgsakgjk")
  }
  update() {
    const row = {
      sno:this.row.sno,
      post: this.createPost.controls.name.value, 
      postedOn:this.date
    }
    console.log(row);
    this.toggle.emit(row);
  }

}
