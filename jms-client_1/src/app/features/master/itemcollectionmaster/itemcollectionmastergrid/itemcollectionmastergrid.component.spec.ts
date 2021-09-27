import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemcollectionmastergridComponent } from './itemcollectionmastergrid.component';

describe('ItemcollectionmastergridComponent', () => {
  let component: ItemcollectionmastergridComponent;
  let fixture: ComponentFixture<ItemcollectionmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemcollectionmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemcollectionmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
