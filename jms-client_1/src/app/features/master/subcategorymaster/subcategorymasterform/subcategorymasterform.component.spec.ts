import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategorymasterformComponent } from './subcategorymasterform.component';

describe('SubcategorymasterformComponent', () => {
  let component: SubcategorymasterformComponent;
  let fixture: ComponentFixture<SubcategorymasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategorymasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategorymasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
