import createStore from 'common/hooks/useStore';
import { getCategoryList, getProductList, getCategoryProductList } from 'api/queries/product';
import { PagList, PagParams } from 'api/interface';
import { Product, ProductCategory } from 'api/interface/product';
import { ProductStatusEnum } from 'api/interface/product/enums';

interface State extends PagParams, PagList<Product> {
  categoryId: number;
  keywords?: string;
  categories: ProductCategory[];
  status: ProductStatusEnum;
  selectGoods: Product[];
  multiple: boolean;
  maxLength?: number;
}


export interface Props {
  selectedList?: Product[];
  multiple?: boolean;
  visible?: boolean;
  onCancel?: () => void;
  onOk?: (products: Product[]) => void;
  maxLength?: number;
}

export const { provideStore, useConnect } = createStore<State, Props>({

  initState: {
    records: [],
    total: 1,
    page: 1,
    size: 50,
    keywords: '',
    categoryId: 0,
    categories: [
      {
        id: -1,
        name: '全部商品',
        children: [],
      }
    ],
    status: ProductStatusEnum.Normal,
    selectGoods: [],
    multiple: true,
    maxLength: Infinity,
  },

  reducers: {

    // 数据更新
    update(prevState, { payload }) {
      return {
        ...prevState,
        ...payload,
      };
    },

    // 选中商品
    selectGoods(prevState, action) {
      const { multiple, records, selectGoods } = prevState;
      const goodsId = action.payload.goodsId as number;

      // 已存在商品，则取消选择
      if (selectGoods.some(item => item.id === goodsId)) {
        return {
          ...prevState,
          selectGoods: [...selectGoods.filter(item => item.id !== goodsId)],
        };
      }

      const goods = records.find(item => item.id === goodsId);

      // 多选
      if (multiple) {
        return {
          ...prevState,
          selectGoods: [...selectGoods, goods],
        };
      }

      // 单选
      return {
        ...prevState,
        selectGoods: [goods],
      };
    },

  },

  effects: {

    async init({ action, put, getState }) {
      const multiple = action.payload.multiple as boolean;
      const { categories } = getState();
      if (multiple !== undefined) {
        put({ type: 'update', payload: { multiple }});
      }
      // if (categories[0].children.length) return; // 初始进入阻止请求
      put({ type: 'getFolderList' });
    },

    /**
     * 获取文件夹列表
     * @param param0 
     */
    async getFolderList({ put, getState }) {
      const { categories } = getState();

      try {
        const { records } = await getCategoryList();

        const categoryId = categories[0].id;
  
        // 默认选中第一个子节点
        put({
          type: 'getGoodsList',
          payload: { categoryId, page: 1 }
        });

        categories[0].children = records;
  
        put({
          type: 'update',
          payload: { categories, categoryId }
        });
        
      } catch (error) {
        
      }

    },

    /**
     * 获取分类下的商品列表
     * @param param 
     */
    async getGoodsList({ action, getState, put }) {
      
      const {
        categoryId: lastCategoryId, keywords: lastKeywords, page: lastPage, size,
        status: lastStatus
      } = getState();
      const categoryId = action.payload.categoryId as number || lastCategoryId;
      const page = action.payload.page as number || lastPage;
      const keywords = action.payload.keywords !== undefined ? action.payload.keywords : lastKeywords;
      const status = (action.payload.status === undefined ? lastStatus : action.payload.status) as ProductStatusEnum;

      try {
        const { records, total } = categoryId === -1 
          ? await getProductList({ page, size, keywords, status })
          : await getCategoryProductList(categoryId, { page, size, keywords, status });
        put({
          type: 'update',
          payload: { categoryId, page, keywords, records, total, status }
        });
        
      } catch (error) {
        
      }
    },

  },

});
