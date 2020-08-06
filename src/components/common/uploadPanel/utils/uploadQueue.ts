import Ajax from 'common/utils/ajax';
import Utils from '.';

export interface AjaxConfig<D = {}> {
  action?: string;
  filename?: string;
  data?: D;
}

export interface QueueProps<D, R> extends AjaxConfig<D> {
  onStartUpload?: (file: File) => void;
  onProgress?: (file: File, event: { percent?: number }) => void;
  onError?: (file: File, event: ProgressEvent<EventTarget>) => void;
  onSuccess?: (file: File, result: R) => void;
  onEnd?: () => void;
}

export default class UploadQueue<D, R> {

  props: QueueProps<D, R>;
  request: { abort(): void };
  queue: File[] = [];
  status: 'stop' | 'uploading' = 'stop';

  constructor(props: QueueProps<D, R>) {
    this.props = props;
    this.request = null;
  }

  /**
   * 启动上传
   */
  startUpload() {

    // 正在上传文件中
    if (this.status !== 'stop') {
      return;
    }
    
    if (this.queue.length > 0) {
      this.status = 'uploading';
      const file = this.queue.shift();
      this.props.onStartUpload(file);
      this.upload(file);
    }

  }

  /**
   * 添加队列
   * @param files
   */
  addQueue = Utils.debounce<File[]>(files => {
    this.queue = this.queue.concat(files);
    this.startUpload();
  }, 200);

  /**
   * 清除队列
   */
  clearQueue() {
    if (this.request) {
      this.request.abort();
      this.request = null;
    }
    this.status = 'stop';
    this.queue = [];
  }

  /**
   * 上传
   * @param file 
   */
  async upload(file: File) {

    const {
      action = '',
      filename = 'file',
      data = {},
      onProgress = () => {},
      onSuccess = () => {},
      onError = () => {},
      onEnd = () => {},
    } = this.props;


    const formData = new FormData();
    /**
     * TODO: 处理你的图片
     * 1.获取图片宽高
     * 2.压缩图片
     */
  


    if (file.type.split('/')[0] === 'image') {
      const { width, height } = await Utils.getImgSize(await Utils.getReader(file));
      formData.append('width', String(width));
      formData.append('height', String(height));

    }
    formData.append(filename, file);

    
    // 压缩图片
    // const result = await Utils.compressImage(file);



    const dataKeys = Object.keys(data);

    if (dataKeys.length) {
      dataKeys.forEach(key => {
        formData.append(key, data[key]);
      });
    }

    try {
      const { data: result, abort } = await Ajax.upload<typeof formData, R>({
        url: action,
        params: formData,
        onProgress: percent => onProgress(file, { percent }),
      });
      onSuccess(file, result);
      this.request = { abort };
    } catch (error) {
      onError(file, error);
    }
    
    this.status = 'stop';
    this.request = null;

    if (!this.queue.length) {
      onEnd();
    } else {
      this.startUpload();
    }
    

  }
  
}

