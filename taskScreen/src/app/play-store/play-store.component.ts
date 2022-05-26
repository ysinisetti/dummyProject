
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-play-store',
  templateUrl: './play-store.component.html',
  styleUrls: ['./play-store.component.scss']
})
export class PlayStoreComponent implements OnInit {
  data: any;
  

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get("assets/apps.json").subscribe(data1=> {
      console.log(data1);
      this.data = data1;
    })
  }

}
