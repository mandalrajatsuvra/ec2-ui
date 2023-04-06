import { Component, OnInit } from '@angular/core';
import { from, of } from 'rxjs';
import { mergeMap, delay, concatMap, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ec2ui';
  user: any;
  loggedIn: boolean;
  constructor(){
    //  this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  ngOnInit(): void {
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    //   this.loggedIn = (user != null);
    //   console.log(this.user);
    // });

    let ob1$ = from([1,2,3,0]);

    let ob2$ = (param)=>{
        return of(`waiting   for milisecond${param*1000}` )
              .pipe(
                delay(param*1000)
              )
    }
    ob1$
      .pipe(
        concatMap((param)=>ob2$(param))
      ).subscribe((val)=>{
        console.log(val);
      })






  }
}
