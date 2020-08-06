import createStore from 'common/hooks/useStore';
import { Department, Employee } from 'api/interface/employee';
import { getDepartments, getEmployeeList } from 'api/queries/employee';
import { PagParams, PagList } from 'api/interface';
import { RoleEnum } from 'api/interface/employee/enums';

interface State extends PagParams, PagList<Department> {
  categories: Department[];
  categoryId: number;
  keywords: string;
  employees: Employee[];
  limitRole?: RoleEnum;   // 限制的角色
}


export const { provideStore, useConnect } = createStore<State>({

  initState: {
    records: [],
    categories: [
      {
        id: 1,
        name: '全部员工',
      }
    ],
    employees: [],
    categoryId: null,
    keywords: '',
    page: 1,
    size: 10,
    total: 1,
    limitRole: RoleEnum.User
  },

  reducers: {

    // 数据更新
    update(prevState, { payload }) {
      return {
        ...prevState,
        ...payload,
      };
    },
  },

  effects: {  
    /**
     * 获取部门列表
     * @param param0 
     */
    async getFolderList({ put, getState }) {
      const { categories } = getState();

      try {
        const { records } = await getDepartments();

        const categoryId = categories[0].id;
  
        // 默认选中第一个子节点
        put({
          type: 'getDepartmentsList',
          payload: { categoryId, page: 1 },
        });

        put({
          type: 'update',
          payload: { 
            categories: categories.length>1 ? categories: [...categories, ...records], 
            categoryId 
          }
        });
        
      } catch (error) {
        
      }

    },
    // 获取员工列表
    async getDepartmentsList({ put, getState, action }) {
      let quit = 1;
      const {
        categoryId: lastCategoryId, keywords: lastKeywords, page: lastPage, size
      } = getState();
      let noAdmin = true;
      const categoryId = action.payload.categoryId as number || lastCategoryId;
      const page = action.payload.page as number || lastPage;
      const keywords = action.payload.keywords !== undefined ? action.payload.keywords : lastKeywords;
      const { records, total } = await getEmployeeList(categoryId, page, size, keywords, noAdmin, quit);

      put({
        type: 'update',
        payload: {
          employees: records,
          keywords, total: total ? total : 1,
          page: page
        }
      });

    }
  },

});
