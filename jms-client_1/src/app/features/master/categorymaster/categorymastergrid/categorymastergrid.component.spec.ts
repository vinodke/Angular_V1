import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorymastergridComponent } from './categorymastergrid.component';

describe('CategorymastergridComponent', () => {
  let component: CategorymastergridComponent;
  let fixture: ComponentFixture<CategorymastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorymastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorymastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
