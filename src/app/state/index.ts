import { ActionReducerMap } from '@ngrx/store';
import { blocksReducers } from './blocks/blocks.reducers';
import { consensusRedusers } from './consensus/consensus.reducers';
import { BlocksState } from './blocks/blocks.interface';
import { ConsensusState } from './consensus/consensus.interface';
import { TxsState } from './txs/txs.interface';
import { txsReducers } from './txs/txs.reducers';

export const reducers: ActionReducerMap<State> = {
  blocksState: blocksReducers,
  txsState: txsReducers,
  consensusState: consensusRedusers,
};

export interface State {
  blocksState: BlocksState;
  txsState: TxsState;
  consensusState: ConsensusState;
};
