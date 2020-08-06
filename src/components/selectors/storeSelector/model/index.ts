import createStore from 'common/hooks/useStore';
import { getStoreList } from 'api/queries/store';
import { Store } from 'api/interface/store';
import { Props as TabsModalProps } from 'components/selectors/components/tabsModal';

const putList = [
  {
    id: 101,
    name: '天府门店11',
    contact: '1'
  },
  {
    id: 102,
    name: '天府门店22',
    contact: '1'
  },
  {
    id: 103,
    name: '天府门店33',
    contact: '1'
  },
  {
    id: 104,
    name: '天府门店44',
    contact: '1'
  }
];

const list = [
  {
    id: 106,
    name: '未投放天府门店11',
    contact: '2'
  },
  {
    id: 107,
    name: '未投放天府门店22',
    contact: '2'
  },
  {
    id: 108,
    name: '未投放天府门店33',
    contact: ''
  },
  {
    id: 109,
    name: '未投放天府门店44',
    contact: ''
  }
];

interface State {
  list: Store[];
  keywords: string;
  selectList: Store[];
  selectIds: string[];
}

type omitKeys = 'title'| 'value';
export interface Props extends Omit<TabsModalProps, omitKeys> {
  onOk?: (storeIds?: string) => void;
}

export const { provideStore, useConnect } = createStore<State, Props>({
  initState: {
    keywords: '',
    list: [],
    selectList: [],
    selectIds: []
  },
  reducers: {
    update(prevState, { payload }) {
      return {
        ...prevState,
        ...payload,
      };
    },

    /**
     * 
     * @param prevState 清空选中门店
     */
    clearSelected(prevState) {
      return {
        ...prevState,
        selectIds: [],
        selectList: []
      };
    }
  },

  effects: {

    /**
     * 请求门店列表（已投放/未投放）
     * @param param
     */
    async getStoreList({ action, put, getState }) {
      const isPut = action.payload==='1';
      const { selectList } = getState();
      const content = isPut? list : putList;
      // const { content } = await getStoreList();
      put({
        type: 'update',
        payload: { list: content }
      });
    }
  },

  
});
