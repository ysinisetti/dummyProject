import { Component } from '@angular/core';
import { Model } from './Model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   
  model: Model  = new Model();
  constructor()
  {
console.log('hello');
  }
  sam(event)
  {
    console.log(event);
 console.log('this is sarath',event.target.value);
  }
  data()
  {
    console.log(this.model);
    console.log(this.model.Name);
    console.log(this.model.Age);
    console.log(this.model.Id);
  }
  
}
