import React from 'react';
import classNames from 'classnames';
import * as pathToRegexp from 'path-to-regexp';
import { Route } from 'common/const/routes';
import { Modal, message } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import Icon from 'components/common/icon';
import { ProductCategory } from 'api/interface/product';
import { Employee } from 'api/interface/employee';
import css from './index.less';

export default class Utils {
  /**
   * 弹窗确认框
   * @param props
   */
  // static modalConfirm(props: ModalFuncProps & { onClose?: () => void }): void {
  //   let { title, onClose, ...others } = props;

  //   const modal = Modal.confirm({
  //     ...others,
  //     title: (
  //       <>
  //         {title}
  //         <Icon
  //           type="warning"
  //           className="antd-modal-comfirm-close-btn"
  //           onClick={() => {
  //             modal.destroy();

  //             if (onClose) {
  //               onClose();
  //               return;
  //             }

  //             if (others.onCancel) {
  //               others.onCancel();
  //               return;
  //             }
  //           }}
  //         />
  //       </>
  //     ),
  //     width: 360,
  //     icon: <Icon />,
  //   });
  // }

  /**
   * 将routeData与pathname匹配，
   * 返回自己和所有的夫路由数据
   *
   * @param routeList
   * @param pathname
   * @return routes
   */
  static findRoutesByPathname(routeList: Route[], pathname: string): Route[] {
    let routes = [];

    function checkSelectMenu(route: Route): boolean {
      // 匹配成功
      if (pathToRegexp(route.path).exec(pathname)) {
        routes.push(route);
        return true;
      }

      if (route.children && route.children.length) {
        let isParent = route.children
          .map(child => checkSelectMenu(child))
          .some(selected => selected);

        if (isParent) {
          routes.push(route);
        }
        return isParent;
      }
      return false;
    }

    routeList.forEach(route => {
      checkSelectMenu(route);
    });

    routes.reverse();

    return routes;
  }

  static spliceIdFromPathnameToLink(
    selectRoute: Route,
    spliceRoute: Route,
    pathname: string
  ): string {
    const selectPaths = selectRoute.path.split('/');

    // 查找ID位置
    let idIndex: number;
    selectPaths.forEach((item, index) => {
      if (item.indexOf(':') > -1) {
        idIndex = index;
        return;
      }
    });
    if (idIndex === undefined) return spliceRoute.path;

    // 拼接ID
    const pathnamePaths = pathname.split('/');
    const splicePaths = spliceRoute.path.split('/').map(item => {
      if (item.indexOf(':') > -1) {
        return pathnamePaths[idIndex];
      }
      return item;
    });

    return splicePaths.join('/');
  }

  static spliceParamsToUrl(
    url: string,
    params: { [key: string]: string }
  ): string {
    const urls = url.split('/');
    const newUrls = urls.map(item => {
      const words = item.split(':');
      return words[1] && params[words[1]] ? params[words[1]] : item;
    });

    return newUrls.join('/');
  }

  /**
   * 轻提示
   * @param type
   * @param content
   */
  static message(
    content: string,
    type: 'success' | 'error' | 'warning' = 'success'
  ) {
    const MESSAGE_ICON = {
      success: 'iconSuccessed',
      error: 'iconFailed',
      warning: 'iconWarning3'
    };
    message.open({
      type,
      duration: 3,
      content,
      icon: (
        <Icon
          type={MESSAGE_ICON[type]}
          className={classNames('anticon', css.messageIcon)}
        />
      )
    });
  }

  static trim(str: string) {
    if (str) str = str.trim();
    return str;
  }

  /**
   * 格式化时间
   * @param date
   * @param format
   */
  static formatDate(
    date: Date,
    format: string = 'yyyy-MM-dd hh:mm:ss'
  ): string {
    const dateObj = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        String(date.getFullYear()).substr(4 - RegExp.$1.length)
      );
    }
    for (let k in dateObj) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? dateObj[k]
            : ('00' + dateObj[k]).substr(String(dateObj[k]).length)
        );
      }
    }
    return format;
  }

  /**
   * 判断某个分类是否是选中状态
   * @param classify
   * @param selectClassId
   */
  static isSelected(classify: ProductCategory, selectClassId: number): boolean {
    if (classify.id === selectClassId) return true;
    if (!classify.children || !classify.children.length) return false;
    return classify.children.some(item =>
      Utils.isSelected(item, selectClassId)
    );
  }

  static debounce<P>(func: (params: P) => void, time: number = 200) {
    let timeout: NodeJS.Timeout;
    return (args: P) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(args), time);
    };
  }

  /**
   * 金额限制
   */
  static limitFloat(val: string) {
    let sNum = val;
    if (sNum.indexOf('.') == 0) {
      // 第一位就是 .
      sNum = '0' + sNum;
    }
    sNum = sNum.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
    sNum = sNum.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
    sNum = sNum
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.');
    sNum = sNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    if (sNum.indexOf('.') === -1 && sNum != '') {
      sNum = String(parseFloat(sNum));
    }
    if (sNum.indexOf('.') === 1 && sNum != '') {
      if (sNum.split('.')[1].split('')[1] === '0') {
        sNum = `${sNum.split('.')[0]}.${sNum.split('.')[1].split('')[0]}`;
      }
    }

    if (sNum !== '') {
      return sNum;
    }
  }

  /**
   * 部门id转换
   */
  static department(departmentArr: Employee[], departmentId: number) {
    let name = '';
    departmentArr.forEach(item => {
      if (item.id === departmentId) {
        name = item.name;
      }
    });
    return name;
  }
}
