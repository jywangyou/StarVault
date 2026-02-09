// 插件安装或更新时创建右键菜单
function ensureScanAlarm() {
  chrome.alarms.get('reminder-scan', (alarm) => {
    if (!alarm) {
      chrome.alarms.create('reminder-scan', { periodInMinutes: 1 })
    }
  })
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'openSidePanel',
      title: "繁星记",
      contexts: ['all']
    });
  });
  ensureScanAlarm()
});

chrome.runtime.onStartup.addListener(() => {
  ensureScanAlarm()
})

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openSidePanel') {
    // 打开当前窗口的侧边栏
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// 监听来自内容脚本的消息以打开侧边栏
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'open_side_panel') {
    (async () => {
      await chrome.sidePanel.open({ tabId: sender.tab.id });
      await chrome.sidePanel.setOptions({
        tabId: sender.tab.id,
        path: 'sidepanel-tab.html',
        enabled: true
      });
      sendResponse({ ok: true });
    })();
    return true;
  }

  if (message.type === 'schedule_reminder') {
    const task = message.task
    if (!task?.date || !task?.time || !task?.id) {
      sendResponse({ ok: false })
      return false
    }

    const [year, month, day] = task.date.split('-').map(Number)
    const [hour, minute] = task.time.split(':').map(Number)
    if (year && month && day && hour !== undefined && minute !== undefined) {
      const alarmTime = new Date(year, month - 1, day, hour, minute).getTime()
      const when = Math.max(alarmTime, Date.now() + 1000)
      const alarmName = `reminder-${task.id}`
      
      chrome.alarms.create(alarmName, { when })
      
      // Check if created successfully
      setTimeout(() => {
        chrome.alarms.get(alarmName, (alarm) => {
          sendResponse({ ok: !!alarm, when: alarm?.scheduledTime ?? when })
        })
      }, 50)
      return true
    }

    sendResponse({ ok: false })
    return false
  }
});

// 用户点击扩展图标时触发
chrome.action.onClicked.addListener((tab) => {
    // 在当前窗口打开侧边栏
    chrome.sidePanel.open({ windowId: tab.windowId });
});

// 监听定时提醒
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name);
  if (alarm.name === 'reminder-scan') {
    chrome.storage.local.get(['reminders', 'notifiedReminders'], (result) => {
      const reminders = result.reminders || []
      const notifiedReminders = result.notifiedReminders || {}
      const now = Date.now()
      const nextNotified = {}

      reminders.forEach((task) => {
        const [year, month, day] = task.date?.split('-').map(Number) || []
        const [hour, minute] = task.time?.split(':').map(Number) || []
        if (!year || !month || !day || hour === undefined || minute === undefined) return
        const when = new Date(year, month - 1, day, hour, minute).getTime()
        
        // Check if time has passed (within last 2 minutes to allow for scan delay) 
        // and not yet notified
        if (when <= now && when > now - 120000 && !notifiedReminders[task.id]) {
          chrome.notifications.create(task.id, {
            type: 'basic',
            iconUrl: 'images/logo-128.png',
            title: '日程提醒',
            message: `${task.description}\n时间: ${task.time}`,
            priority: 2,
            requireInteraction: true
          })
          nextNotified[task.id] = now
        } else if (notifiedReminders[task.id]) {
          // Keep history of notified items
          nextNotified[task.id] = notifiedReminders[task.id]
        }
      })

      chrome.storage.local.set({ notifiedReminders: nextNotified })
    })
    return
  }
  if (alarm.name.startsWith('reminder-')) {
    const taskId = alarm.name.replace('reminder-', '')
    
    chrome.storage.local.get(['reminders', 'notifiedReminders'], (result) => {
      const reminders = result.reminders || []
      const task = reminders.find(t => t.id === taskId)
      const notifiedReminders = result.notifiedReminders || {}
      
      if (task) {
        console.log('Showing notification for task:', task)
        chrome.notifications.create(taskId, {
          type: 'basic',
          iconUrl: 'images/logo-128.png',
          title: '日程提醒',
          message: `${task.description}\n时间: ${task.time}`,
          priority: 2,
          requireInteraction: true
        })
        notifiedReminders[task.id] = Date.now()
        chrome.storage.local.set({ notifiedReminders })
      } else {
        console.log('Task not found for notification:', taskId)
      }
    })
  }
});