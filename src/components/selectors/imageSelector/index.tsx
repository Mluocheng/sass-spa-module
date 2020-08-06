import Pagination from 'components/common/pagination';
import Icon from 'components/common/icon';
import { MaterialTypeEnum } from 'api/interface/material/enums';
import { useConnect as globalModel } from 'model';
import React from 'react';
import classNames from 'classnames';
import SelectorModal from '../components/selectorModal';
import { provideStore, useConnect, Props } from './model';
import css from './index.less';

const ImageSelector: React.FC<Props> = React.memo<Props>(({
  visible, onCancel, onOk, length
}) => {

  const [state, dispatch] = useConnect();
  const [{ picFolderId }, globalDispatch] = globalModel();
  // 设置main最小高度，使其充满屏幕
  const minHeight = document.documentElement.clientHeight - 103;
  // console.log('ImageSelector', minHeight);
  React.useEffect(() => {
    if (visible) dispatch({ type: 'getFolderList', payload: { isSystem: false, id: picFolderId }});
  }, [visible]);

  /**
   * 确定选择
   */
  function handleOk() {
    onOk(state.selected);
    dispatch({ type: 'update', payload: { selected: [] }});
  }

  /**
   * 取消选择
   */
  function handleCancel() {
    dispatch({ type: 'update', payload: { selected: [] }});
    onCancel();
  }

  return (
    <SelectorModal
      title="图片选择器"
      visible={visible} 
      tree={state.folders}
      folderId={picFolderId || state.folderId}
      onOk={handleOk}
      accept={'image/*'}
      uploadButton="上传图片"
      onCancel={handleCancel}
      type={MaterialTypeEnum.Image}
      getList={(id) => {
        dispatch({ type: 'getImageList', payload: { folderId: picFolderId || id, keywords: '', page: state.page }});
      }}
      onSelect={id => {
        globalDispatch({ type: 'updatePicId', payload: { picFolderId: id }});
        dispatch({ type: 'getImageList', payload: { folderId: id, keywords: '', page: 1 }});
      }}
      search={{
        keywords: state.keywords,
        onSearch: keywords => dispatch({ type: 'getImageList', payload: { keywords: keywords.trim() }})
      }}
    >
      <div style={{ height: minHeight-25 }} className={css.container}>
        <div className={css.content} >
          {
            !state.records.length &&
            <div style={{ height: document.documentElement.clientHeight - 200, width: '100%' }} className={css.nullImgBox}>
              <img src="https://img.alicdn.com/imgextra/i4/4074958541/O1CN01nSYiT92CxpO6dzc0R_!!4074958541.png" alt="" />
            </div>
          }
          {
            state.records.map(item => {
              return (
                <div className={css.item} key={item.id}>
                  <div 
                    className={css.imgBox}
                    onClick={() => dispatch({ type: 'selectImage', payload: { id: item.id, length }})}
                  >
                    <img src={item.url} alt="" />
                    <div className={css.cover} />
                    <div className={classNames(
                      css.iconBox,
                      { [css.showIconBox]: state.selected.some(itemId => itemId.id === item.id) })}
                    />
                    <Icon type="iconChoosed" 
                      className={classNames(
                        css.select, 
                        { [css.showSelect]: state.selected.some(itemId => itemId.id === item.id) }
                      )
                      }
                    />
                    {/* <Icon type="iconSuccessed" className={css.selectIcon} /> */}
                  </div>
                  <p>{item.name}</p>
                </div>
              );
            })
          }
        </div>
      </div>
      {
        state.records.length ?
          <Pagination 
            className={css.pag} 
            total={state.total}
            pageSize={state.size}
            current={state.page}
            onChange={page => dispatch({ type: 'getImageList', payload: { page }})}
          /> :''
      }
    </SelectorModal>
  );
});

ImageSelector.defaultProps = {
  visible: false,
  length: 1,
  onCancel: () => {},
  onOk: () => {},
};

export default provideStore(ImageSelector);


