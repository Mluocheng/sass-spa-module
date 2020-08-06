import Pagination from 'components/common/pagination';
import Icon from 'components/common/icon';
import { MaterialTypeEnum } from 'api/interface/material/enums';
import { useConnect as globalModel } from 'model';
import classNames from 'classnames';
import React from 'react';
import SelectorModal from '../components/selectorModal';
import { provideStore, useConnect, Props } from './model';
import css from './index.less';

const tabs = [
  { key: 'mine', render: '我的视频' },
  { key: 'system', render: '系统视频' },
];

const VideoSelector: React.FC<Props> = React.memo<Props>(({
  visible, onCancel, onOk, length
}) => {

  const [state, dispatch] = useConnect();
  const [{ videoFolderId, isSystem }, globalDispatch] = globalModel();

  React.useEffect(() => {
    dispatch({ type: 'getFolderList', payload: { folderId: videoFolderId, isSystem }});
  }, []);
  
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
      title="视频选择器"
      visible={visible} 
      tree={state.folders}
      folderId={videoFolderId || state.folderId}
      onOk={handleOk}
      onCancel={handleCancel}
      setSelectTabId={isSystem ? 1 : 0}
      accept={'video/*'}
      maxSize={10 * (1024 ** 2)}
      uploadButton="上传视频"
      type={MaterialTypeEnum.Video}
      getList={(id) => {
        dispatch({ type: 'getVideoList', payload: { folderId: videoFolderId || id, keywords: '', page: state.page }});
      }}
      onTabChange={key => {
        globalDispatch({ type: 'updateVideoId', payload: { isSystem: key === 'system' }});
        dispatch({ type: 'getFolderList', payload: { isSystem: key === 'system' }});
      }}
      onSelect={id => {
        globalDispatch({ type: 'updateVideoId', payload: { videoFolderId: id, isSystem }});
        dispatch({ type: 'getVideoList', payload: { folderId: id }});
      }}
      tabs={tabs}
      search={{
        keywords: state.keywords,
        onSearch: keywords => dispatch({ type: 'getVideoList', payload: { keywords: keywords.trim() }})
      }}
    >
      <div className={css.container}>
        <div className={css.content}>
          {
            !state.records.length &&
            <div style={{ height: document.documentElement.clientHeight - 200, width: '100%' }} className={css.nullImgBox}>
              <img src="https://img.alicdn.com/imgextra/i4/4074958541/O1CN01nSYiT92CxpO6dzc0R_!!4074958541.png" alt="" />
            </div>
          }
          {
            state.records.map(item => {
              const selected = state.selected.some(select => item.id === select.id);
              return (
                <div className={css.item} key={item.id}>
                  <div 
                    className={classNames(css.videoBox, { [css.selected]: selected })}
                    onClick={() => dispatch({ type: 'selectVideo', payload: { id: item.id, length }})}
                  >
                    <video src={item.url} />
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
                  </div>
                  <p>{item.name}</p>
                </div>
              );
            })
          }
        </div>
      </div>
      <Pagination 
        className={css.pag} 
        total={state.total}
        pageSize={state.size}
        current={state.page}
        onChange={page => dispatch({ type: 'getVideoList', payload: { page }})}
      />
    </SelectorModal>
  );
});

VideoSelector.defaultProps = {
  visible: false,
  length: 1,
  onCancel: () => {},
  onOk: () => {},
};

export default provideStore(VideoSelector);
