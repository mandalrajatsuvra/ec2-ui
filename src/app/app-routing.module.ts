import { ChatWindowComponent } from './chat-room/chat-window/chat-window.component';
import { ChatMainComponent } from './chat-room/chat-main/chat-main.component';
import { WeatherComponent } from './weather/weather.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { MessageComponent } from './message/message.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BootstrapComponent } from './auth/bootstrap/bootstrap.component';
import { GroupChatWindowComponent } from './group-chat/group-chat-window/group-chat-window.component';
const routes: Routes = [
  {path: 'home', component: HomeComponent ,
      children:[
          {path: 'news-feed' ,component : NewsFeedComponent},
          {path: 'chat-room' ,component: ChatMainComponent},
          {path: 'chat-room/:id' ,component: ChatWindowComponent},
          {path: 'group-chat-room', component: GroupChatWindowComponent},
          {path : '', redirectTo : 'news-feed' , pathMatch: 'full'}
      ]
  },
  {path: 'auth' , component: BootstrapComponent},
  {path: 'signup' , component: SignupComponent},
  {path: 'message' , component : MessageComponent},
  {path: '**' , redirectTo: 'home', pathMatch: 'full'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
