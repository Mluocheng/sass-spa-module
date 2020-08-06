

interface ReaderAttr {
  file: File;
  attr: {
    width?: number;
    height?: number;
    src: string;
  };
}

export default class Utils {

  /**
   * 检测文件类型
   * @param file 
   * @param accept 
   */
  static checkAccept(file: File, accept: string) {
    const { type } = file;
    const accepts = accept.replace(/\*/, '').split(',');
    return accepts.some(item => type.indexOf(item.trim()) > -1);
  }

  /**
   * 获取base64地址
   * @param files 
   */
  static async getBase64Reader(files: File[]) {
    let readers: ReaderAttr[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64Url = await Utils.getReader(file);
      if (file.type.indexOf('image')) {
        const size = await Utils.getImgSize(base64Url);
        readers.push({ attr: { ...size, src: base64Url }, file });
      } else {
        readers.push({ attr: { src: base64Url }, file });
      }
    }
    return readers;
  }

  /**
   * 通过FileReader获取文件base64地址
   * @param file 
   */
  static getReader(file: File) {
    return new Promise<string>((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
        reader = null;
      };
    });
  }

  /**
   * 获取图片的宽高
   * @param url 
   */
  static getImgSize(url: string) {
    return new Promise<{width: number; height: number}>((resolve, reject) => {
      let img = new Image();
      img.src = url;
      img.onerror = (e) => {
        img = img.onload = img.onerror = null;
        reject(e);
      };
      img.onload = () => {
        const { width, height } = img;
        img = img.onload = img.onerror = null;
        resolve({ width, height });
      };
    });
  }

  /**
   * 截流函数
   * @param func 
   * @param time 
   */
  static debounce<P>(func: (params: P) => void, time: number = 200) {
    let timeout: NodeJS.Timeout;
    return (args: P) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(args), time);
    };
  }

  /**
   * 压缩图片
   * @param file
   */
  static compressImage(file: File) {
    const quality = 0.5;  // 压缩质量，默认图片质量为0.92 

    const name = file.name; // 文件名
    const type = file.type; // 文件后缀

    return new Promise<{file: File; size: {width: number; height: number}}>((resolve, reject) => {

      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(type)) {
        reject(new Error('暂时只支持jpg，png图片压缩!'));
        return;
      }
   
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        const src = e.target.result as string;
          
        const img = new Image();
        img.src = src;
        img.onload = () => {
          const w = img.width;
          const h = img.height;

          
          // 图片小于20k不压缩
          if (file.size < 20 * 1024) {
            return resolve({ file, size: { width: w, height: h }});
          }

          // 生成canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          // 创建属性节点
          const anw = document.createAttribute('width');
          const anh = document.createAttribute('height');
          anw.nodeValue = String(w);
          anh.nodeValue = String(h);
  
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
  
          // 铺底色 PNG转JPEG时透明区域会变黑色
          // ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, w, h);
  
          ctx.drawImage(img, 0, 0, w, h);
          // quality值越小，所绘制出的图像越模糊
          const base64 = canvas.toDataURL(type, quality); // 图片格式jpeg或webp可以选0-1质量区间
  
          // 返回base64转blob的值
          console.log(`原图${(src.length/1024).toFixed(2)}kb`, `新图${(base64.length/1024).toFixed(2)}kb`);
          // 去掉url的头，并转换为byte
          const bytes = window.atob(base64.split(',')[1]);
          // 处理异常,将ascii码小于0的转换为大于0
          const ab = new ArrayBuffer(bytes.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
          }
          const newFile = new Blob([ab], { type }) as File;
          newFile.name = name;

          resolve({ file: newFile, size: { width: w, height: h }});
        };
        img.onerror = err => {
          reject(err);
        };
      };
      reader.onerror = e => {
        reject(e);
      };
    });
  }

}
