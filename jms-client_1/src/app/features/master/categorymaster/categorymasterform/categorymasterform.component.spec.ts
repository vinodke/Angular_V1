import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorymasterformComponent } from './categorymasterform.component';

describe('CategorymasterformComponent', () => {
  let component: CategorymasterformComponent;
  let fixture: ComponentFixture<CategorymasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorymasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorymasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
