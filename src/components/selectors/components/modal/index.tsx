import React, { Fragment } from 'react';
import Icon from 'components/common/icon';
import Button from 'components/common/button';
import Portal from 'components/common/portal';
import css from './index.less';

export interface Props {
  visible?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  title?: string;
  text?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  placement?: 'center'|'left'| 'right';
  // style?: object;
}

const Modal: React.FC<Props> = React.memo<Props>((props) => {

  const { 
    footer, header, onOk, onCancel, title, placement, text, children,
    visible,
  } = props;
 
  /**
   * 底部按钮
   */
  function renderBottom() {

    return (
      <Fragment>
        <Button onClick={() => onCancel()}>取消</Button>
        <Button type="primary" onClick={() => onOk()}>确定</Button>
      </Fragment>
    );
  }

  /**
   * 标题部分
   */
  function renderHeader() {

    return (
      <Fragment>
        <span className={css.title}>{title}</span>
        <span>{text}</span>
        <div className={css.iconBox} onClick={() => onCancel()} >
          <Icon type="iconCancel" />
        </div>
      </Fragment>
    );
  }

  return (
    <Portal isOpen={visible}>
      <div className={css.masker}>
        <div className={css.modalBox}>
          <div className={css.titleBox} style={{ textAlign: placement }}>
            {header!==null ? renderHeader() : header}
          </div>
          <div className={css.contentBox}>
            {children}
          </div>
          <div className={css.bottom}>
            {footer!==null ? renderBottom() : footer}
          </div>
        </div>
      </div>
    </Portal>
  );
});

Modal.defaultProps = {
  onCancel: () => {},
  onOk: () => {},
  header: true,
  footer: true,
  placement: 'left',
  title: '默认标题',
  text: '',
  visible: false,
  // style: {}
};

export default Modal;
