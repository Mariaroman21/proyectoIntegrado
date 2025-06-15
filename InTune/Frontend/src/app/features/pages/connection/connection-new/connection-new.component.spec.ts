import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionNewComponent } from './connection-new.component';

describe('ConnectionNewComponent', () => {
  let component: ConnectionNewComponent;
  let fixture: ComponentFixture<ConnectionNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
