import { Upload } from 'antd';
import { AjaxMethods } from 'common/interface/enums';

const baseUrl = PROCESS_ENV.ENV_API;

export default {
  // 商品模块
  product: {
    list: {
      url: baseUrl + '/product/saas/product/list',
      method: AjaxMethods.GET
    },
    detail: {
      url: baseUrl + '/product/saas/product/{id}',
      method: AjaxMethods.GET
    },
    create: {
      url: baseUrl + '/product/saas/product',
      method: AjaxMethods.POST
    },
    checkTitleExist: {
      url: baseUrl + '/product/saas/product/title/exist',
      method: AjaxMethods.GET
    },
    update: {
      url: baseUrl + '/product/saas/product/{id}',
      method: AjaxMethods.PUT
    },
    delete: {
      url: baseUrl + '/product/saas/product/batch',
      method: AjaxMethods.DELETE
    },
    upShelf: {
      url: baseUrl + '/product/saas/product/shelf/batch',
      method: AjaxMethods.PUT
    },
    downShelf: {
      url: baseUrl + '/product/saas/product/shelf/batch',
      method: AjaxMethods.PUT
    },
    skuList: {
      url: baseUrl + '/product/saas/product/skuProp/list',
      method: AjaxMethods.GET
    },
    createSkuProp: {
      url: baseUrl + '/product/saas/product/skuProp',
      method: AjaxMethods.POST
    },
    createSkuValue: {
      url: baseUrl + '/product/saas/product/skuProp/{id}/skuValue',
      method: AjaxMethods.POST
    },
    updatePromotion: {
      url: baseUrl + '/product/saas/product/{id}/updatePromotion',
      method: AjaxMethods.PUT
    }
  },

};
