// import { Classify } from 'api/interface';
import { ProductCategory } from 'api/interface/product'; 

export default class Utils {

  /**
   * 通过classId查找选中class
   * @param classList
   * @param classId
   * @return selected
   */
  static getClassByClassId(classList: ProductCategory[], classId: number): null | ProductCategory {
    let selected = null;
    classList.forEach(function setChild(classify: ProductCategory) {
      if (classify.id === classId) {
        selected = classify;
        return;
      }
      if (classify.children && classify.children.length) {
        classify.children.forEach(setChild);
      }
    });
    return selected;
  }


  /**
   * 判断某个分类是否是选中状态
   * @param classify
   * @param selectClassId
   */
  static isSelected(classify: ProductCategory, selectClassId: number): boolean {
    if (classify.id === selectClassId) return true;
    if (!classify.children || !classify.children.length) return false;
    return classify.children.some(item => Utils.isSelected(item, selectClassId));
  }


  /**
 * 通过classId判断是否是一级分类 是否有二级分类
 * @param classList
 * @param classId
 * @return selected
 */
  static getLeavClassByClassId(classList: ProductCategory[], classId: number) {
    let indexOf = false; // 是否是一级分类
    let isChildren = false; //  是否有二级分类
    let isLeaveChild = { indexOf, isChildren };
    classList.forEach((item) => {
      if (item.id === classId) {
        isLeaveChild.indexOf = true;
        isLeaveChild.isChildren = (!item.children || !(item.children.length === 0));
      }
    });
    return isLeaveChild;
  }


}
