import React from 'react';
import classNames from 'classnames';
import { Form, Tooltip } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import Icon from 'components/common/icon';
import css from './index.less';

export interface Props extends FormItemProps {
  label?: string;
  notice?: string;
  hasMargin?: boolean;
}

const FormItem: React.FC<Props> = React.memo<Props>(({ 
  children, label, notice, hasMargin, ...props 
}) => {

  function renderLabel() {
    if (!label) return null;
    return (
      <span className={css.label}>
        {label}
        {
          !!notice &&
          <Tooltip placement="top" title={notice}>
            <Icon type="iconComment" />
          </Tooltip>
        }
      </span>
    );
  }

  return (
    <Form.Item 
      {...props} 
      label={renderLabel()}
      className={classNames(css.formItem, { [css.noMargin]: !hasMargin })} 
    >
      {children}
    </Form.Item>
  );
});

FormItem.defaultProps = {
  hasMargin: true,
};

export default FormItem;
