import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategorymastergridComponent } from './subcategorymastergrid.component';

describe('SubcategorymastergridComponent', () => {
  let component: SubcategorymastergridComponent;
  let fixture: ComponentFixture<SubcategorymastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategorymastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategorymastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
