import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColormasterformComponent } from './colormasterform.component';

describe('ColormasterformComponent', () => {
  let component: ColormasterformComponent;
  let fixture: ComponentFixture<ColormasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColormasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColormasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
