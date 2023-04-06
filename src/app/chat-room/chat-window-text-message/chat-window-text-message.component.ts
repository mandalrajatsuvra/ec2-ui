import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { StompService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs';
import { Message } from '@stomp/stompjs';

export interface AcknowledgementMessage{
  messageId: number;
  from: string;
  to : string;
  isAcknowledgementSend: boolean;
}

@Component({
  selector: 'app-chat-window-text-message',
  templateUrl: './chat-window-text-message.component.html',
  styleUrls: ['./chat-window-text-message.component.css']
})
export class ChatWindowTextMessageComponent implements OnInit , OnDestroy{
  @Input() isRightMessage: boolean;
  @Input() message: string;

  @Input() checkSingleIcon: boolean;
  @Input() checkDoubleIcon: boolean;
  @Input() checkDoubleBlueIcon: boolean; 

  constructor(private stompService: StompService) { 
    this.isRightMessage = true;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
  }

  get timestamp(): string{
    let hours: number=new Date().getHours();
    let min :number= new Date().getMinutes();
    let hoursString = hours<=9 ? '0'.concat(hours.toString()) : hours.toString();
    let minuteString = min<=9 ? '0'.concat(min.toString()) : min.toString();
    let timeString = hoursString.concat(':').concat(minuteString);
    return timeString;
  }

}
