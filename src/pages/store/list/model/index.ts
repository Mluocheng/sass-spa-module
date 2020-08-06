import createStore from 'common/hooks/useStore';
import { Store } from 'api/interface/store';

interface State{
  storeList: Store[];
}

export const { provideStore, useConnect } = createStore<State>({

  initState: {
    storeList: [],
  },

  reducers: {

    /**
     * 更新
     * @param prevState 
     * @param param1 
     */
    update(prevState, action) {
      return {
        ...prevState,
        ...action.payload,
      };
    }

  },

  effects: {


  },

});
