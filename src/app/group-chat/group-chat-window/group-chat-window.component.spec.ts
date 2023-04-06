import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatWindowComponent } from './group-chat-window.component';

describe('GroupChatWindowComponent', () => {
  let component: GroupChatWindowComponent;
  let fixture: ComponentFixture<GroupChatWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
