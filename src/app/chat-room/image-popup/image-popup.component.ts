import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.css']
})
export class ImagePopupComponent implements OnInit {
  @Input() imageSource: string;
  @Output() appMediumImageClickedEvent: EventEmitter<boolean>= new EventEmitter<boolean>()
  @Input() isPopupOpen : boolean;
  @Input() firstName: string;
  constructor() { }
  ngOnInit(): void {
  }
  clickOnMediumImage(event: any){
      console.log('image clicked'+ event);
  }
  appMediumImageClicked(){
      this.appMediumImageClickedEvent.next(true);
  }
  
}
