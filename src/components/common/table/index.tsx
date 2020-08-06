import React from 'react';
import classNames from 'classnames';
import { Table as AntTable } from 'antd';
import { TableProps } from 'antd/lib/table';
import Pagination, { Props as PaginationProps } from '../pagination';
import Search, { Props as SearchProps } from '../search';
import css from './index.less';

type OmitKeys = 'showHeader';

export interface Props<T> extends Omit<TableProps<T>, OmitKeys> {
  height?: number;
  pagination?: PaginationProps;
  searchNull?: string;
  search?: SearchProps & {
    renderBtn?: () => React.ReactNode;
    isShow?: boolean;
  };
}

export default class Table<T> extends React.Component<Props<T>> {
  
  // 顶部搜索框
  renderSearch() {
    const { search } = this.props;
    if (!search) return null;

    const {
      renderBtn = () => null,
      isShow = true,
      ...otherSearchProps
    } = search;

    return (
      <div className={css.searchBar}>
        <div className={css.searchBtns}>{renderBtn()}</div>
        {isShow && <Search {...otherSearchProps} />}
      </div>
    );
  }

  render() {
    const {
      className,
      pagination,
      search,
      dataSource,
      searchNull,
      height,
      ...others
    } = this.props;
    
    let name;
    let img;
    switch (this.props.columns[0].title) {
      case '职位名称':
        img =
          'https://img.alicdn.com/imgextra/i3/4074958541/O1CN01mwOy5M2CxpOHWgkd8_!!4074958541.png';
        name = '当前暂无职位';
        break;
      case '门店标签':
        img =
          'https://img.alicdn.com/imgextra/i3/4074958541/O1CN01OuAcdM2CxpOGjGbIw_!!4074958541.png';
        name = '当前暂无标签';
        break;
      case '员工名称':
        img =
          'https://img.alicdn.com/imgextra/i3/4074958541/O1CN010antCW2CxpOFTdOtc_!!4074958541.png';
        name = '当前暂无员工';
        break;
      default:
        img =
          'https://img.alicdn.com/imgextra/i3/4074958541/O1CN01VZLO3v2CxpODBX4K7_!!4074958541.png';
        name = '当前暂无商品';
        break;
    }

    // 加上高度
    return (
      <div className={classNames(css.table, className)}>
        {this.renderSearch()}
        <AntTable
          {...others}
          className={css.tableHeader}
          dataSource={dataSource}
          pagination={false}
        />
        {dataSource.length > 0 && (
          <AntTable
            {...others}
            className={css.tableBody}
            dataSource={dataSource}
            showHeader={false}
            pagination={false}
          />
        )}
        {!dataSource.length && (
          <div style={{ height: height }} className={css.box}>
            <img src={img} alt="" />
          </div>
        )}
        {!!pagination && (
          <Pagination
            {...pagination}
            className={classNames(css.pag, pagination.className)}
          />
        )}
      </div>
    );
  }
}
