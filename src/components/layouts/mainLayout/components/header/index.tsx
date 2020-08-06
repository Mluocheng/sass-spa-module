import { Layout, Dropdown, Menu, Form } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import PROJECTS, { ProjectTypeEnum } from 'common/const/projects';
import Icon from 'components/common/icon';
import warn from 'components/common/confirm/warn';
import { useLocation } from 'react-router';
import { provideStore, useConnect } from '../model/index';
import Information from '../information';
import css from './index.less';

export interface Props {
  // location: RouteComponentProps['location'];
}
const { Header: AntHeader } = Layout;

const Header: React.FC<Props> = () => {
  const [store, dispatch] = useConnect();
  const location = useLocation();
  const isMember = location.pathname.includes('/member');

  const { type, project, product } = PROJECTS;

  /**
   * 退出登录
   */
  function handleLogout() {
    warn({
      title: '操作提醒',
      content: '确定要退出后台吗？',
      onOk: async () => {
        // await logout();
        // localStorage.removeItem('token');
        // window.location.href = `${PROCESS_ENV.ENV_PROJECT}/login`;
      }
    });
  }

  // 右侧按钮列表
  function renderMenu() {
    const overlay = (
      <div className={css.overlayContainer}>
        <Menu>
          {/* <Menu.Item className={css.menuItem}>
            <Icon />
            <span>升级</span>
          </Menu.Item> */}
          <Menu.Item
            onClick={() => {
              dispatch({
                type: 'update',
                payload: {
                  visible: true,
                  UpdateInfo: true
                }
              });
              dispatch({
                type: 'getInfo'
              });
            }}
            className={css.menuItem}
          >
            <Icon />
            <span>账号设置</span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              window.location.href = `${PROCESS_ENV.ENV_PROJECT}/login/updatePwd`;
            }}
            className={css.menuItem}
          >
            <Icon />
            <span>修改密码</span>
          </Menu.Item>
          <Menu.Item className={css.menuItem} onClick={handleLogout}>
            <Icon />
            <span>退出登录</span>
          </Menu.Item>
        </Menu>
      </div>
    );
    return (
      <Dropdown overlay={overlay}>
        <div className={css.menu}>
          {/* <img className={css.headPortrait} src={store.company.logo} /> */}
          <div className={css.iconArr}>
            <Icon type="iconDropDown" />
            {/* <Icon type="iconDown" /> */}
          </div>
        </div>
      </Dropdown>
    );
  }

  // 产品矩阵类型头部
  if (
    type === ProjectTypeEnum.Product ||
    type === ProjectTypeEnum.ProductNoMenu
  ) {
    const overlay = (
      <div className={css.overlayContainer}>
        <Menu>
          {product.list
            .filter(item => item.key !== PROCESS_ENV.MODULE_NAME)
            .map(item => {
              return (
                <Menu.Item key={item.key} className={css.menuItem}>
                  <a href={item.path}>
                    <span>{item.label}</span>
                  </a>
                </Menu.Item>
              );
            })}
        </Menu>
      </div>
    );

    return (
      <AntHeader className={css.header}>
        <div className={css.headerBox}>
          <a href={product.backPath} className={css.back}>
            <p
              style={{
                backgroundColor: 'white',
                color: 'white',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                lineHeight: '20px'
              }}
            >
              <Icon className={css.icon} type="iconBack" />
            </p>
          </a>
          <a href={project.list[0].path} className={css.logo}>
            <img
              src="https://img.alicdn.com/imgextra/i1/4074958541/O1CN01yQosFB2CxpOE9k0uX_!!4074958541.png"
              alt=""
            />
          </a>
          <Dropdown overlay={overlay}>
            <div className={css.modules}>
              <Icon type={product.icon} className={css.modIcon} />
              <span>
                {product.title}：{isMember ? '入会礼包' : '新客礼包'}
              </span>
              <Icon type="iconDown" className={css.lastIcon} />
            </div>
          </Dropdown>
        </div>
        {/* <div className={css.noticeBox}>
          <div>
            <p className={css.notice}>5</p>
            <Icon className={css.message} type="iconMassage" />
          </div>
        </div> */}
        {renderMenu()}
        {/* <Infor /> */}
        <Information />
      </AntHeader>
    );
  }

  return (
    <AntHeader className={css.header}>
      <div className={css.headerBox}>
        <a href={project.list[0].path} className={css.logo}>
          <img
            src="https://img.alicdn.com/imgextra/i1/4074958541/O1CN01yQosFB2CxpOE9k0uX_!!4074958541.png"
            alt=""
          />
        </a>
        <ul className={css.projects}>
          {project.list.map(item => {
            const selected = item.key === project.selected;
            return (
              <li
                key={item.key}
                className={classNames({ [css.selected]: selected })}
              >
                <a href={selected ? undefined : item.path}>
                  <Icon type={item.icon} />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* <div className={css.noticeBox}>
        <div>
          <p className={css.notice}>5</p>
          <Icon onClick={() => {
            dispatch({
              type: 'update',
              payload: {
                infoVisible: true
              }
            });
          }} className={css.message} type="iconMassage"
          />
        </div>
      </div> */}
      {renderMenu()}
      {/* <Infor /> */}
      <Information />
    </AntHeader>
  );
};

Header.defaultProps = {};

export default provideStore(Header);
