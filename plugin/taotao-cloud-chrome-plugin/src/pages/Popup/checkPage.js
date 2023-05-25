/**
 * 用于校验当前页面是否允许使用扩展
 */

const sendMessage = (message) => {
    console.log("图片", chrome.runtime.getURL("icon-128.png"))
    chrome.notifications.create("react-chrome-id", {
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon-128.png"),
        title: "温馨提示",
        message: message,
        eventTime: Date.now() + 2000,
    });

    setTimeout(() => {
        chrome.notifications.clear("react-chrome-id");
    }, 5000);
};

const checkPage = (func) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let tab = tabs.length ? tabs[0] : null;
        if (tab) {
            if (/^(http(s)?|file):\/\//.test(tab.url)) {
                func(tab)
            } else {
                sendMessage("抱歉此工具无法在当前页面使用");
            }
        } else {
            sendMessage("请在标签页内使用");
        }
    });
}

export default checkPage