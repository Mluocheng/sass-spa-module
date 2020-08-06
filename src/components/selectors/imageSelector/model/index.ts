import createStore from 'common/hooks/useStore';
import { MaterialListParams, getFolderList, getFolderMaterialList } from 'api/queries/material';
import { PagList } from 'api/interface';
import { Material, Folder } from 'api/interface/material';
import { MaterialTypeEnum } from 'api/interface/material/enums';

interface State extends Omit<MaterialListParams, 'type'>, PagList<Material> {
  folders: Folder;
  // isSystem: boolean;
  selected: Material[];
}

export interface Props {
  visible?: boolean;
  length?: number;
  onCancel?: () => void;
  onOk?: (images: Material[]) => void;
}

export const { provideStore, useConnect } = createStore<State, Props>({

  initState: {
    records: [],
    selected: [],
    total: 1,
    page: 1,
    size: 50,
    keywords: '',
    folderId: 0,
    folders: {
      children: [],
      id: null,
      name: '全部图片',
      parentId: 1
    },
    // isSystem: false,
  },

  reducers: {

    /**
     * 更新
     * @param prevState 
     * @param param1 
     */
    update(prevState, { payload }) {
      
      
      return {
        ...prevState,
        ...payload,
      };
    },

    /**
     * 选中图片
     * @param prevState 
     * @param param1 
     */
    selectImage(prevState, { payload }) {
      const { selected, records } = prevState;
      const id = payload.id as number;
      const length = payload.length as number;

      const newSelected = [...selected].filter(item => item.id !== id);

      // 如果两数组数量相等，则没有选中，向newSelected新增
      if (newSelected.length === selected.length) {
        // 数量超过时，移除第一个
        if (newSelected.length === length) newSelected.shift();
        newSelected.push(records.find(item => item.id === id));
      }

      return {
        ...prevState,
        selected: newSelected,
      };
    },

  },

  effects: {

    /**
     * 获取文件夹列表
     * @param param0 
     */
    async getFolderList({ action, getState, put }) {
      
      const { folderId: lastFolderId } = getState();
      try {
        const folders = await getFolderList(MaterialTypeEnum.Image);
        const folderId = action.payload.id || lastFolderId || folders.id;

        // 默认选中第一个子节点
        put({
          type: 'getImageList',
          payload: { folderId, page: 1 }
        });

        put({
          type: 'update',
          payload: { folders }
        });

      } catch (e) {

      }

    },

    /**
     * 获取图片列表
     * @param param0 
     */
    async getImageList({ action, getState, put }) {
    
      const { 
        folderId: lastFolderId, keywords: lastKeywords, page: lastPage, size
      } = getState();
        
      
      const folderId = action.payload.folderId as number || lastFolderId;
      const page = action.payload.page as number || lastPage;
      // const size = action.payload.size as number || lastSize;
      const keywords = action.payload.keywords !== undefined ? action.payload.keywords : lastKeywords;

      const {
        records, total 
      } = await getFolderMaterialList({ folderId, page, size, keywords, type: MaterialTypeEnum.Image });

      put({
        type: 'update',
        payload: { folderId, page, size, keywords, records, total }
      });
    },

  },

});
