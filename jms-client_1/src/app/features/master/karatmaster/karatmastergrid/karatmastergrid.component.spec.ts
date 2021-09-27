import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaratmastergridComponent } from './karatmastergrid.component';

describe('KaratmastergridComponent', () => {
  let component: KaratmastergridComponent;
  let fixture: ComponentFixture<KaratmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaratmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaratmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
