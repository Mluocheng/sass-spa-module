/**
 * 本文件定义：公用Hooks
 */
import React from 'react';

export default class Hooks {

  /**
   * 检测底部下划线的宽度
   * @param initWidth
   * @param initLeft
   */
  static useUnderlineWidth<Ele extends HTMLElement>(initWidth: number, initLeft: number): [
    React.RefObject<Ele>, number, number, (index: number) => void
  ] {

    const containerRef = React.useRef<Ele>(null);
    const [lineWidth, setLineWidth] = React.useState<number>(initWidth);
    const [lineLeft, setLineLeft] = React.useState<number>(initLeft);

    return [
      containerRef,
      lineWidth,
      lineLeft,
      (index: number) => {
        const boxNode = containerRef.current;
        const selectChildNode = boxNode.children[index];
        const { left: boxLeft } = boxNode.getBoundingClientRect();
        const { left: itemLeft, width } = selectChildNode.getBoundingClientRect();

        setLineWidth(width);
        setLineLeft(itemLeft - boxLeft);
      },
    ];
  }

  /**
   * 初始化页面高度
   */
  static usePageContentFullHeight<DomNode extends HTMLElement>(): [number, React.RefObject<DomNode>] {
    const boxRef = React.useRef<DomNode>(null);
    const [fullHeight, setMinHeight] = React.useState(400);
    React.useEffect(() => {
      const parentNode = boxRef.current.parentNode as HTMLElement;
      const { height } = parentNode.getBoundingClientRect();
      setMinHeight(height - 20);
    }, []);
    return [fullHeight, boxRef];
  }

}
