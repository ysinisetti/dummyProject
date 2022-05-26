import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApisService } from 'src/app/apis.service';

@Component({
  selector: 'app-admin-post',
  templateUrl: './admin-post.component.html',
  styleUrls: ['./admin-post.component.scss']
})
export class AdminPostComponent implements OnInit {
  data: any;

  constructor(private service:ApisService,private snackBar: MatSnackBar) { }

  ngOnInit(){
    this.service.getAlertsStatus().subscribe((res: any) => {
      console.log(res);
      this.data= res.Info;
      
    }, error => {
      console.log(error)
      if (error.error.Status == 401) {
        this.snackBar.open(error.error.Info, '', {  verticalPosition: 'top',duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', {  verticalPosition: 'top',duration: 2000, panelClass: ['red-snackbar'] });
      }
    })
  }

}
