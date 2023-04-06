import { ImageService } from './../../services/image.service';
import { User } from './../../auth/signup/signup.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StompService } from '@stomp/ng2-stompjs';
import { MessagequeueService } from 'src/app/services/messagequeue.service';
import { TextMessage } from '../chat-window/chat-window.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css']
})
export class ChatMainComponent implements OnInit,OnDestroy {
  userArray: User[] =[];
  isSpinner: boolean;
  readQueueSubScriptions: Subscription;
  messsage: string;
  isPopupOpen : boolean;
  isLargePopupOpen: boolean;
  popUpImageSrc: string;
  firstName: string;
  constructor(private imageService: ImageService,
              private mqService: MessagequeueService,
              private stompService: StompService
            ){ }

  ngOnInit(): void {
      this.isPopupOpen = false;
      this.userArray = this.imageService.groupusers.map(user=><User>{...user , noOfUnreadMessages:0});

      console.log(this.userArray);

      this.mqService.onLineTopicWatcher().subscribe(datas=>{
          let data:{onLine: number, userId: number}[] = JSON.parse(datas)
          for(let eachData of data){
             if(eachData.userId !== this.imageService.user.id){
               let user: User =  this.userArray.find(elm => elm.id === eachData.userId);
               if(user){
                 user.online = eachData.onLine;
               }
             }
          }
      });
    let unReadMessages:{id: number , count: number, time: number}[]
                        = JSON.parse(localStorage.getItem('noOfUnreadMessages'));
    let pos = -1;
    if(unReadMessages !== null && unReadMessages != undefined && unReadMessages.length>0)
    this.userArray =this.userArray.map(user=>{
        pos++;
        return <User>{...user ,noOfUnreadMessages: unReadMessages[pos].count,unreadMessageTimeStamp: unReadMessages[pos].time}
    });
    this.readQueueSubScriptions= this.stompService.watch(`/queue/ReadQueueA${this.imageService.user.id}`).subscribe(data=>{
        let message:TextMessage = JSON.parse(data.body);
        for(let user of this.userArray){
            if(user.id == message.form){
                user.noOfUnreadMessages = user.noOfUnreadMessages+1;
                user.unreadMessageTimeStamp = message.timestamp;
                let tempStorage: {id: number , count: number ,time: number}[]
                      = this.userArray.map(user=><{id: number , count: number, time: number}>{id: user.id, count: user.noOfUnreadMessages, time: user.unreadMessageTimeStamp});
                window.localStorage.setItem('noOfUnreadMessages',JSON.stringify(tempStorage));
            }
        }
      })
  }
  ngOnDestroy(){
    if(this.readQueueSubScriptions)
            this.readQueueSubScriptions.unsubscribe();

  }
  initiateImageSrc(value: string){
      console.log(value);
      this.popUpImageSrc = value.split("=")[0];
      this.firstName = value.split("=")[1];
      this.isPopupOpen = !this.isPopupOpen;
  }
  changeSizeLarge(value: boolean){
      if(value){
          this.isPopupOpen = false;
          this.isLargePopupOpen = true;
      }
  }
  onClickMediumImage(){
          this.isPopupOpen = false;
          this.isLargePopupOpen = true;
  }
}
