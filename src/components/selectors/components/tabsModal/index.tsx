import React from 'react';
import Portal from 'components/common/portal';
import Tabs from 'components/common/tabs';
import Button from 'components/common/button';
import css from './index.less';

export interface Props {
  title: string;
  visible: boolean;
  tabs?: { key: string; render: string }[];
  onTabChange?: (key: string) => void;
  onOk?: (value?: string) => void;
  onCancel?: () => void;
  value?: string;
}

const TabsModal: React.FC<Props> = React.memo<Props>(({
  visible, title, children, value, tabs, onTabChange, onCancel, onOk
}) => {
  const [selectTab, setSelectTab] = React.useState(tabs && tabs[0] ? tabs[0].key : '');

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
        <div className={css.title}>
          <h4>{title}</h4>
        </div>
        {renderTabs()}
        <div className={css.content}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={() => onOk(value)}>确定</Button>
        </div>
        {children}
      </div>
    </Portal>
  );
});

TabsModal.defaultProps = {};

export default TabsModal;
