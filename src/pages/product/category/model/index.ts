import createStore from 'common/hooks/useStore';

export const { provideStore, useConnect, useStore, useDispatch } = createStore({

  initState: {
    selectClassId: null,
    selectGoods: [],
    classTree: [],
    // 商品列表
    status: 'success',
    list: [],
    // total: 0,
    page: 1,
    size: 10,
    keywords: '',
    total: null,
    // parentId: 0,
  },

  reducers: {
    // 跟新数据
    update(prevState, action) {
      return {
        ...prevState,
        ...action.payload
      };
    },
  },


  effects: {

    /**
     * 初始化数据
     *
     * @param action
     * @param call
     * @param put
     * @param select
     */
    async initTree({ put, getState, action }) {
      let { selectClassId } = getState();
      
      if (action.payload) {
        selectClassId = action.payload.selectClassId;
      }
    },


  },

});
