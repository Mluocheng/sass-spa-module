import { GeneralParams } from '../index';
import { SexEnum } from '../enmus';
import { Store } from '../store';
import {
  RoleEnum,
  JobLevelEnum,
  EmployeeStatusEnum,
  JobStatusEnum
} from './enums';

// 员工信息
export interface Employee extends GeneralParams {
  isResign?: boolean;
  name?: string;
  avatar?: string;
  tel?: string;
  password?: string;
  wx?: string;
  age?: number;
  sex?: SexEnum;
  jobId?: number;
  job?: Job;
  departmentId?: number;
  department?: Department;
  // role?: RoleEnum;
  storeId?: number;
  store?: Store;
  status?: EmployeeStatusEnum;
  employeeExtension?: EmployeeExtension;
}

// 部门信息
export interface Department extends GeneralParams {
  id?: number;
  name?: string;
}

// 职位信息
export interface Job extends GeneralParams {
  name?: string;
  role?: RoleEnum;
  level?: JobLevelEnum;
  status?: JobStatusEnum;
  employeeNum?: number;
}

// 角色信息
export interface Role extends GeneralParams {
  img: string;
  name: string;
  permissions: string;
  // role?: RoleEnum;
  // level?: JobLevelEnum;
  // status?: JobStatusEnum;
  // employeeNum?: number;
}

// 员工微商城扩展属性
export interface EmployeeExtension extends GeneralParams {
  employeeId?: number;
  employee?: Employee;
  qrCode?: string; // 微商城二维码
  backgroundImage?: string; // 微商城背景图
  showLabels?: string; // 员工形象标签 如：长得看好,美丽大方（前端传啥就存啥）
  showImages?: string; // 员工形象展示图 如：url1,url2
}
