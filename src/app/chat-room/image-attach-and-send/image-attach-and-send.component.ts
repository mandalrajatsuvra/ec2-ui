import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, ComponentFactoryResolver } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { ImageService } from '../../services/image.service';
import { HttpClient } from '@angular/common/http';
import { concatMap } from 'rxjs/operators';
import { MessagequeueService } from 'src/app/services/messagequeue.service';
import { StompService } from '@stomp/ng2-stompjs';
import { ChatWindowPicMessageComponent } from '../chat-window-pic-message/chat-window-pic-message.component';
import { AddDirectiveDirective } from '../add-directive.directive';



export interface PictureMessage{
    id: number;
    type: string;
    form: number;
    to: number;
    url: string;
    hashKey: string;
    caption: string;
}
@Component({
  selector: 'app-image-attach-and-send',
  templateUrl: './image-attach-and-send.component.html',
  styleUrls: ['./image-attach-and-send.component.css']
})
export class ImageAttachAndSendComponent implements OnInit , OnDestroy{


  @Input() from: number;
  @Input() to: number;
  @Input() addDirective: AddDirectiveDirective;
  sendImage: File;

  @ViewChild('hiddenFileInput') hiddenFileInput: ElementRef

  subjectSubscription: Subscription;
  showImageIcon: boolean;
  shouldRenderImageIcon: boolean;
  picSendImageSrc: string;
  uploadedPicLink: string;
  
  readQueueSubScriptions: Subscription;
  constructor(private imageService: ImageService,
              private httpClient : HttpClient,
              private mqService: MessagequeueService,
              private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
      this.shouldRenderImageIcon = false;
      this.subjectSubscription = this.imageService.picAttachAndSendFireSubject
            .subscribe((value: boolean)=>{
                this.showImageIcon = true;
                (<HTMLInputElement>this.hiddenFileInput.nativeElement).click();
      });
  }
  ngOnDestroy(): void{
      this.subjectSubscription.unsubscribe();
      this.showImageIcon = false;
      this.shouldRenderImageIcon = false;
  }
  handleImageInput(fileList: FileList){
    let t= fileList.item(0);
    this.sendImage = t;
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(t);
    fileReader.onload = (event: any)=>{
       this.picSendImageSrc = event.target.result;
       this.shouldRenderImageIcon = true;
    }
  }
  onClickBackButton(){
    this.shouldRenderImageIcon = false;
  }
  onClickSendButton(){
      const fd = new FormData();
      fd.append('file', this.sendImage,this.sendImage.name);
      let message :PictureMessage = null;
      let uploadImageObservable$: Observable<any>
          = this.httpClient.post('http://localhost:8081/storage/uploadPicMessage',fd, {observe: 'body'});
      uploadImageObservable$.pipe(concatMap((data: any)=>{
        console.log('imege url'+ data.url);
        this.uploadedPicLink = data.url;
        let message={
          type: 'picture',
          form: this.from,
          to: this.to,
          url: data.url,
          hashKey: data.s3Object.key,
          caption: ''
        };
        return this.mqService.writePoint2pointMessageOnQueue(message);
      })).subscribe((data: any)=>{
        this.shouldRenderImageIcon = false;
        const componentFactory=
        this.componentFactoryResolver.resolveComponentFactory(ChatWindowPicMessageComponent);
        const viewContainerRef = this.addDirective.viewContainerRef;
        const componentRef =viewContainerRef.createComponent<ChatWindowPicMessageComponent>(componentFactory);
        componentRef.instance.isRightMessage= true;
        componentRef.instance.imageSource = this.uploadedPicLink;
        
      })
  }
}
