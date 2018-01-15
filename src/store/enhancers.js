// ======================================================
// Store Enhancers
// 改进仓库 - 开发工具扩展
// ======================================================
const enhancers = []

if (__DEV__) {
  const devToolsExtension = window.devToolsExtension
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

export default enhancers
