import React from 'react';
import classNames from 'classnames';
import { Input } from 'antd';
import { SearchProps } from 'antd/lib/input/Search';
import Icon from '../icon';
import css from './index.less';

const AntSearch = Input.Search;

type OmitKeys = 'value' | 'enterButton' | 'suffix';

export interface Props extends Omit<SearchProps, OmitKeys> {
  showReset?: boolean;
  keywords?: string;
  onSearch?: (value: string) => void;
}


const Search: React.FC<Props> = ({ 
  className, keywords, onSearch, showReset, onChange, width, ...others 
}) => {

  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    if (keywords !== value) setValue(keywords);
  }, [keywords]);

  // 重置
  function handleReset() {
    setValue('');
    if (!keywords) return;
    onSearch('');
  }

  return (
    <span className={classNames(css.search, className)} style={{ width }}>
      <AntSearch {...others} 
        onSearch={onSearch} 
        value={value} 
        suffix={(
          <Icon type="iconSearch"
            className={classNames({ [css.disableIcon]: others.disabled })} 
            onClick={() => onSearch(value.trim())} 
          />
        )}
        onChange={e => {
          setValue(e.target.value);
          onChange(e);
        }}
      />
      {
        showReset && 
        <a 
          onClick={handleReset}
          className={classNames(css.reset, { [css.resetDisabled]: !keywords && !value })} 
        >重置</a>
      }
    </span>
  );
};

Search.defaultProps = {
  showReset: true,
  keywords: '',
  onSearch: () => {},
  onChange: () => {},
};

export default Search;
