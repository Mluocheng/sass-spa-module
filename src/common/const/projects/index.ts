
export const enum ProjectTypeEnum { 
  Normal, // 一般型
  NoMenu, // 无左侧导航
  Product, // 产品矩阵内省，顶部可切换
  ProductNoMenu, // 产品矩阵内省，无左侧列表
}

export default {
  type: ProjectTypeEnum.Normal,
  project: {
    selected: PROCESS_ENV.MODULE_NAME,
    list: [
      {
        key: 'main',
        path: PROCESS_ENV.ENV_PROJECT + '/main',
        icon: 'iconWorkStation',
        label: '工作台',
      },
      {
        key: 'basic',
        path: PROCESS_ENV.ENV_PROJECT + '/basic',
        icon: 'iconBasicService',
        label: '基础服务',
      },
      {
        key: 'module',
        path: PROCESS_ENV.ENV_PROJECT + '/module',
        icon: 'iconProductMatrix',
        label: '产品矩阵',
      },
      {
        key: 'customer',
        path: PROCESS_ENV.ENV_PROJECT + '/customer',
        icon: 'iconCustomerOperation',
        label: '客户管理',
      },
      // 二期开放功能 2.10不上模块
      {
        key: 'marketing',
        path: PROCESS_ENV.ENV_PROJECT + '/marketing',
        icon: 'iconCustomerOperation',
        label: '营销平台',
      },
      {
        key: 'activity',
        path: PROCESS_ENV.ENV_PROJECT + '/activity',
        icon: 'iconActivity',
        label: '活动中心',
      },
      {
        key: 'order',
        path: PROCESS_ENV.ENV_PROJECT + '/order',
        icon: 'iconOrderCenter',
        label: '订单中心',
      },
      // 二期开放功能 2.10不上模块
      {
        key: 'data',
        path: PROCESS_ENV.ENV_PROJECT + '/data',
        icon: 'iconDataCenter',
        label: '数据罗盘',
      },
    ]
  },
  product: {
    title: '当前产品',
    icon: 'iconBasicService',
    backPath: PROCESS_ENV.ENV_PROJECT + '/module',
    list: [
      {
        key: 'wxMall',
        label: '微信微商城应用',
        path: PROCESS_ENV.ENV_PROJECT + '/mall',
      },
      {
        key: 'diy',
        label: '自主DIY家装pad',
        path: PROCESS_ENV.ENV_PROJECT + '/workbench',
      },
    ],
  },
};
