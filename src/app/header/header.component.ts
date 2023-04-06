import { Component, OnInit, HostListener } from '@angular/core';
import { ImageService } from '../services/image.service';

export const mainRoutes=[
      {routerlink: 'news-feed' , value: 'Top Ten News Feed'},
      {routerlink: 'chat-room' , value: 'Go To Chat Room'},
      {routerlink: 'group-chat-room' , value: 'Go To Group Chat Room'},
      {routerlink: 'weather-forecast' , value: 'Weather Forecast Page'},
      {routerlink: 'location-map' , value: 'Google Map Location Page'},
      {routerlink: 'profile-page' , value: 'Visit Your Profile Page'},
      {routerlink: 'group-member' , value: 'Go To Group Member Page'},
      {routerlink: 'about-us' , value: 'About Us'}
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  mainNavRoutes = [
    {name: 'news-feed' , value: 'Top Ten News Feed'},
    {name: 'chat-room' , value: 'Go To Chat Room'},
    {name: 'group-chat-room' , value: 'Go To Group Chat Room'},
    {name: 'weather-forecast' , value: 'Weather Forecast Page'},
    {name: 'location-map' , value: 'Google Map Location Page'},
    {name: 'profile-page' , value: 'Visit Your Profile Page'},
    {name: 'group-member' , value: 'Go To Group Member Page'},
    {name: 'about-us' , value: 'About Us'}
  ];
  menuDivActive: boolean ;
  innerhtml: string;
  imageUrl: string;
  appUser: string;
  constructor(private imageService: ImageService ) { }

  ngOnInit(): void
  {
    this.imageUrl = this.imageService.user ==null ?
    'https://image-bucket-maliantala-app.s3.ap-south-1.amazonaws.com/pic2.jpg': this.imageService.user.imageurl;
    this.appUser = this.imageService.user.firstname
    this.menuDivActive = false;
  }
  onClickMenuToggler(): void{
    this.menuDivActive = !this.menuDivActive;

  }
}
