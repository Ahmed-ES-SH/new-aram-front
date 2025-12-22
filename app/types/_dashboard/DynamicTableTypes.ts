export interface ItemDataType {
  id: number;
  cell: { key: string; cellType: string };
  [key: string]: any;
}

export interface cellType {
  cellType: string;
  key: string;
  conditions?: {
    green: string;
    yellow: string;
    red: string;
  };
}

export interface SelectedItemType {
  id: number;
  title: string;
}
