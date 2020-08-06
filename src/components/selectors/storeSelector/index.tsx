import { Store } from 'api/interface/store';
import Table, { Props as TableProps } from 'components/common/table';
import TabsModal from '../components/tabsModal/index';
import { provideStore, useConnect, Props } from './model';
import css from './index.less';
import React from 'react';


const tabs = [
  {
    key: '1',
    render: '未投放门店'
  },
  {
    key: '2',
    render: '已投放门店'
  }
];


const StoreSelector: React.FC<Props> = React.memo<Props>(props => {

  const [key, setKey] = React.useState('1');
  const [state, dispatch] = useConnect();
  const { list, selectList, selectIds } = state;
  
  React.useEffect(() => {
    dispatch({ type: 'getStoreList', payload: key });
  }, []);

  function handleTab(id) {
    setKey(id);
    dispatch({ type: 'getStoreList', payload: id });
  }
  /**
 * 选中门店
 * @param id 
 */
  function handleAdd(row) {
    // dispatch({ 
    //   type: 'update',
    //   payload: 
    //   { 
    //     selectList: [row, ...selectList], 
    //     selectIds: [row.ids, ...selectIds]
    //   }
    // });
  }

  function renderTable() {

    const tableProps: TableProps<Store> = {
      dataSource: list,
      rowKey: row => String(row.id),
      search: { isShow: false },
      columns: [
        {
          key: 'name',
          title: '门店名称',
          render: (row) => {
            return (
              <div>
                <span>{row.name}</span>
                {
                  row.contact && 
                  key==='1' &&
                   <span 
                     className={css.tip}
                   >
                   该门店已投放其它支付方案，关联新的支付方案会覆盖掉原有方案
                   </span>
                }
              </div>
            );
          }
        },
        {
          key: 'opera',
          title: '操作',
          width: '10%',
          render: (row) => {
            return (
              <a 
                className={css.addBtn}
                onClick={() => handleAdd(row)}>
                {key==='1'? 
                  row.contact ? '替换' : '添加'
                  : '移除'}
              </a>
            );
          }
        },
      ]
    };
    return (
      <Table {...tableProps} />
    );
  }

  return (
    <TabsModal {...props}
      title="门店选择器"
      value={selectIds.join()}
      tabs={tabs}
      onTabChange={handleTab}
    >
      <div className={css.tableBox}>
        {renderTable()}
      </div>
    </TabsModal>
  );
});

StoreSelector.defaultProps = {};

export default provideStore(StoreSelector);
