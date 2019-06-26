import { ActionReducerMap } from '@ngrx/store';
import { blocksReducers } from './blocks/blocks.reducers';
import { consensusRedusers } from './consensus/consensus.reducers';
import { BlocksState } from './blocks/blocks.interface';
import { ConsensusState } from './consensus/consensus.interface';
import { TxsState } from './txs/txs.interface';
import { txsReducers } from './txs/txs.reducers';
import { SettingsState } from './settings/settings.interface';
import { settingsReducers } from './settings/settings.reducers';
import { faucetReducers } from './faucet/faucet.reducers';
import { FaucetState } from './faucet/faucet.interface';

export const reducers: ActionReducerMap<State> = {
  blocksState: blocksReducers,
  txsState: txsReducers,
  consensusState: consensusRedusers,
  settingsState: settingsReducers,
  faucetState: faucetReducers
};

export interface State {
  blocksState: BlocksState;
  txsState: TxsState;
  consensusState: ConsensusState;
  settingsState: SettingsState;
  faucetState: FaucetState;
};
