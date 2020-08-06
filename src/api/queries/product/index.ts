import { message } from 'antd';
import { ProductStatusEnum } from 'api/interface/product/enums';
import Ajax from 'common/utils/ajax';
import api from 'api';
import { PagList, List, PagParams } from 'api/interface';
import { Product, ProductCategory, SkuProp } from 'api/interface/product';
import { splitParamsToUrl } from '../utils';

// 商品列表请求字段
export interface ProductListParams extends PagParams {
  status: ProductStatusEnum;
  keywords?: string;
  column?:
    | 'price'
    | 'stock'
    | 'sale'
    | 'promotionPrice'
    | 'promotion_price'
    | ''; //
  isAsc?: boolean; // 是否是升序
  search?: string;
  // isEdited?: boolean; // 是否为编辑
}

// 商品分类中的商品列表 请求字段
export interface CategoryProductsParams extends PagParams {
  keywords?: string;
  status: ProductStatusEnum;
}

/**
 * 获取商品列表
 * @param params
 */
export function getProductList(params: ProductListParams) {
  return Ajax.query<ProductListParams, PagList<Product>>({
    ...api.product.list,
    params
  });
}

/**
 * 获取商品详情
 * @param id
 */
export function getProduct(id: number) {
  return Ajax.query<void, Omit<Product, 'skuProps'> & { skuProps?: SkuProp[] }>(
    {
      ...api.product.detail,
      url: splitParamsToUrl(api.product.detail.url, { id })
    }
  );
}

/**
 * 创建商品
 * @param params
 */
export function createProduct(params: Product, per) {
  const { id, name, minPrice, price, skus, promotionPrice, ...others } = params;
  let arr = [];
  skus.forEach(item => {
    let lis = {
      ...item,
      price: (item.price / 100) * 10000,
      minPrice: (item.minPrice / 100) * 10000,
      promotionPrice: item.promotionPrice
        ? (item.promotionPrice / 100) * 10000
        : null
    };
    arr.push(lis);
  });
  return Ajax.query<Product, { id: number }>({
    ...api.product.create,
    type: 'body',
    params: {
      id: id,
      promotionPrice: promotionPrice ? (promotionPrice / 100) * 10000 : null,
      name: name.trim(),
      minPrice: (minPrice / 100) * 10000,
      price: (price / 100) * 10000,
      skus: arr,
      ...others
    }
  });
}

/**
 * 检测商品是否重名
 * @param title
 * @param productId
 */
export function checkTitleExist(name: string, productId?: number) {
  return Ajax.query<
    { name: string; productId?: number; type?: string },
    { isExist: boolean }
  >({
    ...api.product.checkTitleExist,
    params: { name, productId }
  });
}
export function checkBarCodeExist(barCode: string, productId?: number) {
  return Ajax.query<
    { barCode: string; productId?: number; type?: string },
    { isExist: boolean }
  >({
    ...api.product.checkTitleExist,
    params: { barCode, productId }
  });
}
export function checkCodeExist(code: string, productId?: number) {
  return Ajax.query<
    { code: string; productId?: number; type?: string },
    { isExist: boolean }
  >({
    ...api.product.checkTitleExist,
    params: { code, productId }
  });
}
export function checkRfIdExist(rfId: string, productId?: number) {
  return Ajax.query<
    { rfId: string; productId?: number; type?: string },
    { isExist: boolean }
  >({
    ...api.product.checkTitleExist,
    params: { rfId, productId }
  });
}
/**
 * 设置单品促销
 * @param id
 * @param params
 */
export function upGoodsPopover(id: number, params: Product) {

  return Ajax.query<Product, void>({
    ...api.product.updatePromotion,
    url: splitParamsToUrl(api.product.updatePromotion.url, { id }),
    params,
    successNotice: '单品优惠设置成功'
  });
}

/**
 * 更新商品
 * @param id
 * @param params
 */
export function updateProduct(id: number, params: Product) {
  const { name, minPrice, price, skus, promotionPrice, ...others } = params;
  let arr = [];
  skus.forEach(item => {
    let lis = {
      ...item,
      price: (item.price / 100) * 10000,
      minPrice: (item.minPrice / 100) * 10000,
      promotionPrice: item.promotionPrice
        ? (item.promotionPrice / 100) * 10000
        : null
    };
    arr.push(lis);
  });
  return Ajax.query<Product, void>({
    ...api.product.update,
    url: splitParamsToUrl(api.product.update.url, { id }),
    params: {
      id: id,
      promotionPrice: promotionPrice ? (promotionPrice / 100) * 10000 : null,
      name: name.trim(),
      minPrice: (minPrice / 100) * 10000,
      price: (price / 100) * 10000,
      skus: arr,
      ...others
    },
    type: 'body'
  });
}

/**
 * 批量删除商品
 * @param ids
 */
export function deleteProducts(ids: string) {
  return Ajax.query<{ ids: string }, void>({
    ...api.product.delete,
    params: { ids }
  });
}

/**
 * 批量上架商品
 * @param ids
 */
export function upShelfProducts(ids: string) {
  return Ajax.query<{ ids: string; isShelf: true }, void>({
    ...api.product.upShelf,
    params: { ids, isShelf: true }
  });
}

/**
 * 批量下架商品
 * @param ids
 */
export function downShelfProducts(ids: string) {
  return Ajax.query<{ ids: string; isShelf: false }, void>({
    ...api.product.downShelf,
    params: { ids, isShelf: false }
  });
}

/**
 * 获取商家配置的商品规格列表
 */
export function getSkuProps() {
  return Ajax.query<void, List<SkuProp>>({
    ...api.product.skuList
  });
}

/**
 * 新增商品规格
 * @param name
 */
export function addSkuProp(name: string) {
  return Ajax.query<{ name: string }, { id: number }>({
    ...api.product.createSkuProp,
    params: { name },
    successNotice: '新增商品规格成功'
  });
}

/**
 * 新增商品规格的值
 * @param propId
 * @param name
 */
export function addSkuValue(propId: number, name: string) {
  return Ajax.query<{ name: string; skuPropId: number }, { id: number }>({
    ...api.product.createSkuValue,
    url: splitParamsToUrl(api.product.createSkuValue.url, { id: propId }),
    params: { name, skuPropId: propId },
    successNotice: '新增商品规格属性成功'
  });
}





