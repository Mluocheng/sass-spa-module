import { GeneralParams } from '../index';
import { Customer } from '../customer';
import { Store } from '../store';
import { Employee } from '../employee';
import { Product, Sku } from '../product';
import { OrderTypeEnum, OrderPaymentTypeEnum, OrderStatusEnum } from './enums';

// 订单信息
export interface Order extends GeneralParams {
  number?: string;
  type?: OrderTypeEnum;
  paymentType?: OrderPaymentTypeEnum;
  storeId?: number;
  store?: Store;
  employeeId?: number;
  employee?: Employee;
  customerId?: string;
  customer?: Customer;
  status?: OrderStatusEnum;
  orderDetails?: OrderDetail[];
  payTime?: string;
  sendTime?: string;
  finishTime?: string;
  closeTime?: string;
  cancelTime?: string;
  sumAmount?: number;             // 总金额
  employeeRemark?: string;
  customerRemark?: string;
  deliverAddressId?: number;
  deliverAddressName?: string;
  deliverAddressTel?: string;
  deliverAddressDetail?: string;
  expressName?: string;
  expressNumber?: string;
}

// 订单详细信息
export interface OrderDetail extends GeneralParams {
  orderId?: number;
  productId?: number;
  product?: Product;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  quantity?: number;
  skuId?: number;
  sku?: Sku;
  skuName?: string;      // 商品SKU的名称（快照）格式：颜色:黄色;尺寸:M型号（直接存名称）
}
