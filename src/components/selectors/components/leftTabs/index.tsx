import React from 'react';
import classNames from 'classnames';
import css from './index.less';

interface LeftItem {
  id: string|number;
  name: string;
}

export interface Props {
  list?: LeftItem[];
  selected?: string | number;
  onClickTab: (id: string | number) => void;
}

const LeftTabs: React.FC<Props> = React.memo(({ list, onClickTab, selected }) => {

  let selectIndex = 0;

  list.find((item, index) => {
    if (item.id === selected) selectIndex = index;
    return item.id === selected;
  });

  return (
    <div className={css.box}>
      {
        list.map((item, index) => {
          return (
            <div 
              key={`tab_${index}`}
              className={classNames(css.row, { [css.select]: item.id === selected })}
              onClick={() => onClickTab(item.id)}
            >
              {item.name}
            </div>
          );
        })
      }
      <div className={css.line} style={{ top: selectIndex * 38 + 10 }} />
    </div>
  );
});

LeftTabs.defaultProps = {
  list: [],
  selected: '',
};

export default LeftTabs;
