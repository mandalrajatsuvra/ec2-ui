import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-large-popup',
  templateUrl: './image-large-popup.component.html',
  styleUrls: ['./image-large-popup.component.css']
})
export class ImageLargePopupComponent implements OnInit {
  @Output() onBackEvent : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() imageSource: string;
  constructor() { }

  ngOnInit(): void {
  }
  onClickBackButton(){
    this.onBackEvent.next(true);
  }

}
