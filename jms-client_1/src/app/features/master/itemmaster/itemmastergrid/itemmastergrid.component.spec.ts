import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemmastergridComponent } from './itemmastergrid.component';

describe('ItemmastergridComponent', () => {
  let component: ItemmastergridComponent;
  let fixture: ComponentFixture<ItemmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
