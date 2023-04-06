import { ImageService } from './../../services/image.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ComponentFactoryResolver,
  ComponentRef,
} from '@angular/core';
import { User } from 'src/app/auth/signup/signup.component';
import { HttpClient } from '@angular/common/http';
import { StompService } from '@stomp/ng2-stompjs';
import { Message, IMessage } from '@stomp/stompjs';
import { environment } from 'src/environments/environment';
import { MessagequeueService } from 'src/app/services/messagequeue.service';
import { Subscription, fromEvent, Observable } from 'rxjs';
import { PictureMessage } from '../image-attach-and-send/image-attach-and-send.component';
import { AddDirectiveDirective } from '../add-directive.directive';
import {
  ChatWindowTextMessageComponent,
  AcknowledgementMessage,
} from '../chat-window-text-message/chat-window-text-message.component';
import { ChatWindowPicMessageComponent } from '../chat-window-pic-message/chat-window-pic-message.component';
import { map, startWith, mergeMap, concatMap, debounceTime, tap } from 'rxjs/operators';

export interface TextMessage {
  id: number;
  text: string;
  to0: number;
  form: number;
  timestamp: number;
  type: string;
  hasSeenByPeer: string;
  sendOrReceive: string;
}

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
})
export class ChatWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  imageurl: string;
  user: User;
  enterPressCountInTextArea: number;
  previousTextContent: string;
  readQueueSubScriptions: Subscription;
  picSendImageSrc: string;
  shouldRenderImageIcon: boolean;
  ackQueueSub: Subscription;
  componentRef: ComponentRef<ChatWindowTextMessageComponent>;

  isTyping: boolean;
  timer: any;
  @ViewChild('inputSendTextArea') elementRef: ElementRef;
  @ViewChild('messageContainer') messageContainerElement: ElementRef;
  @ViewChild('hiddenFileInput') hiddenFileInput: ElementRef;
  @ViewChild(AddDirectiveDirective, { static: true })
  addDirective: AddDirectiveDirective;
  constructor(
    private activatedRoute: ActivatedRoute,
    public imageService: ImageService,
    private router: Router,
    private httpClient: HttpClient,
    private stompService: StompService,
    private mqService: MessagequeueService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}
  ngAfterViewInit(): void {
    
    this.loadHistory(); 
    this.startMessageConsumer();  
    this.adjustScroll();
    
    // Sending typing... message to peer 
    let ob$ = fromEvent(this.elementRef.nativeElement,'keyup');
    ob$.pipe(
      concatMap(()=>{
        return this.mqService.sendTypingNotificatioToPeer({
            from: this.imageService.user.id,
            to: this.user.id,
            typing: 'Yes'
          })
        }),
        debounceTime(800)
    ).subscribe(()=>{})
    this.mqService.typingTopicWatcher({to: this.imageService.user.id}).subscribe((message: any)=>{
      let msg = JSON.parse(message);
      this.isTyping = true;
      this.timer=setTimeout(()=>{this.isTyping =false},1500);
    });

    // Subscription Code for  message ack
    this.ackQueueSub = this.stompService.watch(`/queue/ACK${this.imageService.user.id}`).subscribe((message: Message) => {
      let ackMessege: AcknowledgementMessage = <AcknowledgementMessage>(JSON.parse(message.body));
      const componentRef = this.mqService.historyUnseenMap.get(ackMessege.messageId);
      if(componentRef){
        componentRef.instance.checkDoubleIcon = true;
        componentRef.instance.checkDoubleBlueIcon= true;
        componentRef.instance.checkSingleIcon = false;
      }
      this.mqService.textComponemtArr.forEach((componentRef)=>{
        if(componentRef){
          componentRef.instance.checkDoubleBlueIcon = true;
        }
      })
    }); 
  }
  adjustScroll(){
    (<HTMLDivElement>this.messageContainerElement.nativeElement).scrollTop 
        = (<HTMLDivElement>this.messageContainerElement.nativeElement).scrollHeight;
  }
  loadHistory(){
      this.imageService.msgHistory.forEach(msg=>{
        if(msg.type === 'text'){
          if(msg.to0 == this.imageService.user.id
              && msg.form == this.user.id){
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatWindowTextMessageComponent);
            const viewContainerRef = this.addDirective.viewContainerRef;
            const componentRef = viewContainerRef.createComponent<ChatWindowTextMessageComponent>(componentFactory);
            componentRef.instance.isRightMessage = false;
            componentRef.instance.message = msg.text;
          }else if(msg.form == this.imageService.user.id && 
                   msg.to0 == this.user.id){
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatWindowTextMessageComponent);
            const viewContainerRef = this.addDirective.viewContainerRef;
            const componentRef = viewContainerRef.createComponent<ChatWindowTextMessageComponent>(componentFactory);
            componentRef.instance.isRightMessage = true;
            componentRef.instance.message = msg.text;
            componentRef.instance.checkDoubleBlueIcon= true ;
            if(msg.hasSeenByPeer == "YES"){
              componentRef.instance.checkSingleIcon = false;
              componentRef.instance.checkDoubleIcon = true;
              componentRef.instance.checkDoubleBlueIcon= true ; 
            }else{
              componentRef.instance.checkSingleIcon = false;
              componentRef.instance.checkDoubleIcon = true;
              componentRef.instance.checkDoubleBlueIcon= false ;
              this.mqService.historyUnseenMap.set(+msg.id,componentRef); 
            }
          }
       }
      });
      this.adjustScroll();
  }
  startMessageConsumer(): void{
    const msgWatcherObs$ = this.stompService.watch(`/queue/ReadQueue${this.imageService.user.id}`);
    this.readQueueSubScriptions = msgWatcherObs$
        .pipe(
          tap((message: Message)=> {
            let msg: TextMessage | PictureMessage = JSON.parse(message.body);
            if (msg.type === 'text') {
              const textMsg = <TextMessage>msg;
              const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatWindowTextMessageComponent);
              const viewContainerRef = this.addDirective.viewContainerRef;
              const componentRef = viewContainerRef.createComponent<ChatWindowTextMessageComponent>(componentFactory);
              componentRef.instance.isRightMessage = false;
              componentRef.instance.message = textMsg.text;
            } else if (msg.type === 'picture') {
              const picMsg = <PictureMessage>msg;
              const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatWindowPicMessageComponent);
              const viewContainerRef = this.addDirective.viewContainerRef;
              const componentRef = viewContainerRef.createComponent<ChatWindowPicMessageComponent>(componentFactory);
              componentRef.instance.isRightMessage = false;
              componentRef.instance.imageSource = picMsg.url;
            }
            this.adjustScroll();      
          }),
          concatMap((message: Message)=>{
            let msg: TextMessage | PictureMessage = JSON.parse(message.body);
            return this.sendAcknoledgement(msg.id);
          })
        ).subscribe(()=> console.log('ack send'),err=>console.log('error occured in ack send'));
  }
  ngOnInit(): void {
    this.isTyping = false;
    this.enterPressCountInTextArea = 0;
    this.activatedRoute.paramMap.subscribe((param) => {
      this.user = this.imageService.groupusers.find(
        (elm) => elm.id === +param.get('id')
      );
    });
  }
  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.ackQueueSub.unsubscribe();
    this.readQueueSubScriptions.unsubscribe();
  }
  onTextChange(event: any): void {
    let textAreaElement: HTMLTextAreaElement = <HTMLTextAreaElement>(
      this.elementRef.nativeElement
    );
    if (
      textAreaElement.selectionStart > 0 &&
      textAreaElement.selectionStart % 24 === 0
    ) {
      this.enterPressCountInTextArea++;
    }
    if (
      event.keyCode === 8 &&
      textAreaElement.selectionStart > 0 &&
      textAreaElement.selectionStart % 24 === 0
    ) {
      this.enterPressCountInTextArea--;
    }
    if (
      event.keyCode === 8 &&
      this.previousTextContent.charAt(textAreaElement.selectionStart) === '\n'
    ) {
      if (this.enterPressCountInTextArea >= 1) {
        this.enterPressCountInTextArea--;
      }
    }
    this.previousTextContent = event.target.value;
    if (event.keyCode === 13 || event.code === 'Enter') {
      this.enterPressCountInTextArea++;
    }
  }
  onClickBackButton(event: any): void {
    this.router.navigate(['../../chat-room'], {
      relativeTo: this.activatedRoute,
    });
  }
  onResizeWindow(event: any) {
    
  }
  onClickSendButton(event: any): void {
    let textAreaElement: HTMLTextAreaElement = <HTMLTextAreaElement>(
      this.elementRef.nativeElement
    );
    let textMessage = textAreaElement.value;
    textAreaElement.value = null;
    // Dynamic Component Creattion
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatWindowTextMessageComponent);
    const viewContainerRef = this.addDirective.viewContainerRef;
    const componentRef: ComponentRef<ChatWindowTextMessageComponent> = viewContainerRef.createComponent<ChatWindowTextMessageComponent>(componentFactory);
    //this.componentRef = componentRef;
    this.mqService.textComponemtArr.push(componentRef);
    componentRef.instance.isRightMessage = true;
    componentRef.instance.message = textMessage;
    componentRef.instance.checkSingleIcon = true;
    componentRef.instance.checkDoubleIcon = false;
    componentRef.instance.checkDoubleBlueIcon = false;
    // Sending messege in message Queue And Store is Persistant Storage
    // Scroll up 
    this.adjustScroll();

    let message: TextMessage = <TextMessage>{
      type: 'text',
      text: textMessage,
      form: this.imageService.user.id,
      to0  : this.user.id,
      timestamp: new Date().getTime(),
      hasSeenByPeer: 'NO',
      sendOrReceive: 'SEND'
    };
    const saveToDbObs$ = this.mqService.saveMessageToDb(message);
    saveToDbObs$
          .pipe(concatMap((msgWithId)=>{
            return this.mqService.writePoint2pointMessageOnQueue(msgWithId);
          }))
          .subscribe(()=>{
            componentRef.instance.checkDoubleIcon = true;
            componentRef.instance.checkSingleIcon = false;
            componentRef.instance.checkDoubleBlueIcon = false;
          })
    this.enterPressCountInTextArea = 0;
  }
  onClickAttachItem() {
    this.imageService.picAttachAndSendFireSubject.next(true);
  }
  sendAcknoledgement(msgId: number): Observable<any> {
   return this.mqService.sendAcknowledgeToPeer({
        messageId: msgId,
        from: this.imageService.user.id,
        to: this.user.id,
        isAcknowledgementSend: true,
      });
  }
}
