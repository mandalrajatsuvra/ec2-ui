import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { User } from 'src/app/auth/signup/signup.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';
import { HttpClient } from '@angular/common/http';
import { StompService } from '@stomp/ng2-stompjs';
import { MessagequeueService } from 'src/app/services/messagequeue.service';
import { TextMessage } from 'src/app/chat-room/chat-window/chat-window.component';
import { environment } from 'src/environments/environment';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-group-chat-window',
  templateUrl: './group-chat-window.component.html',
  styleUrls: ['./group-chat-window.component.css']
})
export class GroupChatWindowComponent  implements OnInit ,AfterViewInit,OnDestroy{
  imageurl: string;
  user: User;
  enterPressCountInTextArea: number
  previousTextContent: string;

  readQueueSubScriptions: Subscription;

  @ViewChild('inputSendTextArea') elementRef: ElementRef;
  @ViewChild('messageContainer') messageContainerElement: ElementRef;
  constructor(private activatedRoute: ActivatedRoute,
              private imageService: ImageService,
              private router: Router,
              private httpClient: HttpClient,
              private stompService: StompService,
              private mqService: MessagequeueService) { }
  ngAfterViewInit(): void{
    this.elementRef.nativeElement.focus();
    (<HTMLDivElement>this.messageContainerElement.nativeElement).innerHTML
                                  = this.imageService.messageHistoryHtmlBody;

  }
  ngOnInit(): void {
      this.imageurl='https://image-bucket-maliantala-app.s3.ap-south-1.amazonaws.com/pic2.jpg';
      this.enterPressCountInTextArea = 0;
      this.previousTextContent ='';

      

      this.readQueueSubScriptions = this.stompService.watch(`/queue/RGQ${this.imageService.user.id}`).subscribe((message: Message)=>{
        console.log("message is"+message);
        let textMessage:TextMessage = <TextMessage>JSON.parse(message.body);
        if(true){
          let textAreaElement: HTMLTextAreaElement =<HTMLTextAreaElement>this.elementRef.nativeElement;
          let messageContainerElement: HTMLDivElement = <HTMLDivElement>this.messageContainerElement.nativeElement;
          messageContainerElement.innerHTML +=this.getProcessedHTML(textMessage.text,20);
          let childNodeList: NodeList = messageContainerElement.childNodes;
          let heightOfAllNodes=0;
          (<HTMLDivElement>childNodeList[childNodeList.length-1]).style.marginLeft = null;
          (<HTMLDivElement>childNodeList[childNodeList.length-1]).style.backgroundColor ='#80ff80';
          for(let i = 1; i< childNodeList.length ; i++){
            let lastNode:  HTMLDivElement = <HTMLDivElement>childNodeList[i];
            lastNode.style.marginTop = '0px';
            heightOfAllNodes += lastNode.clientHeight;
            if(i === childNodeList.length-1){
              lastNode.style.left ='20px';
              lastNode.style.marginRight ='auto';
              lastNode.style.marginLeft='';
            }
          }
          let lastNode:HTMLDivElement = <HTMLDivElement>childNodeList[0];
          let heightOfNewNode= lastNode.clientHeight;
          let offsetHeightFirstMessage = 57;
          messageContainerElement.scrollTop =200+heightOfAllNodes;
          let marginTopOfFirstDiv = messageContainerElement.clientHeight- heightOfAllNodes -heightOfNewNode-offsetHeightFirstMessage;
          if(marginTopOfFirstDiv < 0){
            marginTopOfFirstDiv = 0;
          }
          lastNode.style.marginTop =  marginTopOfFirstDiv.toString().concat('px');
          this.imageService.hasGroupMessageseen.next('Yes-0');
        }
      });

  }
  ngOnDestroy(): void{
    this.readQueueSubScriptions.unsubscribe();
  }
  saveHistory(){
    let appUrl = `http://${environment.apiUrl}:8081/storeMessageHistory/240000/${this.imageService.user.id}`
    let messageContainerElement: HTMLDivElement = <HTMLDivElement>this.messageContainerElement.nativeElement;
    let messageHistory={
      messageHistoryHtmlBody: messageContainerElement.innerHTML
    }
    this.httpClient.post(appUrl,messageHistory,{observe: 'body'})
        .subscribe((response)=>console.log(response));
  }

  onTextChange(event: any):void{
    let textAreaElement: HTMLTextAreaElement =<HTMLTextAreaElement>this.elementRef.nativeElement;
    if(textAreaElement.selectionStart>0 && textAreaElement.selectionStart%24  ===0){
      this.enterPressCountInTextArea++;
    }
    if(event.keyCode ===8 && textAreaElement.selectionStart>0 && textAreaElement.selectionStart%24  ===0){
      this.enterPressCountInTextArea --;
    }
    if(event.keyCode ===8
                && this.previousTextContent.charAt(textAreaElement.selectionStart) === '\n'){
      if(this.enterPressCountInTextArea >=1){
        this.enterPressCountInTextArea--;
      }
    }
    this.previousTextContent = event.target.value;
    if(event.keyCode===13 || event.code === 'Enter'){
        this.enterPressCountInTextArea++;
    }
  }
  onClickBackButton(event: any): void {
          this.router.navigate(['../'],{relativeTo: this.activatedRoute});
  }
  onResizeWindow(event : any){
      let messageContainerElement: HTMLDivElement = <HTMLDivElement>this.messageContainerElement.nativeElement;
      let childNodeList: NodeList = messageContainerElement.childNodes;
      let heightOfAllNodes=0;
      for(let i = 1; i< childNodeList.length ; i++){
        let lastNode:  HTMLDivElement = <HTMLDivElement>childNodeList[i];
        lastNode.style.marginTop = '0px';
        heightOfAllNodes += lastNode.clientHeight;
      }
      let lastNode:HTMLDivElement = <HTMLDivElement>childNodeList[0];
      let heightOfNewNode= lastNode.clientHeight;
      let offsetHeightFirstMessage = 57;
      messageContainerElement.scrollTop =200+heightOfAllNodes;
      let marginTopOfFirstDiv = messageContainerElement.clientHeight- heightOfAllNodes -heightOfNewNode-offsetHeightFirstMessage;
      if(marginTopOfFirstDiv < 0){
        marginTopOfFirstDiv = 0;
      }
      lastNode.style.marginTop =  marginTopOfFirstDiv.toString().concat('px');
  }
  onClickSendButton(event: any): void{

    let textAreaElement: HTMLTextAreaElement =<HTMLTextAreaElement>this.elementRef.nativeElement;
    let messageContainerElement: HTMLDivElement = <HTMLDivElement>this.messageContainerElement.nativeElement;

    messageContainerElement.innerHTML +=this.getProcessedHTML(textAreaElement.value,20);
    let childNodeList: NodeList = messageContainerElement.childNodes;
    let heightOfAllNodes=0;
    for(let i = 1; i< childNodeList.length ; i++){
      let lastNode:  HTMLDivElement = <HTMLDivElement>childNodeList[i];
      lastNode.style.marginTop = '0px';
      heightOfAllNodes += lastNode.clientHeight;
    }
    let lastNode:HTMLDivElement = <HTMLDivElement>childNodeList[0];
    let heightOfNewNode= lastNode.clientHeight;
    let offsetHeightFirstMessage = 57;
    messageContainerElement.scrollTop =200+heightOfAllNodes;
    let marginTopOfFirstDiv = messageContainerElement.clientHeight- heightOfAllNodes -heightOfNewNode-offsetHeightFirstMessage;
    if(marginTopOfFirstDiv < 0){
      marginTopOfFirstDiv = 0;
    }
    lastNode.style.marginTop =  marginTopOfFirstDiv.toString().concat('px');

    let message: TextMessage=<TextMessage>{
      text: textAreaElement.value,
      form: this.imageService.user.id,
      to0 : 2400,
      timestamp: new Date().getTime()
    };
    this.mqService.publishMessageToGroup(message).subscribe(data=>{
      console.log(data);
    });
    textAreaElement.value = '';
    this.enterPressCountInTextArea = 0;
    this.saveHistory();
  }
  getProcessedHTML(value: string ,bottomValue: number): string{
    let processedDiv ='<p style="border-radius:10px;margin-left:auto;font-family:sans-serif ;margin-top:auto ; padding: 4px 10px 4px 10px; font-size: 16px; background: white; right: 20px ; width: fit-content;height: fit-content;  color: black ;box-shadow: 1px 1px 1px lightgray; bottom:'+bottomValue+'px";>';
    let i =0;
    while(i<= value.length){
        if(value.charAt(i) === '\n'){
            processedDiv+='<br>'
        }else{
          processedDiv+= value.charAt(i);
        }
        i++;
    }
    let hours: number=new Date().getHours();
    let min :number= new Date().getMinutes();
    let hoursString = hours<=9 ? '0'.concat(hours.toString()) : hours.toString();
    let minuteString = min<=9 ? '0'.concat(min.toString()) : min.toString();
    let timeString = hoursString.concat(':').concat(minuteString);
    processedDiv+= '&nbsp;&nbsp;'+'<span style="color:gray; font-size: 11px; margin-left:auto; font-weight: lighter ; margin-top: 10px">'+ timeString +'</span>'+'</p>'
    return processedDiv;
  }
}

