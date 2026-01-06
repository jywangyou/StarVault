// 插件安装或更新时创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: "打开侧边栏",
    contexts: ['all']
  });
  chrome.tabs.create({ url: 'page.html' });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openSidePanel') {
    // 打开当前窗口的侧边栏
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// 监听来自内容脚本的消息以打开侧边栏
chrome.runtime.onMessage.addListener((message, sender) => {
  // 使用异步函数处理消息
  (async () => {
    if (message.type === 'open_side_panel') {
      // 打开发送消息的标签页的侧边栏
      await chrome.sidePanel.open({ tabId: sender.tab.id });
      // 设置侧边栏的选项
      await chrome.sidePanel.setOptions({
        tabId: sender.tab.id,
        path: 'sidepanel-tab.html',
        enabled: true// 设置侧边栏内容页面
      });
    }
  })();
});

// 用户点击扩展图标时触发
chrome.action.onClicked.addListener((tab) => {
    // 在当前窗口打开侧边栏
    chrome.sidePanel.open({ windowId: tab.windowId });
});
