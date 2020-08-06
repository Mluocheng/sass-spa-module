import { GeneralParams } from '../index';
import { ProductStatusEnum } from './enums';

// 商品信息
export interface Product extends GeneralParams {
  isPromotion?: boolean;
  promotionTag?: string;
  promotionPrice?: number;
  id?: number;
  name?: string;
  status?: ProductStatusEnum;
  barCode?: string;
  code?: string;
  rfId?: string;
  minPrice?: number;
  price?: number;
  variablePrice?: number;
  stock?: number;
  indexImage?: string;
  images?: string;
  video?: string;
  detail?: string;
  serviceTypeIds?: string; // 0-售后服务 1-保修服务 2-7天退换货承诺  格式：0,1
  virtualSale?: number;
  sale?: number;
  productCategoryIds?: number[];
  productCategories?: ProductCategory[];
  skuProps?: SkuProp[];
  skus?: Sku[];
}

// 商品的规格
export interface SkuProp extends GeneralParams {
  name?: string;
  skuValues?: SkuValue[];
}

// 商品规格的值
export interface SkuValue extends GeneralParams {
  name?: string;
  propId?: string;
  prop?: SkuProp;
}

// 商品SKU
export interface Sku extends GeneralParams {
  isPromotion?: boolean;
  promotionTag?: string;
  promotionPrice?: number;
  properties?: string;
  price?: number;
  indexImage?: string;
  barCode?: string;
  code?: string;
  stock?: number;
  productId?: number;
  rfId?: string;
  minPrice?: number;
  indexBarCode?: number;
  waringBarCode?: boolean;
  waringCode?: boolean;
  // waringStock?: boolean;
  // waringPrice?: boolean;
}

// 商品分类
export interface ProductCategory extends GeneralParams {
  id: number;
  parentId?: number;
  name: string;
  children: ProductCategory[];
}
