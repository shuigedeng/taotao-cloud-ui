interface TreeOptions {
  key?: string;
  parentKey?: string;
  children?: string;
  isTree?: boolean;
}

const defaultOptions: Required<TreeOptions> = {
  key: 'id',
  parentKey: 'parentId',
  children: 'children',
  isTree: false,
};

type TreeNode = Record<string, any>;

/** 将树型结构转换成一维数组 */
export function tree2List(
  treeData: TreeNode[],
  options: TreeOptions = {},
): TreeNode[] {
  const props = {...defaultOptions, ...options};
  let listData: TreeNode[] = [];
  treeData.forEach(item => {
    listData.push(item);
    const children = item[props.children];
    if (children && children.length > 0) {
      listData = [...listData, ...tree2List(children, props)];
    }
  });
  return listData;
}

/** 将一维数组转换成树型结构 */
export function list2Tree(
  listData: TreeNode[],
  options: TreeOptions = {},
): TreeNode[] {
  const props = {...defaultOptions, ...options};
  const obj: Record<string, TreeNode> = {};
  listData.forEach(item => {
    obj[item[props.key]] = item;
  });
  const treeData: TreeNode[] = [];
  for (let i = 0; i < listData.length; i++) {
    const item = listData[i];
    const parent = obj[item[props.parentKey]];
    if (parent) {
      if (parent[props.children]) {
        parent[props.children].push(item);
      } else {
        parent[props.children] = [item];
      }
    } else {
      treeData.push(item);
    }
  }
  return treeData;
}

/** 查找指定节点 */
export function getNodeByKey(
  key: string | number,
  treeData: TreeNode[],
  options: TreeOptions = {},
): TreeNode | null {
  const props = {...defaultOptions, ...options};
  if (!treeData || treeData.length === 0) {
    return null;
  }
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    if (node[props.key] === key) {
      return node;
    }
    const children = node[props.children];
    if (children && children.length > 0) {
      const targetNode = getNodeByKey(key, children, props);
      if (targetNode) {
        return targetNode;
      }
    }
  }
  return null;
}

/** 获取节点下的所有子节点（扁平） */
export function getChildrenByKey(
  key: string | number,
  treeData: TreeNode[],
  options: TreeOptions = {},
): TreeNode[] {
  const props = {...defaultOptions, ...options};
  const targetNode = getNodeByKey(key, treeData, props);
  if (!targetNode) {
    return [];
  }
  const children = targetNode[props.children];
  if (children && children.length > 0) {
    return tree2List(children, props);
  }
  return [];
}

/** 深度遍历每个节点 */
export function forEachNode(
  treeData: TreeNode[] | undefined,
  callback: (node: TreeNode, siblings: TreeNode[]) => void,
  options: TreeOptions = {},
): void {
  if (!treeData) {
    return;
  }
  const props = {...defaultOptions, ...options};
  treeData.forEach(item => {
    callback(item, treeData);
    const children = item[props.children];
    forEachNode(children, callback, props);
  });
}

/** 深度 map 每个节点 */
export function mapNode(
  treeData: TreeNode[] | undefined,
  callback: (node: TreeNode, siblings: TreeNode[]) => TreeNode,
  options: TreeOptions = {},
): TreeNode[] {
  if (!treeData) {
    return [];
  }
  const props = {...defaultOptions, ...options};
  return treeData.map(item => ({
    ...callback(item, treeData),
    children: mapNode(item[props.children], callback, props),
  }));
}

/** 过滤树 */
export function filterTree(
  treeData: TreeNode[] | undefined,
  callback: (node: TreeNode, siblings: TreeNode[]) => boolean,
  options: TreeOptions = {},
): TreeNode[] {
  if (!treeData) {
    return [];
  }
  const props = {...defaultOptions, ...options};
  const selectedNodes: TreeNode[] = [];
  forEachNode(
    treeData,
    (item, siblings) => {
      if (callback(item, siblings)) {
        const rest = {...item};
        delete rest[props.children];
        selectedNodes.push(rest);
      }
    },
    props,
  );
  return list2Tree(selectedNodes, props);
}

/** 获取所有父节点链 */
export function getParentNodes(
  key: string | number,
  data: TreeNode[],
  options: TreeOptions & {immediate?: boolean} = {},
): TreeNode[] {
  if (!key && key !== 0) {
    return [];
  }
  const props = {...defaultOptions, immediate: false, ...options};
  const listData = props.isTree ? tree2List(data, props) : data;
  const targetNode = listData.find(item => item[props.key] === key);
  if (!targetNode) {
    return [];
  }
  const parentNode = listData.find(
    item => item[props.key] === targetNode[props.parentKey],
  );
  if (!parentNode) {
    return [];
  }
  if (props.immediate) {
    return [parentNode];
  }
  return [
    ...getParentNodes(parentNode[props.key], listData, {
      ...props,
      isTree: false,
    }),
    parentNode,
  ];
}
