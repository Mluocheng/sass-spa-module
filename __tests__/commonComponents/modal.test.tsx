import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow, mount, render, configure } from 'enzyme';
import { act, isDOMComponent } from 'react-dom/test-utils';
import * as Adapter from 'enzyme-adapter-react-16'; 
import Modal from '../../src/components/common/modal';

// 适应React-16
configure({ adapter: new Adapter() });

describe('Modal 通用 测试：', () => {

  describe('Modal message 轻提示方法组件测试：', () => {

    const msgContent = '测试的消息！';
    let closeHandler: () => void;
    let messageConatiner: HTMLDivElement;
  
    // 全部测试用例开始前，执行某个操作
    beforeAll(() => {
      closeHandler = Modal.message({
        content: msgContent,
      });
    });
  
    // 全部测试用例结束后，执行某个操作
    afterAll(() => {
      
    });
  
    // 测试 message 静态方法是否调用成功
    test('测试 message 静态方法是否调用成功：', () => {
  
      messageConatiner = document.body.lastChild as HTMLDivElement;
      const messageDom = messageConatiner.lastChild as HTMLDivElement;
  
      // 期望 message的dom节点为 div
      expect(messageDom.tagName).toBe('DIV');
  
      // 期望 message 渲染的 dom 节点结构
      const firstChild = messageDom.firstChild as HTMLElement;
      const lastChild = messageDom.lastChild as HTMLSpanElement;
      expect(firstChild.tagName).toBe('svg'); // 第一个元素为 svg 标签
      expect(lastChild.tagName).toBe('SPAN'); // 最后一个元素为 span 标签
      expect(lastChild.innerHTML).toBe(msgContent); // span 标签的 innerHTML 等于 msgContent

      // 期望 返回的是一个函数
      expect(typeof closeHandler).toBe('function');

    });
  
    // 测试 message 是否成功关闭
    test('测试 message 是否成功关闭：', () => {

      act(() => {
        if (closeHandler) closeHandler();
      });

      // 期望 关闭后，body已移除messageDom节点
      expect(document.body.childNodes).not.toContain(messageConatiner);

    });
  
  });

});
