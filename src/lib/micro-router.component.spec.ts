import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroRouterComponent } from './micro-router.component';

describe('MicroRouterComponent', () => {
  let component: MicroRouterComponent;
  let fixture: ComponentFixture<MicroRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MicroRouterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
