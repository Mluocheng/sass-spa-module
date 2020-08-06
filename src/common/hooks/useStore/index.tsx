import React from 'react';
import { Model, Action, Dispatch, Effects, Reducers } from './interface';

export interface StoreProps<S> { 
  store: S;
  dispatch: Dispatch<string, any, Promise<any>>;
}

/**
 * 没有找到store的 errorCreator
 * @param type 
 */
function storeNotFindErrCreator(type: string) {
  return new Error(
    `没有找到 store! 请检查一下 在 使用 ${type} 之前，是否已使用 provideStore 向应用注入 store!`
  );
}

/**
 * 创建触发器
 * @param effects 
 * @param reducers 
 * @param dispatch 
 * @param getState 
 */
function dispatchCreator<S>(
  reducers: Reducers<S>, 
  effects: Effects<S>, 
  dispatch: React.Dispatch<Action>,
  getState: () => S,
): Dispatch<string, any, Promise<any>> {
  const effectKeys = Object.keys(effects);
  const reducerKeys = Object.keys(reducers);

  /**
   * dispatcher
   * 1.优先触发 effect；
   * 2.其次触发 reducer；
   */
  return async function dispatcher(action: Action) {
  
    if (effectKeys.includes(action.type)) {
      return await effects[action.type]({ action, put: dispatcher, getState });
    } else if (reducerKeys.includes(action.type)) { // 执行reducer
      dispatch(action);
      return;
    }

  };
}

/**
 * 提供 store 高阶组件的 creator
 * @param WrappedComponent 
 */
function provideCreator<S, P>(
  model: Model<S>, 
  Context: React.Context<StoreProps<S>>, 
  onDestroy: () => void = () => {},
) {
  const { initState, reducers, effects } = model;

  return function provideStore(WrappedComponent: React.FC<P>) {
    const Wrapper: React.FC<P> = React.memo(props => {

      const [state, dispatch] = React.useReducer<React.Reducer<S, Action>>(
        React.useCallback((prevState, action) => {
          // 触发 reducer
          if (Object.keys(reducers).includes(action.type)) {
            return reducers[action.type](prevState, action);
          }
          return prevState;
        }, []),
        initState
      );

      React.useEffect(() => onDestroy, []);

      return (
        <Context.Provider 
          value={{
            store: state, 
            dispatch: dispatchCreator(reducers, effects, dispatch, () => state),
          }}
        >
          <WrappedComponent {...props} />
        </Context.Provider>
      );
    });
    return Wrapper;
  };
}

/**
 * 创建局部store
 * @param model 
 */
export default function createStore<S, P extends {} = {}>(model: Model<S>) {
  let Context = React.createContext<StoreProps<S>>(null);
  return {
    // 提供store
    provideStore: provideCreator<S, P>(model, Context, () => { 
      console.log();
      // Context = null; 
    }),
    // 组件 注入 store 和 dispatch
    useConnect(): [S, Dispatch<string, any, Promise<any>>] {
      const storeProps = React.useContext(Context);
      if (!storeProps) throw storeNotFindErrCreator('useConnect');
      return [storeProps.store, storeProps.dispatch];
    },
    // 只注入 store
    useStore(): S {
      const storeProps = React.useContext(Context);
      if (!storeProps) throw storeNotFindErrCreator('useStore');
      return storeProps.store;
    },
    // 只注入 dispatch
    useDispatch(): Dispatch<string, any, Promise<any>> {
      const storeProps = React.useContext(Context);
      if (!storeProps) throw storeNotFindErrCreator('useDispatch');
      return storeProps.dispatch;
    }
  };

}
