import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularYoutubePractice';
  currentItem = 'parent data';

  parent(event){
    console.log(event);
  }
}
