import { GeneralParams, Address } from '../index';
import { Employee } from '../employee';
import { LoginTypeEnum, CompanyStatusEnum, PaymentSettingTypeEnum } from './enums';

export interface Login {
  tel: string;
  type: LoginTypeEnum;
  verifyCode?: string;
  password?: string;
}

// 企业基本信息
export interface Company extends Omit<GeneralParams, 'companyId'>, Address {
  name?: string;
  logo?: string;
  status?: CompanyStatusEnum;
  empolyeeId?: number;
  empolyee?: Employee;
  email?: string;
  tel?: string;
}

// 企业配置信息
export interface Setting extends GeneralParams {
  orderCloseTime?: string;   // 未支付订单自动关闭时间
  orderReceiveTime?: string; // 已发货订单自动完成时间
  isOpenVip?: boolean;       // 是否已打开客户vip系统
  useRule?: string;          // 使用条款
  privacyRule?: string;      // 隐私政策
}

// 企业收款配置信息
export interface PaymentSetting extends GeneralParams {
  type?: PaymentSettingTypeEnum;
  mchId?: string;   // 商户ID
  mchKey?: string;   // 商户密钥
  paymentCodeUrl?: string;  // 私人收款二维码地址
}
