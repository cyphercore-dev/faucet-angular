import { Component, OnInit } from '@angular/core';
import { selectConsensusHeight, selectConsensusStep } from 'src/app/state/consensus/consensus.reducers';
import { State } from 'src/app/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-consensus-status',
  templateUrl: './consensus-status.component.html',
  styleUrls: ['./consensus-status.component.scss']
})
export class ConsensusStatusComponent implements OnInit {
  progress: number = 0;
  height = this.appStore.select(selectConsensusHeight);

  constructor(
    private appStore: Store<State>
  ) { }
  
  ngOnInit() {
    this.appStore.select(selectConsensusStep).subscribe((step:string) => {
      switch (step) {
        case 'RoundStepNewHeight':
          this.progress = 0;
          break;

        case 'RoundStepPropose':
          this.progress = 25;
          break;

        case 'RoundStepPrevote':
          this.progress = 50;
          break;

        case 'RoundStepPrecommit':
          this.progress = 75;
          break;

        case 'RoundStepCommit':
            this.progress = 100;
          break;
                
        default:
          break;
      }
    });
  }
}