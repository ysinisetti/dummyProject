import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-alerts',
  templateUrl: './create-alerts.component.html',
  styleUrls: ['./create-alerts.component.scss']
})
export class CreateAlertsComponent implements OnInit {
  createPost: FormGroup;
  CreateAlerts:string="Create Alerts";
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createPost = this.fb.group({
      name:[''],
      link:["",[Validators.required, Validators.maxLength(30), Validators.minLength(3)]]

  })
  }
  post(){

  }
  reset(){

  }

}
