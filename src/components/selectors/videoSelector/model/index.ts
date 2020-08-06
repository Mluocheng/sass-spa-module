import createStore from 'common/hooks/useStore';
import { MaterialListParams, getFolderList, getFolderMaterialList } from 'api/queries/material';
import { PagList } from 'api/interface';
import { Material, Folder } from 'api/interface/material';
import { MaterialTypeEnum } from 'api/interface/material/enums';

interface State extends Omit<MaterialListParams, 'type'>, PagList<Material> {
  folders: Folder;
  isSystem: boolean;
  selected: Material[];
}

export interface Props {
  visible?: boolean;
  length?: number;
  onCancel?: () => void;
  onOk?: (video: Material[]) => void;
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
      id: null,
      name: '',
      children: [],
    },
    isSystem: false,
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
    },

    /**
     * 选中视频
     * @param prevState 
     * @param param1 
     */
    selectVideo(prevState, { payload }) {
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
    async getFolderList({ action, put }) {
      
      const isSystem = action.payload.isSystem || action.payload.isSystem as boolean;
      try {
        const records = await getFolderList(MaterialTypeEnum.Video);
        const folderId = action.payload.folderId || records.id;
        
        // 默认选中第一个子节点
        put({
          type: 'getVideoList',
          payload: { folderId, page: 1 }
        });

        put({
          type: 'update',
          payload: { folders: records, isSystem }
        });

      } catch (e) {

        put({
          type: 'getVideoList',
          payload: { folderId: 1, page: 1 }
        });
      }

    },

    /**
     * 获取视频列表
     * @param param0 
     */
    async getVideoList({ action, getState, put }) {
      const { 
        folderId: lastFolderId, keywords: lastKeywords, page: lastPage, size: lastSize
      } = getState();
      
      const folderId = action.payload.folderId as number || lastFolderId;
      const page = action.payload.page as number || lastPage;
      const size = action.payload.size as number || lastSize;
      const keywords = action.payload.keywords as string || lastKeywords;
      
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
