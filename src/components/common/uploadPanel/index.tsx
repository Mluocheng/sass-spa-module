import React from 'react';
import classNames from 'classnames';
import { Upload } from 'antd';
import { UploadProps, RcFile } from 'antd/lib/upload';
import CommonUtils from 'common/utils';
import Portal from '../portal';
import Icon from '../icon';
import UploadQueue, { QueueProps } from './utils/uploadQueue';
import css from './index.less';
import Utils from './utils';

export interface Props<P, R = {}> extends QueueProps<P, R> {
  uploadProps?: Omit<UploadProps, 'accept'>;
  maxSize?: number;
  accept?: string;
  isSupportDrop?: boolean;
  closeOnEnd?: boolean;   // 全部上传完毕时，自动关闭
}

const enum UploadStatusEnum {
  Wait, Uploading, Success, Error, Warn
}

interface State {
  visible: boolean;
  fileList: FileObj[];
}

interface FileObj {
  file: File;
  progress: number;
  status: UploadStatusEnum;
  warnText?: string;
}

export default class UploadPanel<P, R = {}> extends React.Component<Props<P, R>, State> {

  static defaultProps = {
    uploadProps: {},
    maxSize: 3 * (1024 ** 2),
    isSupportDrop: true,
    closeOnEnd: true,
    onStartUpload: () => {},
    onProgress: () => {},
    onError: () => {},
    onSuccess: () => {},
    onEnd: () => {},
  };

  hasError = false;

  uploadQueue: UploadQueue<P, R>;
  
  constructor(props: Props<P>) {
    super(props);
    const { uploadProps, ...others } = props;
    
    this.uploadQueue = new UploadQueue<P, R>({
      ...others,
      onStartUpload: this.handleStart.bind(this),
      onProgress: this.handleProgress.bind(this),
      onError: this.handleError.bind(this),
      onSuccess: this.handleSuccess.bind(this),
      onEnd: this.handleEnd.bind(this),
    });
    this.state = {
      visible: false,
      fileList: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
      this.uploadQueue.props.data = this.props.data;
    }
  }

  /**
   * 阻止默认事件
   * @param e 
   */
  private preventDefault(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * 将文件添加到上传队列
   * @param fileList 
   */
  private addFileToUpload(fileList: File[]) {
    const { maxSize, accept } = this.props;
    const willUploadList = fileList.map(item => {
      // 排除文件类型不匹配的文件
      if (accept && !Utils.checkAccept(item, accept)) {
        this.hasError = true;
        return {
          file: item,
          progress: 100,
          status: UploadStatusEnum.Warn,
          warnText: '文件格式错误，无法上传',
        };
      }
      // 排除文件大小超标的文件
      if (item.size > maxSize) {
        this.hasError = true;
        return {
          file: item,
          progress: 100,
          status: UploadStatusEnum.Warn,
          warnText: `文件超过${maxSize / (1024 ** 2)}M，无法上传`,
        };
      }
      return { file: item, progress: 0, status: UploadStatusEnum.Wait };
    });

    // 将文件添加到上传队列
    this.uploadQueue.addQueue(
      willUploadList
        .filter(item => item.status === UploadStatusEnum.Wait)
        .map(item => item.file)
    );

    this.setState({
      visible: true,
      fileList: [
        ...this.state.fileList,
        ...willUploadList,
      ]
    });
  }

  /**
   * 上传图片之前
   * @param file 
   * @param fileList 
   */
  handleBeforeUpload(file: File, fileList: File[]) {
    const { beforeUpload = () => { } } = this.props.uploadProps;
    beforeUpload(file as RcFile, fileList as RcFile[]);
    this.addFileToUpload(fileList);
    return false;
  }

  /**
   * 将文件拖拽到上传面板时
   * @param event 
   */
  handleDrop(e: React.DragEvent<HTMLDivElement>) {
    const { isSupportDrop } = this.props;
    this.preventDefault(e);
    if (!isSupportDrop) return;
    // 上传文件
    const fileList = e.dataTransfer.files;
    this.addFileToUpload(Object.values(fileList));
  }

  /**
   * 开始上传队列中的某个文件
   * @param file 
   */
  handleStart(file: File) {
    const { fileList } = this.state;
    this.setState({
      fileList: fileList.map(item => {
        if (item.file === file) item.status = UploadStatusEnum.Uploading;
        return item;
      }),
    });
    this.props.onStartUpload(file);
  }

  /**
   * 上传进度回调
   * @param file 
   */
  handleProgress(file: File, e: { percent?: number }) {
    const { fileList } = this.state;
    this.setState({
      fileList: fileList.map(item => {
        if (item.file === file) item.progress = e.percent;
        return item;
      }),
    });
    
    this.props.onProgress(file, e);
  }

  /**
   * 上传失败
   */
  handleError(file: File, e: ProgressEvent<EventTarget>) {
    const { fileList } = this.state;
    this.setState({
      fileList: fileList.map(item => {
        if (item.file === file) item.status = UploadStatusEnum.Error;
        return item;
      }),
    });
    this.props.onError(file, e);
  }

  /**
   * 上传完成
   */
  handleSuccess(file: File, result: R) {
    const { fileList } = this.state;
    this.setState({
      fileList: fileList.map(item => {
        if (item.file === file) item.status = UploadStatusEnum.Success;
        return item;
      }),
    });
    this.props.onSuccess(file, result);
  }

  /**
   * 重新上传
   * @param fileObj 
   */
  handleReUpload(fileObj: FileObj) {
    const { fileList } = this.state;
    this.uploadQueue.addQueue([fileObj.file]);
    this.setState({
      fileList: fileList.map(item => {
        if (item.file === fileObj.file) {
          item.status = UploadStatusEnum.Wait;
          item.progress = 0;
        }
        return item;
      })
    });
  }

  /**
   * 队列上传完成
   */
  handleEnd() {
    const { closeOnEnd, onEnd } = this.props;
    if (closeOnEnd && !this.hasError) {
      this.handleClose();
      CommonUtils.message('上传完成！');
    }
    onEnd();
  }

  /**
   * 关闭弹窗，清空队列
   */
  handleClose() {
    this.setState({
      visible: false,
      fileList: [],
    });
    this.uploadQueue.clearQueue();
  }

  render() {
    const { children, uploadProps } = this.props;
    const { visible, fileList } = this.state;

    return (
      <>
        <Upload {...uploadProps}
          multiple
          showUploadList={false}
          beforeUpload={this.handleBeforeUpload.bind(this)}
        >
          {children}
        </Upload>
        <Portal isOpen={visible}>
          <div
            className={css.panel}
            onDrop={this.handleDrop.bind(this)}
            onDragEnter={this.preventDefault.bind(this)}
            onDragOver={this.preventDefault.bind(this)}
          >
            <div className={css.titleBg} />
            <div className={css.title}>
              <h4>
                <Icon type="iconUpload" className={css.uploadIcon} />
                上传进度面板
              </h4>
              <Icon className={css.close} type="iconCancel" onClick={this.handleClose.bind(this)} />
            </div>
            <ul className={css.fileList}>
              {
                fileList.map((item, index) => {
                  return (
                    <li key={`${item.file.name + index}`}>
                      <div className={css.nameBar}>
                        <span className={css.name}>{item.file.name}</span>
                        <span className={classNames(css.status, {
                          [css.statusUploading]: item.status === UploadStatusEnum.Uploading,
                          [css.statusSuccess]: item.status === UploadStatusEnum.Success,
                          [css.statusError]: item.status === UploadStatusEnum.Error,
                          [css.statusWarn]: item.status === UploadStatusEnum.Warn,
                        })}>
                          {{
                            [UploadStatusEnum.Wait]: '等待上传...',
                            [UploadStatusEnum.Uploading]: '上传中...',
                            [UploadStatusEnum.Warn]: item.warnText,
                            [UploadStatusEnum.Success]: '上传成功',
                            [UploadStatusEnum.Error]: '上传失败',
                          }[item.status]}
                        </span>
                        {
                          item.status === UploadStatusEnum.Error &&
                          <a
                            className={css.reupload}
                            onClick={this.handleReUpload.bind(this, item)}
                          >
                            重新上传
                          </a>
                        }
                      </div>
                      <div className={css.progressBar}>
                        <div
                          style={{ width: `${item.progress}%` }}
                          className={classNames({
                            [css.uploading]: item.status === UploadStatusEnum.Uploading,
                            [css.success]: item.status === UploadStatusEnum.Success,
                            [css.error]: item.status === UploadStatusEnum.Error,
                            [css.warn]: item.status === UploadStatusEnum.Warn,
                          })}
                        />
                      </div>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </Portal>
      </>
    );
  }
}
