import { Action } from '@ngrx/store';

export enum TxsActionTypes {
  ADD_TX = 'ADD_TX',
  UPDATE_TXS = 'UPDATE_TXS'
}

export class AddTx implements Action {
  readonly type = TxsActionTypes.ADD_TX;
  constructor(public payload: any) {};
}

export class UpdateTxs implements Action {
  readonly type = TxsActionTypes.UPDATE_TXS;
  constructor(public payload: any[]) {};
}