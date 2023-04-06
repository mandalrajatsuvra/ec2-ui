import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAttachAndSendComponent } from './image-attach-and-send.component';

describe('ImageAttachAndSendComponent', () => {
  let component: ImageAttachAndSendComponent;
  let fixture: ComponentFixture<ImageAttachAndSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageAttachAndSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageAttachAndSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
