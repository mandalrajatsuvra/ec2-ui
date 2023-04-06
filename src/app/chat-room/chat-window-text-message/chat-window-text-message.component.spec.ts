import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWindowTextMessageComponent } from './chat-window-text-message.component';

describe('ChatWindowTextMessageComponent', () => {
  let component: ChatWindowTextMessageComponent;
  let fixture: ComponentFixture<ChatWindowTextMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWindowTextMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWindowTextMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
