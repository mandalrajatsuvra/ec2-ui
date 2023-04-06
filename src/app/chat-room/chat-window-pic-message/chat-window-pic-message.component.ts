import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-window-pic-message',
  templateUrl: './chat-window-pic-message.component.html',
  styleUrls: ['./chat-window-pic-message.component.css']
})
export class ChatWindowPicMessageComponent implements OnInit {

  @Input() isRightMessage: boolean;
  @Input() imageSource: string;


  constructor() { }

  ngOnInit(): void {
  }

  getTimeStamp(){
    let hours: number=new Date().getHours();
    let min :number= new Date().getMinutes();
    let hoursString = hours<=9 ? '0'.concat(hours.toString()) : hours.toString();
    let minuteString = min<=9 ? '0'.concat(min.toString()) : min.toString();
    let timeString = hoursString.concat(':').concat(minuteString);
    return timeString;
  }

}
