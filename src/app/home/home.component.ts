import { Component, OnInit, HostListener, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { ImageService } from '../services/image.service';
import { MessagequeueService } from '../services/messagequeue.service';
import { Subscription} from 'rxjs';
import { ChatWindowComponent, TextMessage } from '../chat-room/chat-window/chat-window.component';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,AfterViewInit,OnDestroy {
  readQueueSubScriptions: Subscription;
  message: string;
  groupSubscriptions: Subscription;
  groupMessageArray: Array<TextMessage>=[];
  @ViewChild(ChatWindowComponent) chatWindowComponent: ChatWindowComponent;
  constructor(private iamgeService: ImageService,
              private mqService: MessagequeueService) { }

  ngOnInit(): void {
    this.mqService.createQueue().subscribe((queueDetails: {readQueue: string,writeQueue: string, readGroupName: string})=>{
          this.mqService.readQueueName= queueDetails.readQueue;
          this.mqService.writeQueueName = queueDetails.writeQueue;
          this.mqService.readGroupQueueName = queueDetails.readGroupName;
    });

    this.mqService.groupMessageWatcher(`ReadGroupQueue${this.iamgeService.user.id}`).subscribe(
      message=>{
        let textMessage: TextMessage = <TextMessage>JSON.parse(message);
        this.groupMessageArray.push(textMessage);
        this.iamgeService.hasGroupMessageseen.next(`No-${this.groupMessageArray.length}`);
      }
    );
  }
  ngOnDestroy(){
    if(this.groupSubscriptions)
        this.groupSubscriptions.unsubscribe();
    this.iamgeService.changeToOfflinestatus(this.iamgeService.user.id).subscribe((data)=>console.log(data));
  }
  ngAfterViewInit(){}
  @HostListener('window:beforeunload',['$event'])
  public beforeunloadWindow(event){
      this.iamgeService.changeToOfflinestatus(this.iamgeService.user.id).subscribe((data)=>console.log(data));
      return 'conn';
  }
  @HostListener('window:unload',['$event'])
  public onCloseWindow(event){
    this.iamgeService.changeToOfflinestatus(this.iamgeService.user.id).subscribe((data)=>console.log(data));
  }
}
