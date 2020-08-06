import Icon from 'components/common/icon';
import warn from 'components/common/confirm/warn';
import Portal from 'components/common/portal';
import classnames from 'classnames';
import React from 'react';
import css from './index.less';

export interface ITreeProps {
  showFolder?: boolean;
  treeList?: TreeData[];
  defaultOpenKeys?: number[];
  folderId: number;
  className?: string;
  isOnContextMenu?: true;
  developKeys: number[];
  onMouseOverId: string;
  // selectInputId: string;
  onSelect?: (id: number, children: TreeData[]) => void;
  onMouseOver?: (id: number, parentId: number) => void;
  allClick: (id: number) => void;
  addFolder: (id: string) => void;
  upFolder: (id: string) => void;
  delectFolder: (id: string) => void;
  onOk: () => void;
}

interface ITreeState {
  openKeys: number[];
  operationVisible: boolean;
  selectInputValue: string;
  selectInputId: string;
  search: string;
  operationTop: number;
  operationLeft: number;
}

interface TreeData {
  id: number;
  name: string;
  parentId?: number;
  children: TreeData[];
}

const fileState = {
  open:
    'https://img.alicdn.com/imgextra/i3/4074958541/O1CN016EWoJ02CxpKr1qvZd_!!4074958541.png',
  openBottom:
    'https://img.alicdn.com/imgextra/i3/4074958541/O1CN019OSPgE2CxpKvQ3PfQ_!!4074958541.png',
  shut:
    'https://img.alicdn.com/imgextra/i4/4074958541/O1CN01l6n5O72CxpKtWEVNN_!!4074958541.png',
  shutBottom:
    'https://img.alicdn.com/imgextra/i4/4074958541/O1CN01LIiWsJ2CxpKtqeSsv_!!4074958541.png',
  final:
    'https://img.alicdn.com/imgextra/i2/4074958541/O1CN01ozzWuS2CxpKqETayW_!!4074958541.png',
  finalBottom:
    'https://img.alicdn.com/imgextra/i2/4074958541/O1CN01EJ1q9x2CxpKwOLSZN_!!4074958541.png'
};

type FileTypes = keyof typeof fileState;

export default class Tree extends React.Component<ITreeProps, ITreeState> {
  static defaultProps: Partial<ITreeProps> = {
    showFolder: false,
    defaultOpenKeys: [],
    onSelect: () => {},
    onMouseOver: () => {},
    isOnContextMenu: true,
    developKeys: [],
    allClick: () => {},
    addFolder: () => {},
    upFolder: () => {},
    delectFolder: () => {},
    onOk: () => {}
  };

  constructor(props: ITreeProps) {
    super(props);
    this.state = {
      openKeys: props.defaultOpenKeys,
      search: '',
      operationVisible: false,
      selectInputValue: '',
      // selectInputId: props.selectInputId,
      selectInputId: '',
      operationTop: 0,
      operationLeft: 0
    };
  }

  // componentDidUpdate(nextProps) {
  //   if (this.props.showFolder !== nextProps.showFolder) {
  //     this.setState({ operationTop: 0, operationLeft: 0 });
  //   }
  // }

  /**
   * 判断文件是否打开，或者是否在底部
   * @param cid
   * @param length
   * @param isBottom
   */
  public getFileState(cid: number, length: number, isBottom: boolean) {
    const { openKeys } = this.state;
    const isOpen = openKeys.indexOf(cid) !== -1;

    if (length) {
      if (isOpen) {
        if (isBottom) return 'openBottom';
        else return 'open';
      } else {
        if (isBottom) return 'shutBottom';
        else return 'shut';
      }
    }

    if (isBottom) return 'finalBottom';

    return 'final';
  }

  /**
   *
   * @param cid
   */
  public selected(cid: number) {
    const { openKeys } = this.state;
    const indexOf = openKeys.indexOf(cid);

    if (indexOf === -1) {
      openKeys.push(cid);
    } else {
      openKeys.splice(indexOf, 1);
    }
    this.setState({
      openKeys
    });
  }

  public renderUl(
    children: TreeData[],
    cid: number,
    length: number,
    isBottom: boolean
  ) {
    const { openKeys } = this.state;
    if (!children.length) return null;
    const isOpen = openKeys.indexOf(cid) !== -1;
    return (
      <ul
        className={classnames(
          css.childrenUl,
          { [css.visible]: !isOpen },
          { [css.line]: length !== 1 && !isBottom }
        )}
      >
        {children.map((item, index) =>
          this.renderLi(item, index, children.length)
        )}
      </ul>
    );
  }

  public renderModal() {
    const { operationTop, selectInputId, operationLeft } = this.state;
    const {
      addFolder,
      upFolder,
      delectFolder,
      onOk,
      showFolder,
      onMouseOverId
    } = this.props;
    return (
      <Portal
        onClose={() => {
          this.setState({ selectInputId: '' });
        }}
        closeOnOutsideClick
        isOpen={showFolder && !!selectInputId}
      >
        <div
          className={css.modal}
          style={{ top: operationTop, left: operationLeft }}
        >
          <p
            onClick={() => {
              addFolder(onMouseOverId ? onMouseOverId : selectInputId);
              this.setState({ selectInputId: '' });
            }}
          >
            新建文件夹
          </p>
          <p
            onClick={() => {
              upFolder(selectInputId);
              this.setState({ selectInputId: '' });
            }}
          >
            重命名
          </p>
          {Number(selectInputId) !== 1 && (
            <p
              onClick={() => {
                delectFolder(selectInputId);
                this.setState({ selectInputId: '' });
                onOk();
              }}
            >
              删除文件夹
            </p>
          )}
        </div>
      </Portal>
    );
  }

  public renderLi(item: TreeData, index: number, length: number) {
    const { id, name, children } = item;
    const isBottom = index + 1 === length;
    const { folderId, isOnContextMenu } = this.props;
    const isSelectTree = folderId === id;
    const state = this.getFileState(id, children.length, isBottom);

    return (
      <li
        className={css.columnLi}
        key={`li_${id}`}
        onContextMenu={e => {
          if (!isOnContextMenu) return false;
          e.preventDefault();
          e.stopPropagation();
          this.setState({
            selectInputId: String(folderId),
            operationTop: e.clientY,
            operationLeft: e.clientX + 5
          });
        }}
      >
        <span className={css.row}>
          <img
            onClick={this.selected.bind(this, id)}
            src={fileState[state]}
            alt=""
          />
          <span
            className={classnames(css.title, { [css.selected]: isSelectTree })}
            onClick={() => this.props.onSelect(item.id, item.children)}
            onMouseOver={() => {
              this.props.onMouseOver(item.id, item.parentId);
            }}
          >
            <Icon
              type="iconFolder"
              className={classnames(css.icon, { [css.selected]: isSelectTree })}
            />
            {name}
          </span>
        </span>
        {this.renderUl(children, id, length, isBottom)}
      </li>
    );
  }

  public render() {
    const { treeList, className, showFolder } = this.props;
    const { selectInputId } = this.state;
    return (
      <div
        className={classnames(css.treeBox, className)}
        onClick={e => {
          e.stopPropagation();
          this.setState({ selectInputId: '' });
        }}
      >
        <ul>
          {treeList &&
            treeList.map((item, index) =>
              this.renderLi(item, index, treeList.length)
            )}
        </ul>
        <div className={css.blank} />
        {showFolder && !!selectInputId && this.renderModal()}
        {/* {this.renderModal()} */}
      </div>
    );
  }
}
