import React from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Content from 'components/common/content';
import Input from 'components/common/input';
import Select from 'components/common/select';
import Button from 'components/common/button';
import PageLayout from 'components/layouts/pageLayout';
import FormItem from 'components/formItem';
import { Employee, Job, Department } from 'api/interface/employee';
import Utils from 'common/utils';
import success from 'components/common/confirm/success';
import { RoleEnum } from 'api/interface/employee/enums';
import { Store } from 'api/interface/store';
import { RouteComponentProps } from 'react-router';
import css from './index.less';

export interface Props
  extends FormComponentProps,
    RouteComponentProps<{ employeeId?: string }> {}

const { Option } = Select;

const EmployeeDetail: React.FC<Props> = React.memo<Props>(
  ({ match, form, history }) => {
    const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;
    const [jobs, setJobs] = React.useState<Job[]>([]);
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [stores, setStores] = React.useState<Store[]>([]);
    const employeeId = Number(match.params.employeeId);
    /**
     * 页面加载完成，初始化数据
     */
    React.useEffect(() => {
      // (async () => {
      //   const data = await getEmployee(employeeId);
      //   const { name, jobId, departmentId, storeId, tel, job, ...other } = data;
      //   form.setFieldsValue({
      //     name: name,
      //     tel: tel,
      //     jobId: jobId,
      //     departmentId: departmentId,
      //     storeId: storeId
      //   });
      // })();
    }, []);
    /**
     * 提交
     */
    function handleSubmit() {
      history.goBack();
      // validateFieldsAndScroll(async (err: any, values: Employee) => {
      //   if (err) return;
      //   if (!employeeId) {
      //     await createEmployee(values);
      //   } else {
      //     await upEmployee(values, employeeId);
      //   }
      //   success({
      //     title: employeeId ? '修改员工成功' : '添加员工成功',
      //     okText: employeeId ? '继续修改' : '继续添加',
      //     cancelText: '返回列表',
      //     onCancel: () => history.goBack(),
      //     onOk: () => (employeeId ? console.log('1') : resetFields())
      //   });
      // });
    }

    return (
      <PageLayout
        renderFooter={() => (
          <>
            <Button
              style={{ marginRight: '10px', marginLeft: '10px' }}
              onClick={() => history.goBack()}
            >
              取消
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              确定
            </Button>
          </>
        )}
      >
        <Form>
          <Content className={css.content} padding="large" title="员工基本信息">
            <FormItem label="姓名">
              {getFieldDecorator<Employee>('name', {
                // getValueProps: (value: string) => ({ value: Utils.trim(value) }),
                rules: [
                  { whitespace: true, message: '员工姓名不能为空' },
                  { required: true, message: '员工姓名不能为空' },
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="手机号" hasMargin={false}>
              {getFieldDecorator<Employee>('tel', {
                getValueProps: (value: string) => ({
                  value: Utils.trim(value)
                }),
                rules: [
                  { required: true, message: '员工手机号不能为空' },
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    message: '请输入正确的手机号格式!'
                  }
                ]
              })(<Input disabled={employeeId ? true : false} />)}
            </FormItem>
          </Content>
          <Content className={css.content} padding="large" title="员工职位信息">
            <FormItem label="职位">
              {getFieldDecorator<Employee>('jobId', {
                getValueFromEvent: value => {
                  if (
                    jobs &&
                    jobs.some(item => item.id === value && item.role === 1)
                  ) {
                    form.resetFields(['storeId']);
                  }
                  return value;
                },
                rules: [{ required: true, message: '员工职位不能为空' }]
              })(
                <Select getPopupContainer={triggerNode => triggerNode}>
                  {jobs
                    .filter(item => item.role !== RoleEnum.SuperAdmin)
                    .map(job => {
                      return (
                        <Option key={job.id} value={job.id}>
                          {job.name}
                        </Option>
                      );
                    })}
                </Select>
              )}
            </FormItem>
            <FormItem label="部门">
              {getFieldDecorator<Employee>('departmentId', {
                rules: [{ required: true, message: '员工部门不能为空' }]
              })(
                <Select getPopupContainer={triggerNode => triggerNode}>
                  {departments.map(department => {
                    return (
                      <Option key={department.id} value={department.id}>
                        {department.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="门店" hasMargin={false}>
              {getFieldDecorator<Employee>('storeId', {
                rules: []
              })(
                <Select
                  disabled={
                    jobs &&
                    jobs.some(
                      item =>
                        item.id === form.getFieldValue('jobId') &&
                        item.role === 1
                    )
                  }
                  getPopupContainer={triggerNode => triggerNode}
                >
                  {stores &&
                    stores.map(store => {
                      return (
                        <Option key={store.id} value={store.id}>
                          {store.name}
                        </Option>
                      );
                    })}
                </Select>
              )}
            </FormItem>
          </Content>
        </Form>
      </PageLayout>
    );
  }
);

EmployeeDetail.defaultProps = {};

export default Form.create()(EmployeeDetail);
