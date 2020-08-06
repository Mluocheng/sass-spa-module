import { GeneralParams, Address } from '../index';
import { Employee } from '../employee';
import { StoreStatusEnum } from './enums';

// 门店信息
export interface Store extends GeneralParams, Address {
  name?: string;
  shopownerId?: number;
  lat?: number;
  lng?: number;
  employee?: Employee;
  status?: StoreStatusEnum;
  storeTagId?: number;
  storeTag?: StoreTag;
}

export interface StoreTag extends GeneralParams {
  id?: number;
  name?: string;
  storeQuantity?: number;
}

