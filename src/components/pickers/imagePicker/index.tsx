import React from 'react';
import classNames from 'classnames';
import { Material } from 'api/interface/material';
import UploadBtn from 'components/common/uploadBtn';
import ImageSelector from 'components/selectors/imageSelector';
import css from './index.less';

export interface Props {
  length?: number;
  size?: 'small' | 'normal';
  value?: string[];
  onChange?: (value: string[]) => void;
}

const ImagePicker: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(({ 
  length, value = [], onChange, size
}, ref) => {

  if (value.length !== length) {
    const arr = new Array(length).fill('').map((item, index) => value[index] || item);
    value = arr;
  }

  const [isEdit, setIsEdit] = React.useState(false); // 是否是编辑
  const [selectIndex, setSelectIndex] = React.useState(-1);

  /**
   * 确认添加图片
   * @param selected 
   */
  function handleOk(selected: Material[]) {
    setSelectIndex(-1);

    let newValue = [...value];

    if (isEdit) { // 编辑
      
      if (!selected[0]) return;
      newValue[selectIndex] = selected[0].url;

    } else { // 添加图片

      let n = 0;
      newValue = newValue.map((item, index) => {
        if (index < selectIndex || item) return item;
        n++;
        return selected[n - 1] ? selected[n - 1].url : '';
      });
    }

    onChange(newValue);
  }

  return (
    <>
      <div className={css.containerBox}>
        <div className={css.container} ref={ref}>
          {
            value.map((item, index) => {
            
              return (
                <UploadBtn 
                  size={size}
                  className={classNames(css.itemColor, { [css.item]: index !== value.length - 1 })}
                  key={`image${index}`} 
                  imageUrl={value[index]}
                  onAdd={() => {
                    setSelectIndex(index);
                    setIsEdit(false);
                  }}
                  onChange={() => {
                    setSelectIndex(index);
                    setIsEdit(true);
                  }}
                  onRemove={() => {
                    const newValue = [...value];
                    newValue[index] = '';
                    onChange(newValue);
                  }}
                />
              );
            })
          }
        </div>
        <div className={css.prompt}>
          <p>1、最多5张商品主图 </p>
          <p>2、商品主图大小不能超过3M</p>
          <p>3、尺寸：图片不能低于400*400像素，建议使用800*800像素</p>
          <p>4、格式：支持jpg、png格式</p>
        </div>
      </div>
      <ImageSelector 
        length={
          isEdit || 
            length === 1 ? 1 : 
            [...value].slice(selectIndex, length).filter(item => !item).length
        }
        visible={selectIndex!== -1} 
        onCancel={() => setSelectIndex(-1)} 
        onOk={handleOk}
      />
    </>
  );
});

ImagePicker.defaultProps = {
  // value: [],
  length: 1,
  onChange: () => null,
};

export default ImagePicker;
