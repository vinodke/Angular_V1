import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemfamilymasterformComponent } from './itemfamilymasterform.component';

describe('ItemfamilymasterformComponent', () => {
  let component: ItemfamilymasterformComponent;
  let fixture: ComponentFixture<ItemfamilymasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemfamilymasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemfamilymasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
