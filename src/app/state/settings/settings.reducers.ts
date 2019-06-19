import { SettingsActionTypes } from './settings.actions';
import { SettingsState } from './settings.interface';
import { createSelector } from '@ngrx/store';


export function settingsReducers(settingsState = initialSettingsState, action): SettingsState {
  switch(action.type) {
    case SettingsActionTypes.TOGGLE_THEME: {
      return {
        ...settingsState,
        themes: settingsState.themes.reverse(),
      }
    }
    default: {
      return settingsState;
    }
  }
}

export const initialSettingsState: SettingsState = {
  themes: [
    'light-theme',
    'dark-theme',
  ]
};

export const selectSettingsState = (state) => state.settingsState;
export const selectActiveTheme = createSelector(selectSettingsState, (state) => state.themes[0]);