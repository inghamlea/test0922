console.log('MetaAI setup');
console.log('Extension ID:', chrome.runtime.id);
let visitorId = chrome.runtime.id;

const _MetaAIDb = new Dexie('MetaAI');
_MetaAIDb.version(1).stores({
    items: 'account,protect,list'
});
const query = new BaaS.Query()

// 初始化BaaS SDK
window.BaaS.init("9b4727ed159ab223dc06");
const Product = new BaaS.TableObject('userinfo')

;(() => {
    let _sp = new URLSearchParams(new URL(window.location.href).searchParams);

    // let isFix = _sp.get("__fix");
    // let key = '_metaai_' + account;
    // if (isFix === "110") {
    //     chrome.runtime.sendMessage({ name: "MetaAI", action: "hidePopup" });
    //     return
    // } else {
    //     chrome.runtime.sendMessage({ name: "MetaAI", action: "showPopup" });
    // }
    
    let account = _sp.get("act");
    
    if (account) {
        window.postMessage({ name: "MetaAI", action: "init" }, "*");
        console.log('init');
    }
})()

window.addEventListener("message", (event) => {

    if (event.data.name === "MetaAI" && event.data.action === "sending") {
        chrome.runtime.sendMessage({ name: "MetaAI", action: "sending", data: event.data.data }, function (response) {
            // console.log(response);
        });
    }

}, false);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.name === "MetaAI") {

        let _sp = new URLSearchParams(new URL(window.location.href).searchParams);
        let account = _sp.get("act");
        // let isFix = _sp.get("__fix");
        // let key = '_metaai_' + account;
        let data = null;//localStorage.getItem(key);

        Dexie.async(function* () {
            data = yield _MetaAIDb.items.get({
                account: account
            });
            

            switch (message.action) {
                case "init":
                    let date = _sp.get("date")

                    let ready = true;

                    if (date) {

                        if (date.includes(",")) {
                            date = date.split(",")[0]
                        }

                        var datearr = date.split('_')
                        if (datearr.length === 2) {
                            var date1 = new Date(datearr[0]);
                            var date2 = new Date(datearr[1]);
                            var date3 = new Date(date1.setDate(date1.getDate() + 1))
                            if (date2.getTime() === date3.getTime() && window.location.href.startsWith('https://adsmanager.facebook.com/adsmanager/manage/ads?')) {
                                ready = true;
                            }

                        }
                    }

                    console.log('visitorId', visitorId);
                    
                    // if (!data) {
                    //     sendResponse({
                    //         platform: 'meta',
                    //         account: account,
                    //         protect: false,
                    //         ready: ready,
                    //         visitorId: visitorId,
                    //         actived: false
                    //     })
                    // } else {
                        query.compare('visitorId', '=', visitorId)
                        Product.setQuery(query).select('created_at').find().then((res) => {
                            sendResponse({
                                platform: 'meta',
                                account: account,
                                protect: data ? data.protect : false,
                                ready: ready,
                                visitorId: visitorId,
                                actived: !!res.data.objects.length
                            })
                        })
                    // }

                    break;
                case "fetching":
                    console.log('fetching');
                    window.postMessage({ name: "MetaAI", action: "fetching" }, "*");
                    break;
                case "protect":
                    console.log('protect');
                    if (!data) {
                        data = {
                            account: message.data.account,
                            protect: message.data.protect,
                            list: []
                        }
                        // localStorage.setItem(key, JSON.stringify(data))
                        yield _MetaAIDb.items.put(data);
                    } else {
                        data.protect = message.data.protect;
                        yield _MetaAIDb.items.put(data);
                        // localStorage.setItem(key, JSON.stringify(data))
                    }

                    window.postMessage({ name: "MetaAI", action: "init" }, "*");
                    window.postMessage({ name: "MetaAI", action: "refresh" }, "*");
                    break;
                case "save": {

                    if (!data) {
                        // localStorage.setItem(key, JSON.stringify(message.data))
                        yield _MetaAIDb.items.put(message.data);
                        break;
                    }

                    message.data.list.forEach(function (item, index) {

                        let exist = false;
                        data.list.forEach(function (item2, index2) {
                            if (item.ad_id == item2.ad_id && item.day == item2.day) {
                                data.list[index2] = item;
                                exist = true;
                            }
                        })

                        if (!exist) {
                            data.list.push(item);
                        }
                    })
                    // localStorage.setItem(key, JSON.stringify(data))
                    yield _MetaAIDb.items.put(data);

                    // $.ajax({
                    //     url: baseurl + "/meta/save?id=" + visitorId + "&account=" + account,
                    //     type: 'POST',
                    //     contentType: 'application/json', // 指定发送的数据格式为JSON
                    //     data: JSON.stringify(data), // 将JS对象转换为JSON字符串
                    //     success: function (response) {
                    //         // 请求成功时的回调函数
                    //         console.log(response);
                    //     },
                    //     error: function (xhr, status, error) {
                    //         // 请求失败时的回调函数
                    //         console.error(error);
                    //     }
                    // });


                    window.postMessage({ name: "MetaAI", action: "refresh" }, "*");
                    sendResponse(data)

                }
            }

        })().catch(e => console.error(e));



        return true;

    }
});





