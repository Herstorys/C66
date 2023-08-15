import { defineStore } from "pinia";

export const useLabelTitle = defineStore("labelTitle", {
  state: () => ({
    evaluateViewTitle: "评价",
    navigationTitle: "导航",
    dataCenterTitle: "数据中心",
    manageCenterTitle: "管理中心",
    thermalMapTitle: "热力图分析",
    bufferAnalystTitle: "缓冲区分析",
    compareAnalystTitle: "对比分析",
    userInfoTitle: "用户中心",
    feedbackTitle: "反馈",
    historyTitle: "反馈记录",
    profileTitle: "个人信息",
    logoutTitle: "退出登录",
  }),
});
