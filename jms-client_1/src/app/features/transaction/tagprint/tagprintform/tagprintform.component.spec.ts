import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagprintformComponent } from './tagprintform.component';

describe('TagprintformComponent', () => {
  let component: TagprintformComponent;
  let fixture: ComponentFixture<TagprintformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagprintformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagprintformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
