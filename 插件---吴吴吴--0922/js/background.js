chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.name === "MetaAI") {
			if(message.action === "hidePopup"){
				// 禁用插件按钮
				chrome.action.disable();
				// 隐藏插件图标
				console.log(chrome, chrome.action);
				
				chrome.action?.hide?.();
				// 关闭所有插件相关的窗口
				chrome.windows.getAll({populate: true}, (windows) => {
						windows.forEach((window) => {
								if (window.type === 'popup') {
										chrome.windows.remove(window.id);
								}
						});
				});
			} else if(message.action === "showPopup"){
				// 启用插件按钮
				chrome.action.enable();
				// 显示插件图标
				chrome.action?.show?.();
			}
    }
});