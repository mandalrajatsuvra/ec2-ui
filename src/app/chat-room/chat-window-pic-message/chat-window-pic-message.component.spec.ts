import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWindowPicMessageComponent } from './chat-window-pic-message.component';

describe('ChatWindowPicMessageComponent', () => {
  let component: ChatWindowPicMessageComponent;
  let fixture: ComponentFixture<ChatWindowPicMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWindowPicMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWindowPicMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
