import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItembrandmasterformComponent } from './itembrandmasterform.component';

describe('ItembrandmasterformComponent', () => {
  let component: ItembrandmasterformComponent;
  let fixture: ComponentFixture<ItembrandmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItembrandmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItembrandmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
