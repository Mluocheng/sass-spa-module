import { GeneralParams } from '../index';
import { Product } from '../product';
import { Customer } from '../customer';
import { PageTypeEnum, DataPointTypeEnum, SystemPageTypeEnum } from './enums';

// 轻页面
export interface Page extends GeneralParams {
  title?: string;
  // name?: string;
  goodsId?: number;
  type?: PageTypeEnum | SystemPageTypeEnum;
  pageClassId?: number;
  json?: string;
  putNumber?: string; // 一投放的页面数量
  modalPageId?: string; // 关联弹层页面ID
  floatPageId?: string; // 关联悬浮页面ID
}

// 轻页面分类
export interface PageCategory extends GeneralParams {
  name?: string;
  type?: PageTypeEnum;
}

// 微商城买点数据
export interface DataPoint {
  type?: DataPointTypeEnum;
  productId?: number;
  productName?: string;
  employeeId?: number;
  employeeName?: string;
  customerId?: number;
  customerName?: string;
  entryTime?: string; // 进入时间
  leaveTime?: string; // 离开时间
  staySeconds?: number; // 停留秒数
}

export interface CommitInfo {
  template_id: string;
  user_version: string;
  user_desc: string;
}

export interface PublishInfo {
  title: string;
  address: string;
  tag?: string;
  first_class: string;
  second_class?: string;
  first_id: number;
  second_id: number;
  third_class?: string;
  third_id?: number;
}

interface ExterList {
  inner_list: InnerList[];
}

interface InnerList {
  name: string;
  url: string;
}

interface Qualify {
  exter_list: ExterList[];
  remark: string;
}

export interface Categories {
  id: number;
  children?: number[];
  qualify?: Qualify;
  name?: string;
  level?: number;
  father?: number;
  sensitive_type?: number;
}

export interface AuthResult {
  errmsg: string;
  errcode?: number;
  code?: string;
  categories_list?: Categories[];
}

export interface MaInfo {
  // 小程序信息
  userVersion?: string|number;
  authorizerAppid: string;
  userName?: string;
  nickName?: string;
  signature?: string; // 描述
  qrcodeUrl?: string; // 小程序码
}

export interface MallClass {
  firstClass: string;
  firstId: number;
  secondClass: string;
  secondId: number;
  thirdClass: string;
  thirdId: number;
}
