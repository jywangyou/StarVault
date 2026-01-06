// 当单击按钮时，此脚本在当前活动选项卡中打开一个侧面板。
const [tab] = await chrome.tabs.query({// 获取当前活动选项卡
  active: true,// 仅获取活动选项卡
  lastFocusedWindow: true// 仅获取最后一个聚焦的窗口中的选项卡
});

const tabId = tab.id;// 获取活动选项卡的ID
const button = document.getElementById('openSidePanel');
button.addEventListener('click', async () => {
  await chrome.sidePanel.open({ tabId });// 打开侧面板
  await chrome.sidePanel.setOptions({
    tabId,
    path: 'sidepanel-tab.html',
    enabled: true// 设置侧面板内容页面
  });
});
