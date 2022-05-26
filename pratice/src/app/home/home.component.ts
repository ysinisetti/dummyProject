import { ChangeDetectorRef, Component, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApisService } from '../apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchApprovePost: FormGroup;
  data: any;
  length: any;
  // pageSize: any;

  pageIndex: number = 0;
  pageSize: number = 10;
  lowValue: number = 0;
  highValue: number = 10;
  Title = "Recent Posts"

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private service: ApisService, private cd: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  // ngOnChanges(changes: SimpleChanges): void {

  //     window.location.reload();

  // }

  ngOnInit() {
    this.searchApprovePost = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]")]],
      firstName: ['', [Validators.minLength(3), Validators.pattern("[a-zA-Z\s]+$")]],
    })

    // for(i=0;i<=1;i++){
    //   this.reload();
    // }


    this.service.getPost().subscribe((res: any) => {
      console.log(res);
      this.data = res.Info;
      this.length = this.data.length;

    }
    , error => {
      console.log(error);
      
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
    }
    )

  }
  // reload(){
  //   window.location.reload();
  // }
  custom() {
    console.log("entering");
  }

  getPaginatorData(event) {
    // console.log(event);
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    }
    else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }
  like() {

  }
  disLike() {

  }
  search() {
    const data1 = {
      FirstName: this.searchApprovePost.controls.firstName.value,
      title: this.searchApprovePost.controls.title.value,
    }
    if (data1.FirstName == " " && data1.title == "  ") {
      this.ngOnInit();
    } else {
      console.log(data1);
      this.service.searchApprovedposts(data1).subscribe((res: any) => {
        console.log(res);
        this.data = res.Info;
        this.length = this.data.length;

      }, error => {
        console.log(error)
        if (error.error.Status == 401) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
        if (error.error.Status == 404) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
        if (error.error.Status == 500) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
      })
    }
  }
  reset() {
    this.ngOnInit();

  }
}
