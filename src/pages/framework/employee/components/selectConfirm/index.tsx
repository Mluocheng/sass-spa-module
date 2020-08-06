import React from 'react';
import Select, { Props as SelectProps } from 'components/common/select';
import modal, { Props as ModalProps } from 'components/common/confirm/components/modal';
import css from './index.less';

type OmitKeys = 'style' | 'onChange';

export interface Props
  extends Omit<ModalProps, 'onOk'>,
    Omit<SelectProps, OmitKeys> {
  title?: string;
  name?: string;
  defaultValue?: number;
  options?: {id: number; name: string}[];
  onChange?: (val: number) => void;
  onOk?: (val: number) => void;
}

const SelectComponent: React.FC<Props> = React.memo<Props>(
  ({ title, name, defaultValue, onChange, options, ...others }) => {
    const [value, setValue] = React.useState(defaultValue);

    function getInpValue(val: number) {
      setValue(val);
      onChange(val);
    }

    return (
      <div className={css.inpWrap}>
        <div className={css.inputTitle}>{title}</div>
        <div className={css.inpBox}>
          <span className={css.inpName}>{name}</span>
          <Select
            {...others}
            width={460}
            value={value}
            onChange={e => getInpValue(e as number)}
          >
            {
              options.map(item => {
                return (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                );
              })
            }  
          </Select>
        </div>
      </div>
    );
  }
);

export default function selectConfirm({
  title,
  onChange = () => {},
  name,
  defaultValue,
  onOk,
  onCancel,
  options = [],
  ...others
}: Props) {
  let value: number; // 闭包存值，关闭时销毁
  const modalHandlers = modal({
    content: (
      <SelectComponent
        title={title}
        name={name}
        defaultValue={defaultValue}
        options={options}
        onChange={id => {
          value = id;
          onChange(id);
        }}
      />
    ),
    props: {
      ...others,
      onCancel() {
        onCancel && onCancel();
        value = null;
      },
      onOk() {
        onOk && onOk(value);
        value = null;
      }
    }
  });

  return modalHandlers;
}
