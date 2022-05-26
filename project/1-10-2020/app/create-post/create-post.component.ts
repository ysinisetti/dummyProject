import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApisService } from '../apis.service';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  createPost: FormGroup;
  Addpost: string = "Create New Post"
  date = new Date();

  constructor(private fb: FormBuilder, private service: ApisService) { }

  ngOnInit() {


    this.createPost = this.fb.group({
      title: ['',[Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      Description: ["", [Validators.required, Validators.maxLength(5000), Validators.minLength(3)]]

    })
  }
  post() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (this.createPost.valid) {
      const data = {
        userName: userData.FirstName,
        role: "backend",
        post: this.createPost.controls.Description.value,
        postedOn: this.date ,
        title: this.createPost.controls.title.value,
        ID: userData.ID
      }
      console.log(data);
      this.service.createPost(data).subscribe(res => {
        console.log(res);
      }, error => {
        console.log(error);
      })
      this.createPost.reset();
    }
  }
  reset() {
    this.createPost.reset();
  }
}
