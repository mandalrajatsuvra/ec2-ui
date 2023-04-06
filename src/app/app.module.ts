import { SignupComponent } from './auth/signup/signup.component';
import { BootstrapComponent } from './auth/bootstrap/bootstrap.component';
import { AuthModule } from './auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DropdownMenuComponent } from './dropdown-menu/dropdown-menu.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { AuthServiceConfig, FacebookLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { WeatherComponent } from './weather/weather.component';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import { MessageComponent } from './message/message.component';
import * as SockJS from 'sockjs-client';
import { SpinnerComponent } from './spinner/spinner.component';
import { ChatMainComponent } from './chat-room/chat-main/chat-main.component';
import { ChatUserComponent } from './chat-room/chat-user/chat-user.component';
import { ChatWindowComponent } from './chat-room/chat-window/chat-window.component';
import { ImagePopupComponent } from './chat-room/image-popup/image-popup.component';
import { GroupChatWindowComponent } from './group-chat/group-chat-window/group-chat-window.component';
import { environment } from 'src/environments/environment';
import { ImageLargePopupComponent } from './chat-room/image-large-popup/image-large-popup.component';
import { ImageAttachAndSendComponent } from './chat-room/image-attach-and-send/image-attach-and-send.component';
import { ChatWindowTextMessageComponent } from './chat-room/chat-window-text-message/chat-window-text-message.component';
import { ChatWindowPicMessageComponent } from './chat-room/chat-window-pic-message/chat-window-pic-message.component';
import { AddDirectiveDirective } from './chat-room/add-directive.directive';

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('1486423558205708')
  }
]);

export function provideConfig() {
  return config;
}


// Messaging with sromp client;

const stompConfig: StompConfig = {
  url: `ws://${environment.apiUrl}:61614`,
  headers: {
    login: 'guest',
    passcode: 'guest',
  },
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 500,
  debug: true,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DropdownMenuComponent,
    NewsFeedComponent,
    WeatherComponent,

    BootstrapComponent,
    SignupComponent,
    MessageComponent,
    SpinnerComponent,
    ChatMainComponent,
    ChatUserComponent,
    ChatWindowComponent,
    ImagePopupComponent,
    GroupChatWindowComponent,
    ImageLargePopupComponent,
    ImageAttachAndSendComponent,
    ChatWindowTextMessageComponent,
    ChatWindowPicMessageComponent,
    AddDirectiveDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

    AuthModule,
    AppRoutingModule,
    SocialLoginModule
  ],
  providers: [
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: provideConfig
    // },
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
