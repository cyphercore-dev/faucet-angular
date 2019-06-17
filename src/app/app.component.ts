import { Component } from '@angular/core';
import { WsService } from './services/ws.service';
import { Store } from '@ngrx/store';
import { State } from './state';
import { selectConsensusState } from './state/consensus/consensus.reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  consensus$ = this.appStore.select(selectConsensusState);

  constructor(
    private wsService: WsService,
    private appStore: Store<State>
  ) { }
}
