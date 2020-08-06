import Button from 'components/common/button';
import Modal from 'components/common/modal';
import Icon from 'components/common/icon';
import warn from 'components/common/confirm/warn';
import { Location } from 'history';
import { useHistory } from 'react-router';
import { Prompt } from 'react-router-dom';
import React from 'react';
import css from './index.less';

interface Props {
  canExit: boolean;
  onOkx: () => void;
  title: string;
  content: string;
  // history: RouteComponentProps['history'];
}

let canLeave = false;

const ExistCheck: React.FC<Props> = ({ canExit, onOkx, content, title }) => {
  canLeave = canExit;
  const [showExist, setShowExist] = React.useState<boolean>(false);
  const [location, setLocation] = React.useState<Location>(null);
  const history = useHistory();

  function handlePrompt(handleLocation: Location) {
    // 如果当前的保存为false，则弹窗提醒用户进行保存操作
    if (!canLeave) {
      showModalSave(handleLocation);
      return false;
    }
    return true;
  }

  // 展示离开的提示的弹窗
  function showModalSave(handleLocation: Location) {
    setShowExist(true);
    setLocation(handleLocation);
    handleLogout(handleLocation);
  }
  /**
   * 退出
   */
  function handleLogout(handleLocation: Location) {
    warn({
      title: title,
      content: content,
      onCancel: () => {
        setShowExist(false);
      },
      onOk: async () => {
        onOkx();
        setShowExist(false);
        canLeave = true;
        history.push(handleLocation);
      }
    });
  }

  return (
    <div>
      <Prompt message={handlePrompt} />
    </div>
  );
};

ExistCheck.defaultProps = {
  title: '保存确认'
};

export default ExistCheck;

