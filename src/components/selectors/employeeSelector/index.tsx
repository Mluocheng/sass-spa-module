import React from 'react';
import { Employee, Department } from 'api/interface/employee';
import { getEmployeeList, getDepartments } from 'api/queries/employee';
import { RoleEnum } from 'api/interface/employee/enums';
import Search from 'components/common/search';
import Icon from 'components/common/icon';
import Pagination from 'components/common/pagination';
import Utils from 'common/utils';
import { ROLE_LABEL } from 'common/const/config';
import warn from 'components/common/confirm/warn';
import Table, { Props as TableProps } from 'components/common/table/index';
import Modal, { Props as ModalProps } from '../components/modal';
import LeftTabs from '../components/leftTabs';
import { provideStore, useConnect } from './model';
import css from './index.less';

type OmitKeys = 'title' | 'value' | 'onOk';
export interface Props extends Omit<ModalProps, OmitKeys> {
  isSearch?: boolean;
  limitRole?: RoleEnum; // 限制的角色
  onOk?: (list: Employee[]) => void;
}

const PageSelector: React.FC<Props> = React.memo<Props>(
  ({ isSearch, onOk, onCancel, limitRole, ...others }) => {
    const [state, dispatch] = useConnect();
    const { categories, keywords, page, size, total, employees } = state;
    const [departmentId, setDepartmentId] = React.useState(null);
    const [selected, setSelected] = React.useState<Employee[]>([]);
    const list = employees.filter(item => item.name.includes(keywords));
    const [ids, setIds] = React.useState('');

    const tabProps: TableProps<Employee> = {
      dataSource: employees,
      rowKey: row => String(row.id),
      // search: {
      //   keywords,
      //   onSearch: (key) => getQueryGoods({ page: 1, keywords: key.trim(), size, search: '当前无搜索结果' }),
      //   renderBtn
      // },
      rowSelection: {
        columnWidth: 23,
        selectedRowKeys: ids.split(','),
        onChange: (keys: string[], selectedRows: Employee[]) => {
          setSelected(selectedRows);
          setIds(keys.filter(item => !!item).join());
        }
      },
      columns: [
        {
          key: 'name',
          title: '员工名称',
          width: '30%',
          render: (employee: Employee) => employee.name && employee.name
        },
        {
          key: 'job',
          title: '职位',
          dataIndex: 'job',
          width: '55%',
          render: (job: Employee['job']) => job && job.name
        },
        {
          key: 'role',
          title: '角色',
          dataIndex: 'job',
          width: '15%',
          render: (job: Employee['job']) => job && ROLE_LABEL[job.role]
        }
      ]
    };
    React.useEffect(() => {
      if (others.visible) {
        dispatch({
          type: 'getFolderList'
        });
        dispatch({
          type: 'update',
          payload: {
            limitRole: limitRole
          }
        });
      }
    }, [others.visible]);

    /**
     * 选中员工
     * @param employee
     */
    function handleSelect(employee: Employee) {
      if (selected.some(item => item.id === employee.id)) {
        setSelected(selected.filter(item => item.id !== employee.id));
      } else {
        setSelected([...selected, employee]);
      }
    }

    // 取消
    function handleCancel() {
      setDepartmentId(1);
      onCancel();
      setSelected([]);
      setIds('');
    }

    // 确认
    function handleOk() {
      if (selected.some(item => item.storeId !== null && item.storeId !== 0)) {
        let arr = selected.filter(
          item => item.storeId !== null || item.storeId !== 0
        );
        warn({
          title: '关联员工',
          content: (
            <div>
              {arr.map((itemArr, index) => {
                return (
                  <p style={{ lineHeight: '20px' }} key={index}>
                    {`${itemArr.name}已关联门店，请谨慎操作!`}
                  </p>
                );
              })}
            </div>
          ),
          onOk: async () => {
            onOk(selected);
            setIds('');
            setSelected([]);
            setDepartmentId(null);
          }
        });
        return;
      }
      onOk(selected);
      setIds('');
      setSelected([]);
      setDepartmentId(null);
    }

    return (
      <Modal
        {...others}
        title="员工选择器"
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <div className={css.content}>
          <div className={css.left}>
            <LeftTabs
              selected={departmentId}
              list={categories.map(item => ({ id: item.id, name: item.name }))}
              onClickTab={id => {
                dispatch({
                  type: 'getDepartmentsList',
                  payload: {
                    categoryId: id
                  }
                });
                setDepartmentId(id);
              }}
            />
          </div>
          <div className={css.right}>
            {isSearch && (
              <div className={css.search}>
                <Search
                  showReset={true}
                  keywords={keywords}
                  onSearch={value => {
                    dispatch({
                      type: 'getDepartmentsList',
                      payload: { keywords: value.trim() }
                    });
                    setDepartmentId(1);
                  }}
                />
              </div>
            )}
            <Table className={css.employeesTable} {...tabProps} />
            {/* <ul className={css.list}>
            {
              list.filter(item => filterList.every(n => item.id !== n.id && item.job.role !== limitRole)).map(employee => {
                const isSelect = selected.some(item => item.id === employee.id);
                return (
                  <li key={employee.id}
                    className={classNames({ [css.select]: isSelect })}
                    onClick={() => handleSelect(employee)}
                  >
                    <span>{employee.name}</span>
                    {isSelect && <Icon type="iconChoosed" />}
                  </li>
                );
              })
            }
          </ul> */}
            {employees.length ? (
              <Pagination
                className={css.pag}
                total={total}
                pageSize={size}
                current={page}
                onChange={onPage =>
                  dispatch({
                    type: 'getDepartmentsList',
                    payload: { page: onPage }
                  })
                }
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </Modal>
    );
  }
);

PageSelector.defaultProps = {
  isSearch: true,
  onOk: () => {},
  // filterList: []
};

export default provideStore(PageSelector);
