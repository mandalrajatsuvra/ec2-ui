import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ImageService } from 'src/app/services/image.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit {

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() imageurl: string
  @Input() userId: number;
  @Input() isOnline : number;
  @Input() messageCount: number;
  @Input() unReadMessageTimeStamp: string;
  @Output() imagePopupOpen: EventEmitter<string> = new EventEmitter<string>();
  isClickEventDone: boolean

  constructor(private activatedRoute : ActivatedRoute ,
              private route: Router,
              private imageService: ImageService,
              private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.isClickEventDone = false;
  }
  formatUnreadMessageTimeStamp(time: string){
    let now = new Date();
    let sendTime = new Date(+time);
    if(now.getDate() === sendTime.getDate()){
      let hours = sendTime.getHours();
      let munite = sendTime.getMinutes();
      let hoursString=hours.toString();
      let muniteString =munite.toString();
      if(hours < 10){
        hoursString = '0'.concat(hours.toString())
      }
      if(munite < 10){
        muniteString ='0'.concat(munite.toString());
      }
      return hoursString.concat(':').concat(muniteString);
    }
  }
  onClickEachUserChatDiv(): void{
    this.isClickEventDone =true;;
    window.localStorage.removeItem('noOfUnreadMessages');
    let appUrl = `http://${environment.apiUrl}:8081/loadMessageHistory/${this.userId}/${this.imageService.user.id}`
    this.httpClient.get(appUrl,{observe:'body'}).subscribe((data: any)=>{
      this.imageService.messageHistoryHtmlBody =
                  (data == null) ? '' : <string>data.messageHistoryHtmlBody;
      this.isClickEventDone = false;
      this.route.navigate([this.userId],{relativeTo: this.activatedRoute});
    });
  }
  onClickImageIcon(e: any, firstName: string){
      console.log(e.target.src);
      this.imagePopupOpen.next(<string>e.target.src+"="+firstName);
  }
}
