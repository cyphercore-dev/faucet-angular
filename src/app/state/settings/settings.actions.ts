import { Action } from '@ngrx/store';

export enum SettingsActionTypes {
  TOGGLE_THEME = 'TOGGLE_THEME',
};

export class ToggleTheme implements Action {
  readonly type = SettingsActionTypes.TOGGLE_THEME;
  constructor() {};
}
