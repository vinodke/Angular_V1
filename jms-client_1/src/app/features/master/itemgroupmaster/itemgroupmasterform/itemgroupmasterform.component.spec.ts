import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemgroupmasterformComponent } from './itemgroupmasterform.component';

describe('ItemgroupmasterformComponent', () => {
  let component: ItemgroupmasterformComponent;
  let fixture: ComponentFixture<ItemgroupmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemgroupmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemgroupmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
