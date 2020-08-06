import { GeneralParams } from '../index';
import { MaterialTypeEnum } from './enums';

// 文件夹
export interface Folder extends GeneralParams {
  id: number;
  type?: MaterialTypeEnum;
  parentId?: number;
  name: string;
  children: Folder[];
}

// 素材
export interface Material extends GeneralParams {
  type?: MaterialTypeEnum;
  folderId?: number;
  name?: string;
  url?: string;
  size?: number;
  width?: number;
  height?: number;
  suffix?: string;  // 文件后缀
}

