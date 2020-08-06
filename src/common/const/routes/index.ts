import { RoleEnum } from 'api/interface/employee/enums';
import lazyComponent from 'components/hoc/index';

export interface Route {
  path: string;
  label: string;
  roles: RoleEnum[];
  icon?: string;
  component?: React.ComponentType;
  children?: Route[];
  hidden?: boolean;
}

const routes: Route[] = [
  {
    path: '/basic/product',
    label: '商品中心',
    icon: 'iconGoodsCenter',
    roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
    children: [
      {
        path: '/basic/product/saleList',
        label: '在售商品',
        component: lazyComponent(() => import('pages/product/list')),
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
      },
      {
        path: '/basic/product/unSaleList',
        label: '商品仓库',
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
        component: lazyComponent(() => import('pages/product/list')),
      },
      {
        path: '/basic/product/category',
        label: '商品分类',
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
        component: lazyComponent(() => import('pages/product/category'))
      }
    ]
  },
  {
    path: '/basic/material',
    label: '素材中心',
    icon: 'iconMaterial',
    roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
    children: [
      {
        path: '/basic/material/picture',
        label: '图片管理',
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
        component: lazyComponent(() => import('pages/material/picture'))
      },
      {
        path: '/basic/material/video',
        label: '视频管理',
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
        component: lazyComponent(() => import('pages/material/video'))
      }
    ]
  },
  {
    path: '/basic/framework',
    label: '架构管理',
    roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
    icon: 'iconArchitectureManagement',
    children: [
      {
        path: '/basic/framework/job',
        label: '职位管理',
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
        component: lazyComponent(() => import('pages/framework/job'))
      },
      {
        path: '/basic/framework/employee',
        label: '员工管理',
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
        component: lazyComponent(() => import('pages/framework/employee')),
        children: [
          {
            path: '/basic/framework/employee/insert',
            label: '新增员工',
            roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
            component: lazyComponent(() =>
              import('pages/framework/employeeInsert')
            )
          },
          {
            path: '/basic/framework/employee/insert/:employeeId',
            label: '编辑员工',
            roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
            component: lazyComponent(() =>
              import('pages/framework/employeeInsert')
            )
          }
        ]
      },
      {
        path: '/basic/framework/role',
        label: '角色管理',
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
        component: lazyComponent(() => import('pages/framework/role'))
      }
    ]
  },
  {
    path: '/basic/store',
    label: '门店管理',
    icon: 'iconStoreManagement',
    roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
    children: [
      {
        path: '/basic/store/list',
        label: '门店列表',
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
        component: lazyComponent(() => import('pages/store/list')),
      },
      {
        path: '/basic/store/tag',
        label: '门店标签',
        roles: [RoleEnum.SuperAdmin, RoleEnum.Admin],
        component: lazyComponent(() => import('pages/store/tag'))
      }
    ]
  },
];

export default routes;
