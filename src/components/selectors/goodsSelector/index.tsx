import { ProductStatusEnum } from 'api/interface/product/enums';
import Pagination from 'components/common/pagination';
import Search, { Props as SearchProps } from 'components/common/search';
import React from 'react';
import Utils from 'common/utils';
import GoodsList, { Props as GoodsListProps } from '../components/goodsList';
import SelectorModal from '../components/selectorModal';
import { provideStore, useConnect, Props } from './model';
import css from './index.less';

const GoodsSelector: React.FC<Props> = React.memo<Props>(({
  visible, onCancel, onOk, multiple, maxLength, selectedList
}) => {

  const [state, dispatch] = useConnect();
  const { records, categories, selectGoods, keywords } = state;
  let listId = selectedList.map(item => item.id);
  // const [keywords, setKeywords] = React.useState('');
  // 设置main最小高度，使其充满屏幕
  const minHeight = document.documentElement.clientHeight - 103;

  React.useEffect(() => {
    if (visible) {
      dispatch({
        type: 'init',
        payload: { multiple, maxLength }
      });
    }
  }, [visible]);

  function handleOk() {
    onOk(selectGoods);
    dispatch({
      type: 'update',
      payload: {
        selectGoods: []
      }
    });
    onCancel();
  }

  function handleCancel() {
    onCancel();
    dispatch({
      type: 'update',
      payload: { selectGoods: [] }
    });
  }

  const goodsListProps: GoodsListProps = {
    content: records,
    selectGoods,
    onSelectGood: (goodsId) => {
      if (listId.includes(goodsId)) {
        Utils.message('当前分类已存在此商品', 'warning');
        return;
      }
      dispatch({
        type: 'selectGoods',
        payload: { goodsId }
      });
    }
  };

  return (
    <SelectorModal
      isGoods
      title="商品选择器"
      visible={visible}
      tree={categories[0]}
      onOk={handleOk}
      onCancel={handleCancel}
      // uploadShow={false}
      search={{
        keywords: keywords,
        onSearch: (keywords) => {
          dispatch({
            type: 'getGoodsList',
            payload: { keywords: keywords.trim() }
          });
        } 
      }}
      onSelect={id => {
        dispatch({
          type: 'getGoodsList',
          payload: { categoryId: id }
        }); 
      }}
      onTabChange={(key: string) => dispatch({
        type: 'getGoodsList', 
        payload: { status: key == '0' ? ProductStatusEnum.Normal : ProductStatusEnum.UnShelf }
      })}
      tabs={[
        { key: '0', render: '在售商品' },
        { key: '1', render: '仓库商品' },
      ]}
    >
      <div style={{ height: minHeight-25 }} className={css.container}>
        <GoodsList {...goodsListProps} />
      </div>
      {
        records.length && <Pagination 
          className={css.pag} 
          total={state.total}
          pageSize={state.size}
          current={state.page}
          onChange={page => dispatch({ type: 'getGoodsList', payload: { page }})}
        />
      }
    </SelectorModal>
  );
});

GoodsSelector.defaultProps = {
  maxLength: Infinity,
  multiple: false,
  visible: false,
  onCancel: () => { },
  onOk: () => { },
};

export default provideStore(GoodsSelector);
