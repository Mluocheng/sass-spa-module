import React from 'react';
import classNames from 'classnames';
import Icon from 'components/common/icon';
import VideoSelector from 'components/selectors/videoSelector';
import css from './index.less';

export interface Props {
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

const Upload: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(({ 
  className, onChange, value
}, ref) => {

  const [visible, setVisible] = React.useState(false);

  function renderEdit() {
    return (
      <div className={css.btn}>
        <span onClick={() => setVisible(true)}>替换</span>|
        <span onClick={() => onChange('')}>删除</span>
      </div>
    );
  }

  return (
    <>
      <div className={css.containerBox}>
        <div ref={ref}
          onClick={() => setVisible(true)}
          className={classNames(css.uploadBox, { [css.hasVideo]: !!value }, className)}
        >
          {value ? <video src={value} /> : <Icon type="iconAddPicture" />}
          {!!value && renderEdit()}
        </div>
        <div className={css.prompt}>
          <p>1、默认支持一个视频 </p>
          <p>2、视频大小不能超过10M </p>
          <p>3、格式：支持mp4格式 </p>  
        </div>
      </div>
      <VideoSelector 
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={videos => {
          setVisible(false);
          if (!videos[0]) return; 
          onChange(videos[0].url);
        }}
      />
    </>
  );
});

Upload.defaultProps = {
  // value: '',
  onChange: () => {},
};

export default Upload;



