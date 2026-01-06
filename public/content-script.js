const button = new DOMParser().parseFromString(
  '<button>Click to open side panel</button>',
  'text/html'
).body.firstElementChild;
button.addEventListener('click', function () {
  chrome.runtime.sendMessage({ type: 'open_side_panel' });// Send message to service worker to open side panel
});
document.body.append(button);
