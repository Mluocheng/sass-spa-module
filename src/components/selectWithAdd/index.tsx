import React, { useState } from 'react';
import Select, { Props as SelectProps } from 'components/common/select';
import Icon from 'components/common/icon';
import css from './index.less';

const { Option } = Select;

export interface Props extends SelectProps {
  options: { value: number; label: string }[];
  onAdd?: () => void;
  addText?: string;

}

const SelectWithAdd: React.FC<Props> = ({ options, onAdd, addText, ...others }) => {
  const [open, setOpen] = useState(false);
  return (
    <Select
      {...others} autoMenuClose
      // suffixIcon={<Icon type={open ? 'iconClosed':'iconOpen'} />}
      // onDropdownVisibleChange={(selectOpen) => {
      //   setOpen(selectOpen);
      // }}
      dropdownRender={menuNode => (
        <div>
          <a className={css.new} onMouseDown={onAdd}>
            <Icon type="iconAddSort" />
            <span>{addText}</span>
          </a>
          {menuNode}
        </div>
      )}
    >
      {
        options.map(opt => {
          return <Option key={opt.label} value={opt.value}>{opt.label}</Option>;
        })
      }
    </Select>
  );
};

SelectWithAdd.defaultProps = {
  onAdd: () => { },
  addText: 'Add item',
};

export default SelectWithAdd;
