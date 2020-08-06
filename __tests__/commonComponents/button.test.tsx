import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow, mount, render, configure } from 'enzyme';
import { act, isDOMComponent } from 'react-dom/test-utils';
import * as Adapter from 'enzyme-adapter-react-16'; 
import Button from '../../src/components/common/button';

// 适应React-16
configure({ adapter: new Adapter() }); 

// Button
describe('Button 测试：', () => {

  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  // 一个测试用例
  // 组件渲染 是否正确，
  // 和点击事件是否执行
  test('组件渲染 是否正确，和点击事件是否执行：', () => {

    const text = '按钮的名称';
    let clicked = false;

    // 执行动作
    act(() => {
      ReactDOM.render(
        <Button onClick={() => {
          clicked = true;
        }} >{text}</Button>, 
        container
      );
    });

    // 测试 是否可以正确渲染Button组件
    const button = container.querySelector('button');
    const firstChild = button.childNodes[0] as HTMLSpanElement;

    // expect 期望
    expect(isDOMComponent(button)).toBe(true);
    expect(button.tagName).toBe('BUTTON');
    expect(isDOMComponent(firstChild)).toBe(true);
    expect(firstChild.tagName).toBe('SPAN');
    expect(firstChild.innerHTML).toBe(text);

    // 测试点击事件是否正确执行，并调用onClick回调函数
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(clicked).toBe(true);

  });

  // 测试primary类型的button是否成功渲染
  test('测试primary类型的button是否成功渲染：', () => {

    const item = shallow(<Button type="primary">测试</Button>);
    item.hasClass('ant-btn-primary');

  });

});
  
