import React from 'react';
import { Drawer as AntdDrawer } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import Icon from 'components/common/icon';
import Portal from 'components/common/portal';
import css from './index.less';

export interface Props extends DrawerProps {
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  showIcon?: boolean;
  right?: number;
  
}

const Drawer: React.FC<Props> = React.memo<Props>(
  ({ title, width, onClose, visible, children, showIcon, right, ...others }) => {
    return (
      <Portal isOpen={visible}>
        <AntdDrawer
          {...others}
          closable={false}
          visible={visible}
          width={width}
          destroyOnClose={true}
          bodyStyle={{ padding: 0 }}
          onClose={() => onClose()}
          getContainer={false}
        >
          <div className={css.content} style={{ width }}>
            <div className={css.titleBox}>
              <div className={css.line} />
              <span className={css.title}>{title}</span>
            </div>
            {children}
            {
              showIcon && <div
                className={css.close}
                style={{ right: right }}
                onClick={() => onClose()}
              >           
                <Icon type="iconPoint" className={css.icon} />
                <span className={css.retract}>收起</span>  
              </div>
            }

          </div>
        </AntdDrawer>
      </Portal>
    );
  }
);

Drawer.defaultProps = {
  title: '',
  width: 840,
  right: 842,
  onClose: () => {},
  showIcon: true
};

export default Drawer;
