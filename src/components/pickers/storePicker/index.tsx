import React from 'react';
import StoreSelector from 'components/selectors/storeSelector';
import { Props as StoreSelectorProps } from 'components/selectors/storeSelector/model';
import Button from 'components/common/button';

type omitkeys = 'visible'|'onOk'|'onCancel';

export interface Props extends Omit<StoreSelectorProps, omitkeys> {
  onOk: (val?: string) => void;
  onCancel: () => void;
}

const StorePicker: React.FC<Props> = ({ onOk, onCancel, ...others }) => {
  const [visible, setVisible] = React.useState(false);

  const StoreProps = {
    ...others,
    visible: visible,
    onOk: (val) => {
      setVisible(false);
      onOk(val);
    },
    onCancel: () => {
      setVisible(false);
      onCancel();
    }
  };
  return (
    <div>
      <Button onClick={() => setVisible(true)}>门店选择器</Button>
      <StoreSelector {...StoreProps} />
    </div>
  );
};

StorePicker.defaultProps = {
  onOk: () => {},
  onCancel: () => {}
};

export default StorePicker;
