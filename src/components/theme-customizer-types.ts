// Types for ThemeCustomizer reducers

export interface ColorPickerState {
  isOpen: boolean;
  selectedColor: string | null;
  selectedProperty: string | null;
  activeButton: HTMLButtonElement | null;
  popoverLeft: number;
}

export type ColorPickerAction =
  | { type: 'OPEN_COLOR_PICKER'; payload: { color: string; property: string; button: HTMLButtonElement } }
  | { type: 'CLOSE_COLOR_PICKER' }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_POPOVER_POSITION'; payload: number };

export interface ExportModalState {
  showExportModal: boolean;
  exportFormat: 'css' | 'tailwind' | 'scss';
  tailwindVersion: '3' | '4';
  exportMode: 'light' | 'dark' | 'both';
  colorFormat: 'hex' | 'rgb' | 'hsl';
  copied: boolean;
  isModalClosing: boolean;
  isModalEntering: boolean;
}

export type ExportModalAction =
  | { type: 'OPEN_EXPORT_MODAL' }
  | { type: 'CLOSE_EXPORT_MODAL' }
  | { type: 'START_MODAL_CLOSING' }
  | { type: 'SET_MODAL_ENTERING'; payload: boolean }
  | { type: 'SET_EXPORT_FORMAT'; payload: 'css' | 'tailwind' | 'scss' }
  | { type: 'SET_TAILWIND_VERSION'; payload: '3' | '4' }
  | { type: 'SET_EXPORT_MODE'; payload: 'light' | 'dark' | 'both' }
  | { type: 'SET_COLOR_FORMAT'; payload: 'hex' | 'rgb' | 'hsl' }
  | { type: 'SET_COPIED'; payload: boolean };

export interface TooltipState {
  showRandomizeTooltip: boolean;
  showThemeTooltip: boolean;
  showDownloadTooltip: boolean;
}

export type TooltipAction =
  | { type: 'SHOW_RANDOMIZE_TOOLTIP'; payload: boolean }
  | { type: 'SHOW_THEME_TOOLTIP'; payload: boolean }
  | { type: 'SHOW_DOWNLOAD_TOOLTIP'; payload: boolean };

export interface ColorButtonData {
  color: string;
  label: string;
  property: string;
  fg: 'text' | 'primary' | 'accent';
  bg: 'background' | 'secondary';
  target: number;
}