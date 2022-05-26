import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
  @Input() toChild = '';
  @Output() fromChild = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  addNewItem(value: string) {
    this.fromChild.emit(value);
  }

  

}
