export default {
  start: {
    type: "start",
    content: "所有人",
    properties: {
      initiator: [],
      initiatePos: [],
      initiateRole: [],
      title: '发起节点'
    }
  },
  approver: {
    type: "approver",
    content: "请设置审批人",
    properties: {
      title: '审批节点'
    }
  },
  copy: {
    type: 'copy',
    content: '发起人自选',
    properties: {
      title: '抄送人',
      menbers: [],
      userOptional: true
    }
  },
  timer: {
    type: 'timer',
    content: '请设置时间',
    properties: {
      title: '定时器',
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    }
  },
  subFlow: {
    type: 'subFlow',
    content: '请设置发起人',
    properties: {
      title: '子流程'
    }
  },
  interflow: {
    type: "approver",
    content: "请设置审批人",
    isInterflow: true,
    properties: {
      title: '审批节点'
    }
  },
  condition: {
    type: "condition",
    content: "请设置条件",
    properties: {
      title: '条件',
      conditions: [],
      initiator: null
    }
  },
  branch: {
    type: "branch",
    content: "",
    properties: {}
  },
  empty: {
    type: "empty",
    content: "",
    properties: {}
  }
}