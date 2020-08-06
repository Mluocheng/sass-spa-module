// import { Icon } from 'antd';
import Icon from 'components/common/icon';
import { Product } from 'api/interface/product';
import css from './index.less';
import classNames from 'classnames';
import React from 'react';

export interface Props {
  selectGoods?: Product[];
  content?: Product[];
  onSelectGood?: (id: number) => void;
}

const GoodsList: React.FC<Props> = ({ content, onSelectGood, selectGoods }) => {
  
  return (
    <div className={css.container}>
      {
        !content.length &&
            <h6>该文件夹暂无商品</h6>
      }
      {
        content.map(goods => {
          return (
            <div
              className={css.item}
              key={goods.id}
              onClick={() => onSelectGood(goods.id)}
            >
              <div className={css.imgBox}>
                <img src={goods.images.split(',')[0]} alt="" />
                <div className={css.cover} />
                <div className={classNames(
                  css.iconBox,
                  { [css.showIconBox]: selectGoods.some(item => item.id === goods.id) })}
                />
                <Icon type="iconChoosed" 
                  className={classNames(
                    css.select, 
                    { [css.showSelect]: selectGoods.some(item => item.id === goods.id) }
                  )
                  }
                />
              </div>
              <p>{goods.name}</p>
            </div>
          );
        })
      }
    </div>
  );
};

GoodsList.defaultProps = {
  selectGoods: [],
  content: [],
  onSelectGood: () => { }
};

export default GoodsList;
