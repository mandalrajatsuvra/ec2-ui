import { Injectable, ComponentRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ImageService } from './image.service';
import { Observable, from } from 'rxjs';
import { TextMessage } from '../chat-room/chat-window/chat-window.component';
import { StompService } from '@stomp/ng2-stompjs';
import { map } from 'rxjs/operators';
import { ChatWindowTextMessageComponent } from '../chat-room/chat-window-text-message/chat-window-text-message.component';

@Injectable({
  providedIn: 'root'
})
export class MessagequeueService {


  private _readQueueName:string;
  private _writeQueueName: string;
  private _readGroupQueueName: string;

  public textComponemtArr :  ComponentRef<ChatWindowTextMessageComponent>[] = []; 

  public historyUnseenMap : Map<number, ComponentRef<ChatWindowTextMessageComponent>>
      = new Map<number, ComponentRef<ChatWindowTextMessageComponent>>();

  get readQueueName(){
    return this._readQueueName;
  }
  set readQueueName(name: string){
    this._readQueueName = name;
  }
  get readGroupQueueName(){
    return this._readGroupQueueName;
  }

  get writeQueueName(){
    return this._writeQueueName;
  }
  set writeQueueName(name: string){
    this._writeQueueName = name;
  }
  set readGroupQueueName(value: string){
    this._readGroupQueueName = value;
  }

  constructor( private httpClient: HttpClient, private imageService: ImageService ,private stompService: StompService) { }

  createQueue(): Observable<any>{
      const apiUtl =`http://${environment.apiUrl}:8081/createDedicatedQueue`;
      let ob$=this.httpClient.post(apiUtl,this.imageService.user , {observe:'body'});
      return ob$;
  }
  writePoint2pointMessageOnQueue(message: any): Observable<any>{
      const apiUtl =`http://${environment.apiUrl}:8081/pointToPointMessaging`;
      console.log( '===================message is ============================' + message);
      return this.httpClient.post(apiUtl,message ,{observe: 'body'})
  }
  sendAcknowledgeToPeer(ack: any): Observable<any>{
    const apiUtl =`http://${environment.apiUrl}:8081/sendAcknowledgementToPeer`;
    return this.httpClient.post(apiUtl,ack, {observe: 'body'});
  }
  publishMessageToGroup(message: TextMessage){
    const apiUtl =`http://${environment.apiUrl}:8081/sendMessagesToAllUsers`;
    console.log(message);
    return this.httpClient.post(apiUtl,message ,{observe: 'body'})

  }
  onLineTopicWatcher(): Observable<any>{
      let ob$=this.stompService.watch('/topic/onLineOfflineTopic').pipe(
        map(data => data.body)
      );
      return ob$;
  }
  groupMessageWatcher(value:string):Observable<string>{
    let appUrl= `/queue/${value}`;
    let ob$ = this.stompService.watch(appUrl).pipe(map(data=>data.body));
    return ob$;
  }

  sendTypingNotificatioToPeer(msg: any): Observable<any>{
    const apiUrl =`http://${environment.apiUrl}:8081/sendTypingNotificatioToPeer`;
    const ob$ = this.httpClient.post(apiUrl,msg,{observe: 'body'});
    return ob$;
  }
  typingTopicWatcher(msg: any){
   const ob$= this.stompService.watch(`/topic/typingIndicatorTopic${msg.to}`).pipe(map((data)=>data.body));;
   return ob$;
  }
  saveMessageToDb(msg: any):Observable<any>{
    const apiUrl =`http://${environment.apiUrl}:8081/saveMessage`;
    const ob$ = this.httpClient.post(apiUrl,msg, {observe:'body'});
    return ob$;
  }

  getDetailedHistory(userid: string): Observable<any>{
    const apiUrl =`http://${environment.apiUrl}:8081/getHistoryForPage/${userid}`;
    const ob$ = this.httpClient.get(apiUrl,{observe: 'body'});
    return ob$;
  }

}
