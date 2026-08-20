import type {DictItem} from '@/types/api.types';

interface DictLabelOptions {
  labelKey?: string;
  valueKey?: string;
  childrenKey?: string;
}

/** 递归查找字典标签 */
export function showDictLabel(
  data: DictItem[],
  value: string | number,
  options: DictLabelOptions = {},
): string {
  const {
    labelKey = 'dictLabel',
    valueKey = 'dictValue',
    childrenKey = 'children',
  } = options;
  const actions: string[] = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if ((item as any)[valueKey] === `${value}`) {
      actions.push((item as any)[labelKey]);
      break;
    }
    const children = (item as any)[childrenKey];
    if (children && children.length) {
      const action = showDictLabel(children, value, {
        labelKey,
        valueKey,
        childrenKey,
      });
      if (action) {
        actions.push(action);
        break;
      }
    }
  }
  return actions.join('');
}

/** 字典树转扁平 map { value: label } */
export function mapDict(
  data: DictItem[],
  options: DictLabelOptions = {},
): Record<string, string> {
  const {
    labelKey = 'dictLabel',
    valueKey = 'dictValue',
    childrenKey = 'children',
  } = options;
  const result: Record<string, string> = {};
  const traverse = (list: DictItem[]) => {
    list.forEach(item => {
      const val = (item as any)[valueKey];
      const label = (item as any)[labelKey];
      if (val !== undefined) {
        result[String(val)] = label;
      }
      const children = (item as any)[childrenKey];
      if (children && children.length) {
        traverse(children);
      }
    });
  };
  traverse(data);
  return result;
}
