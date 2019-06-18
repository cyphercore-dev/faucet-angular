import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsensusStatusComponent } from './consensus-status.component';

describe('ConsensusStatusComponent', () => {
  let component: ConsensusStatusComponent;
  let fixture: ComponentFixture<ConsensusStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsensusStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsensusStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
