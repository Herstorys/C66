// 需求：XtXMessage({ message: '恭喜你，这是一条成功消息', type: 'success' })

import { createVNode, render } from 'vue'
import msgbox from './msgbox.vue'

// 方案一: 准备DOM容器 - 传统方式
// const div = document.createElement('div')
// div.setAttribute('class', 'xtx-message-container')
// document.body.appendChild(div)

// 方案二:准备DOM容器 createVNode(h) + render 动态创建标签或者组件
const divVNode = createVNode('div', { class: 'xtx-message-container' })
render(divVNode, document.body)
// 🔔 虚拟DOM(对象)成功写入到页面后，可通过 el 属性获取到真实DOM节点
const div = divVNode.el
// console.log('虚拟DOM', divVNode)
// console.log('真实DOM', div)

const showMessage = ({ message, type }) => {
  // 1. 动态创建虚拟DOM  -  createVNode(h) 函数
  const comVNode = createVNode(msgbox, { message, type })
  // 2. 渲染到body页面中 -  render 函数
  // render(comVNode, document.body)
  render(comVNode, div)
  // 3.提示在 3s 后自动卸载
  setTimeout(() => {
    render(null, div)
  }, 3000)
}

export default showMessage
