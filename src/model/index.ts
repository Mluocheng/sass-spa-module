import createStore from 'common/hooks/useStore';
import { Employee } from 'api/interface/employee';

interface Props {
  user?: Employee;
}

export const { provideStore, useConnect, useDispatch, useStore } = createStore<Props>({

  initState: {
    user: null,
  },

  reducers: {
    update(prevState, action) {
      return {
        ...prevState,
        ...action.payload,
      };
    }

  },

  effects: {
    /**
     * 初始化登录用户信息
     * @param token
     */
    async init({ put }) {
      // 从缓存中获取token
      // const data = await getUserInfo();
      // put({
      //   type: 'update',
      //   payload: { user: data },
      // });
    },
    
  },

});
