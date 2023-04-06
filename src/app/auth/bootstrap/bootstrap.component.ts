import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../signup/signup.component';
import { ImageService } from 'src/app/services/image.service';
import { concatMap } from 'rxjs/operators';
import { MessagequeueService } from 'src/app/services/messagequeue.service';
import { zip } from 'rxjs';

@Component({
  selector: 'app-bootstrap',
  templateUrl: './bootstrap.component.html',
  styleUrls: ['./bootstrap.component.css']
})
export class BootstrapComponent implements OnInit {
  username: string;
  password: string;
  constructor(private router: Router,
     private httpClient: HttpClient,
      private imageService: ImageService,
      private activatedRoute: ActivatedRoute,
      private mqService: MessagequeueService) { }
  ngOnInit(): void {
  }
  onClickSignup(){
      this.router.navigate(['/signup']);
  }
  onSignIn(event: any): void{
      let appUrl = `http://${environment.apiUrl}:8081/getSpecificUser`
      let user: User =<User>{
        username: this.username,
        password: this.password
      };
      this.httpClient.post(appUrl, user ,{observe: 'body'}).pipe(concatMap(user =>{
        this.imageService.user = <User>{...user};
        const allUsers$ = this.imageService.getAllUsers(this.imageService.user.id);
        const mesgHistory$ = this.mqService.getDetailedHistory(this.imageService.user.id.toString());
        return zip(allUsers$,mesgHistory$);
      })).subscribe(([users,msgHistory])=>{
          this.imageService.groupusers = users;
          this.imageService.msgHistory = msgHistory
          this.router.navigate(['../home'],{relativeTo :this.activatedRoute});
      });
  }
}
