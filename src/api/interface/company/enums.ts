
// 登录类型
export const enum LoginTypeEnum {
  Password = 2,   // 密码登录
  VerifyCode = 1, // 验证码登录
}

// 企业状态
export const enum CompanyStatusEnum {
  Normal = 0,  //  正常
  Stop = 1,    //  停用
}

// 收款配置类型
export const enum PaymentSettingTypeEnum {
  WxPay = 1,      // 微信企业收款
  WxPrivacy = 2,  // 微信私人收款
}
