import { User } from './../auth/signup/signup.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { concatMap, map } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private _user: User;
  private _groupusers: User[] =[];
  private _messageHistoryHtmlBody: string ='';
  private _hasSeenGroupMessage: boolean;
  msgHistory: any;
  userArray: User[]=[];

  messageEmitSubject: Subject<string> = new Subject<string>();
  hasGroupMessageseen: Subject<string> = new Subject<string>();

  picAttachAndSendFireSubject: Subject<boolean> = new Subject<boolean>();
  

  get messageHistoryHtmlBody(){
    return this._messageHistoryHtmlBody
  }
  set messageHistoryHtmlBody(history: string){
    this._messageHistoryHtmlBody = history;
  }
  get user(){
    return this._user;
  }
  set user(user: User){
    this._user = user;
  }

  get groupusers(){
    return this._groupusers;
  }
  set groupusers(users: User[]){
    this._groupusers = users;
  }
  get hasSeenGroupMessage(){
    return this._hasSeenGroupMessage;
  }
  set hasSeenGroupMessage(seen: boolean){
    this._hasSeenGroupMessage = seen;
  }
  constructor(private httpClient: HttpClient) {}

  getAllUsers(userId: number): Observable<User[]>{
    let appUrl = `http://${environment.apiUrl}:8081/allusers/${userId}`;
    let getAllusersObservable$ = this.httpClient.get(appUrl ,{observe:'body'});
    let ob$= getAllusersObservable$
        .pipe(map((users: User[])=>{
           return users.map((user)=>{
              return {...user , imageurl:  user.imageurl ==null ?'https://image-bucket-maliantala-app.s3.ap-south-1.amazonaws.com/pic2.jpg': user.imageurl,
                firstname: user.firstname == null ? 'Test': user.firstname
           };
        });
     }));
     return ob$;
  }
  changeToOfflinestatus(userId: number):Observable<any>{
    const appUrl = `http://${environment.apiUrl}:8081/changeToOfflineStatus/${userId}`;
    return this.httpClient.get(appUrl,{observe:'body'});
  }
}
