import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaratmasterformComponent } from './karatmasterform.component';

describe('KaratmasterformComponent', () => {
  let component: KaratmasterformComponent;
  let fixture: ComponentFixture<KaratmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaratmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaratmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
