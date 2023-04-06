import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { Observable } from 'rxjs';
import {concatMap} from 'rxjs/operators';

export interface User{
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  imageurl: string;
  phoneno: string;
  address: string;
  online: number;
  noOfUnreadMessages: number;
  unreadMessageTimeStamp: number;
};
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  uploadedImage: File;
  imageUrl: string;
  @ViewChild('hiddenFileInput')
  htmlFileElement: ElementRef;
  isSpinerTrue: boolean;
  userFormGroup: FormGroup;
  constructor(private fb: FormBuilder, private httpClient: HttpClient,
              private router: Router , private imageService: ImageService) { }

  ngOnInit(): void {
    this.isSpinerTrue = false;
    this.userFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['',  Validators.required],
      phoneno: ['', Validators.required],
      uploadimage: [null , Validators.required]
    });
    this.imageUrl =  'https://maliantala-s3-bucket.s3.ap-south-1.amazonaws.com/useIcon.png';
  }
  handleImageInput(filelist: FileList){
     this.uploadedImage = filelist.item(0);
     console.log(this.uploadedImage);
     const reader: FileReader = new FileReader();
     reader.onload = (event: any) => {
          console.log(event);
          this.imageUrl = event.target.result;
      };
     reader.readAsDataURL(this.uploadedImage);
  }
  onSubmitUserForm(): void{
      this.isSpinerTrue = true;
      console.log(this.userFormGroup);
      console.log(this.userFormGroup.get('username').value);
      const userData: any = {
          username: this.userFormGroup.get('username').value,
          password: this.userFormGroup.get('password').value,
          firstname: this.userFormGroup.get('firstname').value,
          lastname: this.userFormGroup.get('lastname').value,
          address : this.userFormGroup.get('address').value,
          phoneno:  this.userFormGroup.get('phoneno').value
      };
      const fd = new FormData();
      fd.append('file', this.uploadedImage, this.uploadedImage.name);

      let uploadImageObservable$: Observable<any>
          = this.httpClient.post('http://localhost:8081/storage/uploadImage',fd, {observe: 'body'});
      uploadImageObservable$
          .pipe(concatMap((data: any) =>{
             console.log('imege url'+ data.imageurl);
              let userdata = {...userData ,  imageurl: data.imageurl};
              return  this.httpClient.post('http://localhost:8081/adduser',userdata ,{observe: 'body'})
                      .pipe(concatMap((userDatam: any)=>{
                          console.log('userdatam is--------------'+userDatam.id);
                          this.imageService.user = <User>userDatam;
                          return this.imageService.getAllUsers(1);
                      }))
              }            
            )
          ).subscribe((users: User[])=>{
              this.router.navigate(['/home']);
              this.imageService.groupusers = users;
      });
  }
  onClickImageIcon(): void{
    this.htmlFileElement.nativeElement.click();
  }
}
