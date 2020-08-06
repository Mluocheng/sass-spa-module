import Icon from 'components/common/icon';
import warn from 'components/common/confirm/warn';
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
  onSelect?: (id: number, name: string) => void;
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
  children: TreeData[];
}

const fileState = {
  open: 'iconListClose',
  shutDown: 'iconListOpen',
};

type FileTypes = keyof (typeof fileState);

export default class PickersTree extends React.Component<ITreeProps, ITreeState> {

  static defaultProps: Partial<ITreeProps> = {
    showFolder: false,
    defaultOpenKeys: [],
    onSelect: () => { },
    isOnContextMenu: true,
    developKeys: [],
    allClick: () => { },
    addFolder: () => { },
    upFolder: () => { },
    delectFolder: () => { },
    onOk: () => { },
  };

  constructor(props: ITreeProps) {
    super(props);
    this.state = {
      openKeys: props.defaultOpenKeys,
      search: '',
      operationVisible: false,
      selectInputValue: '',
      selectInputId: '',
      operationTop: 0,
      operationLeft: 0,
    };
  }

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
        return 'open';
      } else {
        return 'shutDown';
      }
    }
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
      openKeys,
    });
  }

  public renderUl(children: TreeData[], cid: number, length: number, isBottom: boolean) {
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
        {children.map((item, index) => this.renderLi(item, index, children.length))}
      </ul>
    );
  }

  public renderModal() {
    const { operationTop, selectInputId } = this.state;
    const { addFolder, upFolder, delectFolder, onOk } = this.props;
    return (
      <div className={css.modal} style={{ top: operationTop - 100 }}>
        <p onClick={() => {
          addFolder(selectInputId);
          this.setState({ selectInputId: '' });
        }}>新建文件夹</p>
        <p onClick={() => {
          upFolder(selectInputId);
          this.setState({ selectInputId: '' });
        }}>
          重命名
        </p>
        {
          Number(selectInputId) !== 1 &&
          <p onClick={() => {
            delectFolder(selectInputId);
            this.setState({ selectInputId: '' });
            warn({
              title: '操作提醒',
              content: '请谨慎操作！', 
              onOk: onOk
            });
          }}>
            删除文件夹
          </p>
        }
      </div>
    );
  }

  public renderLi(item: TreeData, index: number, length: number) {
    const { openKeys } = this.state;
    const { id, name, children } = item;
    const isBottom = index + 1 === length;
    const { folderId, isOnContextMenu } = this.props;
    const isSelectTree = folderId === id;
    const state = this.getFileState(id, children.length, isBottom);
    
    

    return (
      <li className={css.columnLi} key={`li_${id}`}
        onContextMenu={e => {
          if (!isOnContextMenu) return false;
          e.preventDefault();
          e.stopPropagation();
          this.setState({
            selectInputId: String(folderId),
            operationTop: e.clientY,
            operationLeft: e.clientX,
          });
        }}>

        <span className={css.row} onClick={this.selected.bind(this, id)}>
          <span
            className={classnames(css.title, { [css.selected]: isSelectTree })}
            onClick={() => this.props.onSelect(item.id, item.name)}
          >
            {name}
            {
              children.length !== 0 && <Icon className={css.rightIcon} type={fileState[state]} />
            }
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
      <div className={classnames(css.treeBox, className)} onClick={(e) => {
        e.stopPropagation();
        this.setState({ selectInputId: '' });
      }
      }>
        <ul style={{ maxHeight: '790px', overflowY: 'auto' }}>
          {treeList && treeList.map((item, index) => this.renderLi(item, index, treeList.length))}
        </ul>
        {/* <div className={css.blank} /> */}
        {showFolder && !!selectInputId && this.renderModal()}
      </div>
    );
  }
}
