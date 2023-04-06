import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLargePopupComponent } from './image-large-popup.component';

describe('ImageLargePopupComponent', () => {
  let component: ImageLargePopupComponent;
  let fixture: ComponentFixture<ImageLargePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageLargePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageLargePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
