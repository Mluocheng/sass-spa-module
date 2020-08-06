import Utils from '../../src/common/utils';
import ROUTES from '../../src/common/const/routes';

describe('开始测试工具类 Utils/index.ts:', () => {

  test('测试 将routeData与pathname匹配，返回自己和所有的夫路由数据:', () => {
    
    expect(Utils.findRoutesByPathname(ROUTES, '/')).toStrictEqual([ROUTES[0]]);

  });

  // test(' 1 + 1 = 2 :', () => {
  //   expect(1 + 1).toBe(3)
  // });

});
