import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemgroupmastergridComponent } from './itemgroupmastergrid.component';

describe('ItemgroupmastergridComponent', () => {
  let component: ItemgroupmastergridComponent;
  let fixture: ComponentFixture<ItemgroupmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemgroupmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemgroupmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
