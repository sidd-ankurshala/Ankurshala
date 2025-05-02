import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletHomeComponent } from './wallet-home.component';

describe('WalletHomeComponent', () => {
  let component: WalletHomeComponent;
  let fixture: ComponentFixture<WalletHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WalletHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
