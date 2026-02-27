import {
  ColorPickerState,
  ColorPickerAction,
  ExportModalState,
  ExportModalAction,
  TooltipState,
  TooltipAction,
} from './theme-customizer-types';

// Color Picker Reducer
export const initialColorPickerState: ColorPickerState = {
  isOpen: false,
  selectedColor: null,
  selectedProperty: null,
  activeButton: null,
  popoverLeft: 0,
};

export function colorPickerReducer(
  state: ColorPickerState,
  action: ColorPickerAction
): ColorPickerState {
  switch (action.type) {
    case 'OPEN_COLOR_PICKER':
      return {
        ...state,
        isOpen: true,
        selectedColor: action.payload.color,
        selectedProperty: action.payload.property,
        activeButton: action.payload.button,
      };
    case 'CLOSE_COLOR_PICKER':
      return {
        ...state,
        isOpen: false,
        selectedColor: null,
        selectedProperty: null,
        activeButton: null,
      };
    case 'SET_COLOR':
      return {
        ...state,
        selectedColor: action.payload,
      };
    case 'SET_POPOVER_POSITION':
      return {
        ...state,
        popoverLeft: action.payload,
      };
    default:
      return state;
  }
}

// Export Modal Reducer
export const initialExportModalState: ExportModalState = {
  showExportModal: false,
  exportFormat: 'css',
  tailwindVersion: '4',
  exportMode: 'both',
  colorFormat: 'oklch',
  copied: false,
  isModalClosing: false,
  isModalEntering: false,
};

export function exportModalReducer(
  state: ExportModalState,
  action: ExportModalAction
): ExportModalState {
  switch (action.type) {
    case 'OPEN_EXPORT_MODAL':
      return {
        ...state,
        showExportModal: true,
        isModalClosing: false,
        isModalEntering: false,
      };
    case 'CLOSE_EXPORT_MODAL':
      return {
        ...state,
        showExportModal: false,
        isModalClosing: false,
      };
    case 'START_MODAL_CLOSING':
      return {
        ...state,
        isModalClosing: true,
        isModalEntering: false,
      };
    case 'SET_MODAL_ENTERING':
      return {
        ...state,
        isModalEntering: action.payload,
      };
    case 'SET_EXPORT_FORMAT':
      return {
        ...state,
        exportFormat: action.payload,
      };
    case 'SET_TAILWIND_VERSION':
      return {
        ...state,
        tailwindVersion: action.payload,
      };
    case 'SET_EXPORT_MODE':
      return {
        ...state,
        exportMode: action.payload,
      };
    case 'SET_COLOR_FORMAT':
      return {
        ...state,
        colorFormat: action.payload,
      };
    case 'SET_COPIED':
      return {
        ...state,
        copied: action.payload,
      };
    default:
      return state;
  }
}

// Tooltip Reducer
export const initialTooltipState: TooltipState = {
  showRandomizeTooltip: false,
  showThemeTooltip: false,
  showDownloadTooltip: false,
  harmonyDropdownOpen: false,
};

export function tooltipReducer(
  state: TooltipState,
  action: TooltipAction
): TooltipState {
  switch (action.type) {
    case 'SHOW_RANDOMIZE_TOOLTIP':
      return {
        ...state,
        showRandomizeTooltip: action.payload,
      };
    case 'SHOW_THEME_TOOLTIP':
      return {
        ...state,
        showThemeTooltip: action.payload,
      };
    case 'SHOW_DOWNLOAD_TOOLTIP':
      return {
        ...state,
        showDownloadTooltip: action.payload,
      };
    case 'TOGGLE_HARMONY_DROPDOWN':
      return {
        ...state,
        harmonyDropdownOpen: !state.harmonyDropdownOpen,
        showRandomizeTooltip: false,
      };
    case 'CLOSE_HARMONY_DROPDOWN':
      return {
        ...state,
        harmonyDropdownOpen: false,
      };
    default:
      return state;
  }
}