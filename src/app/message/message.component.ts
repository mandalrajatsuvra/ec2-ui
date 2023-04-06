import { RxStompService, StompService } from '@stomp/ng2-stompjs';
import { Component, OnInit } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  private serverUrl = 'http://localhost:8082/gs-guide-websocket';
  private title = 'WebSockets chat';
  private stompClient ;

  constructor(private stompService: StompService, private httpClient: HttpClient) {
    // this.initializeWebSocketConnection();
   }

  initializeWebSocketConnection(){
    const ws: any = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe('/topic/greetings', (message) => {
        if(message.body) {
          console.log(message.body);
        }
      });
    });
  }



  ngOnInit(): void {
      // this.stompsService.watch('/topic/greetings').subscribe((data) => {
      //   console.log(data);
      // });

      this.httpClient.get('http://localhost:8081/getALLUnPulledMessages/2').subscribe(data=>{
        console.log(data);
      });

      this.stompService.watch('/topic/greetings').subscribe((data) => {
            console.log(data);

      });

  }
  onclickSendMessage(): void{
      this.stompService.publish('/topic/greetings', 'My Message ', {});

      const message = {
          text: 'Hi This is Rajat',
          to: 'B',
          from: 'A'

      };

      this.httpClient.post('http://localhost:8081/saveMessageInTempStorage/2',message)
            .subscribe((data: any) => {
                console.log(data);

      });


  }
  onSendMessage(): void{
    // // tslint:disable-next-line:new-parens
    // const message = `Message generated at ${new Date()}`;
    // this.stompsService.publish({destination: '/topic/greetings', body: message});
  }

}
