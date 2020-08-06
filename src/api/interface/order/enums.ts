
export const enum OrderTypeEnum {
  WxMall = 0,    // 微商城订单
  Workbench = 1, // 工作台订单，即门店订单
}

export const enum OrderPaymentTypeEnum {
  WxPay = 0,      // 微信企业收款
  WxPrivacy = 1,  // 微信私人收款
}

export const enum OrderStatusEnum {
  WaitPay = 0,     // 待支付
  WaitDeliver = 1, // 待发货
  WaitReceive = 2, // 待收货
  Completed = 3,   // 已完成
  Closed = 4,      // 已关闭
  Cancelled = 5,   // 已取消
}
