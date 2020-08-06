import createStore from 'common/hooks/useStore';
import { Department, Employee, Job } from 'api/interface/employee';
import {
  getDepartments,
  getEmployeeList,
  createDepartment,
  deleteEmployee,
  restoreEmployee
} from 'api/queries/employee';
import { transferJob, getJobs, deleteDepartment } from 'api/queries/job';
import { PagParams, PagList } from 'api/interface';

interface State extends PagParams, PagList<Job> {
  jobs: Job[];
  departments: Department[];
  departmentId: number;
  employees: Employee[];
  keywords: string;
}

export const { provideStore, useConnect } = createStore<State>({
  initState: {
    records: [],
    total: 0,
    page: 1,
    size: 10,
    jobs: [],
    departments: [],
    departmentId: 123,
    employees: [],
    keywords: ''
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
        ...payload
      };
    }
  },

  effects: {
    /**
     * 初始化数据
     * @param param0
     */
    async init({ put }) {
      try {
        const { records = [] } = await getDepartments();
        const jobRes = await getJobs();
        put({
          type: 'update',
          payload: { departments: records, jobs: jobRes.records }
        });

        const department = records[0];
        if (!department) return;
        put({
          type: 'selectDepartment',
          payload: {
            id: department.id
          }
        });
        return records;
      } catch (e) {}
    },

    /**
     * 选中部门，获取员工列表
     * @param param0
     */
    async selectDepartment({ action: { payload = {}}, put, getState }) {
      let noAdmin = false;
      let quit = 0;
      let departmentId = payload.id as number;
      
      let { page: startPage, size, keywords: oldKeywords } = getState();
      let { page = startPage, keywords = oldKeywords } = payload;
      if (!departmentId) departmentId = getState().departmentId;
      try {
        const { records, total } = await getEmployeeList(
          departmentId,
          page,
          size,
          keywords,
          noAdmin,
          quit,
        );

        put({
          type: 'update',
          payload: {
            employees: records,
            departmentId,
            keywords,
            total: total
          }
        });
      } catch (e) {}
    },

    /**
     * 创建部门
     * @param param0
     */
    async createDepartment({ action: { payload = {}}, put, getState }) {
      const { name } = payload;

      try {
        const { id } = await createDepartment(name);
        const { departments } = getState();

        put({ type: 'init' });

        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * 删除员工
     * @param param0
     */
    async deleteEmployee({ action: { payload = {}}, put, getState }) {
      const id = payload.id as number;
      if (!id) return;
      try {
        await deleteEmployee(id);
        put({ type: 'selectDepartment' });
        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * 恢复员工
     * @param param0 
     */
    async restoreEmployee({ action, put }) {
      const id = action.payload.id as number;
      // const jobId = action.payload.jobId as number;
      await restoreEmployee(id);
      put({ type: 'selectDepartment' });
    },

    /**
     * 替换职位
     * @param param0
     */
    async transferJob({ action, put }) {
      const employeeId = action.payload.employeeId as number;
      const jobId = action.payload.jobId as number;
      await transferJob(employeeId, jobId);
      put({ type: 'selectDepartment' });
    },

    /**
     * 删除部门
     */
    async deleteDepartment({ action, put }) {
      const { id } = action.payload;
      await deleteDepartment(id);
      put({ type: 'init' });
    }
  }
});
