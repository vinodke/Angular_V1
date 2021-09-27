import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemfamilymastergridComponent } from './itemfamilymastergrid.component';

describe('ItemfamilymastergridComponent', () => {
  let component: ItemfamilymastergridComponent;
  let fixture: ComponentFixture<ItemfamilymastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemfamilymastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemfamilymastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
