import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItembrandmastergridComponent } from './itembrandmastergrid.component';

describe('ItembrandmastergridComponent', () => {
  let component: ItembrandmastergridComponent;
  let fixture: ComponentFixture<ItembrandmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItembrandmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItembrandmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
