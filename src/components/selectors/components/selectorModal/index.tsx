import Portal from 'components/common/portal';
import Tabs from 'components/common/tabs';
import Search, { Props as SearchProps } from 'components/common/search';
import Button from 'components/common/button';
// import Tree from 'components/tree';
import UploadPanel from 'components/common/uploadPanel';
import { MaterialTypeEnum } from 'api/interface/material/enums';
import { Material } from 'api/interface/material';
import React from 'react';
import Tree from '../pickersTree/index';
import css from './index.less';

export interface TreeItem {
  id: number;
  name: string;
  children: TreeItem[];
}

export interface Props {
  visible: boolean;
  title: string;
  tree: TreeItem;
  search?: SearchProps;
  tabs?: { key: string; render: string }[];
  onTabChange?: (key: string) => void;
  onOk?: () => void;
  onCancel?: () => void;
  onSelect?: (id: number) => void;
  folderId?: number;
  getList?: (id: number) => void;
  type?: MaterialTypeEnum;
  accept?: string;
  isGoods?: boolean;
  uploadButton?: string;
  maxSize?: number;
  setSelectTabId?: number;
}

const SelectorModal: React.FC<Props> = React.memo<Props>(({
  visible, tree, title, children, tabs, onTabChange, search, onOk, onCancel, onSelect, folderId,
  getList, type, accept, uploadButton, isGoods, maxSize, setSelectTabId
}) => {

  const [selectTab, setSelectTab] = React.useState(tabs && tabs[0] ? tabs[setSelectTabId].key : '');
  const [selectId, setSelectId] = React.useState(tree ? tree.id : 0);

  React.useEffect(() => {
    if (tree) setSelectId(tree.id);
  }, [tree]);

  /**
   * 渲染左侧tab切换
   */
  function renderTabs() {
    if (!tabs || tabs.length <= 1) return null;

    const width = tabs
      .map(item => item.render.length * 14 + 24)
      .reduce((prev, next) => prev + next);

    return (
      <Tabs 
        selectedKey={selectTab} 
        width={width}
        tabs={tabs}
        onChange={key => {
          setSelectTab(key);
          onTabChange(key);
        }} 
      />
    );
  }
  return (
    <Portal isOpen={visible}>
      <div className={css.container}>
        <div className={css.left}>
          <div className={css.title}>
            <h4>{title}</h4>
          </div>
          {renderTabs()}
          {
            tree.id && <Tree 
              defaultOpenKeys={[tree.id]}
              className={css.tree} 
              folderId={folderId || selectId} 
              treeList={tree ? [tree] : []} 
              onSelect={id => {
                setSelectId(id);
                onSelect(id);
              }}
            />
          }

        </div>
        <div className={css.content}>
          <div className={css.top}>
            {
              search ? <Search {...search} /> : <div />
            }
            <div>
              {
                !isGoods && 
                <UploadPanel<{folderId: number; type: MaterialTypeEnum}, Material>
                  action={PROCESS_ENV.ENV_API + '/material/saas/material/upload'}
                  accept={accept}
                  maxSize={maxSize}
                  data={{ folderId, type: type }}
                  onSuccess={() => getList(folderId)}
                >
                  <Button style={{ color: '#286AB4', border: '1px solid #286AB4' }}>{uploadButton}</Button>
                </UploadPanel>
              }
              <Button onClick={onCancel}>取消</Button>
              <Button type="primary" onClick={onOk}>确定</Button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
});

SelectorModal.defaultProps = {
  onTabChange: () => {},
  onOk: () => {},
  onCancel: () => {},
  onSelect: () => {},
  setSelectTabId: 0,
  search: {}
};

export default SelectorModal;
