import createStore from 'common/hooks/useStore';

interface State {
}

export const { provideStore, useConnect, useStore, useDispatch } = createStore<
  State
>({
  initState: {
  },

  reducers: {
    update(prevState, action) {
      return {
        ...prevState,
        ...action.payload
      };
    }
  },

  effects: {


  }
});
