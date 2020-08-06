import { GeneralParams, Address } from '../index';
import { SexEnum } from '../enmus';
import { Product } from '../product';
import { Employee } from '../employee';
import { CustomerTagTypeEnum, CustomerGroupTypeEnum, DeliverAddressTypeEnum } from './enums';

// 顾客信息
export interface Customer extends GeneralParams, Address {
  openId?: string;
  wxNickname?: string;
  name?: string;
  tel?: string;
  avatar?: string;
  sex?: SexEnum;
  isVip?: boolean;
  vipId?: number;
  vip?: Vip;
  vipEmployeeId?: number; // 帮助这个顾客成为会员的员工ID
  vipEmployee?: Employee;
  vipJoinTime?: string;   // 入会时间
  isCaller?: boolean;     // 是否是访客
  sumAmount?: number;     // 累积消费金额
  sumQuantity?: number;   // 累积消费次数
  averageAmount?: number; // 客单价
  lastOrderPayTime?: string; // 最近消费时间
  customerTags?: CustomerTag[];
  customerGroups?: string;
}

// 会员配置
export interface Vip extends GeneralParams {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  name?: string;
  amount?: number;  // 升级金额
  rebate?: number;  // 折扣
  icon?: string;    // 会员卡图标链接
}

// 客户标签
export interface CustomerTag extends GeneralParams {
  name?: string;
  type?: CustomerTagTypeEnum;
  customerQuantity?: number;
  employeeId?: number;         // 创建的导购
}

// 系统客户分群
export interface CustomerGroup extends GeneralParams {
  type?: CustomerGroupTypeEnum;
  quantity?: number;
}

// 顾客收货地址
export interface DeliverAddress extends GeneralParams, Address {
  customerId?: number;
  name?: string;
  tel?: string;
  type?: DeliverAddressTypeEnum;
  isDefault?: boolean;
}

// 顾客购物车
export interface CustomerCart extends GeneralParams {
  customerId?: number;
  productId?: number;
  product?: Product;
  quantity?: number;
}

// 客户收藏
export interface CustomerCollection extends GeneralParams {
  customerId?: number;
  productId?: number;
  product?: Product;
}
