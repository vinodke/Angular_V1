import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemcollectionmasterformComponent } from './itemcollectionmasterform.component';

describe('ItemcollectionmasterformComponent', () => {
  let component: ItemcollectionmasterformComponent;
  let fixture: ComponentFixture<ItemcollectionmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemcollectionmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemcollectionmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
