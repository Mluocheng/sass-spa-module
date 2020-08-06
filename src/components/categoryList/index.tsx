
import Content, { Props as ContentProps } from 'components/common/content';
import Icon from 'components/common/icon';
import classNames from 'classnames';
import React from 'react';
import css from './index.less';

export interface Props extends ContentProps {
  list: {id: number; name: string}[];
  selected: number;
  height?: number;
  onClick?: (id: number) => void;
  renderBtn?: (id: number) => React.ReactNode;
}

const CategoryList: React.FC<Props> = React.memo<Props>(({
  list, selected, onClick, renderBtn, className, height, ...others
}) => {
  const ulRef = React.useRef<HTMLUListElement>(); 
  
  return (
    <Content {...others} className={classNames(css.container, className)}>
      <ul 
        style={{ height: height-51 }}
        className={classNames(css.list)}>
        {
          list.map(item => {
            return (
              <li 
                key={item.id} 
                onClick={() => onClick(item.id)} 
                className={classNames({ [css.selected]: selected === item.id })}
              >
                <span>{item.name}</span>
                <div className={css.btnBox}>
                  {renderBtn(item.id)}
                </div>
                <Icon type="iconPoint2" className={css.icon} />
              </li>
            );
          })
        }
      </ul>
    </Content>
  );
});

CategoryList.defaultProps = {
  onClick: () => {},
  renderBtn: () => null,
};

export default CategoryList;

