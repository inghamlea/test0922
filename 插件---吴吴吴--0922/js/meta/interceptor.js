// Meta广告拦截器
// 用于拦截和修改Meta广告平台的数据

(function() {
    'use strict';

    // 数据库初始化
    const MetaDB = new Dexie('MetaAI');
    MetaDB.version(1).stores({
        items: 'account,protect,list'
    });

    // 广告数据拦截处理
    function handleAdData(response) {
        const urlParams = new URLSearchParams(window.location.search);
        const account = urlParams.get('act');
        const date = urlParams.get('date');

        if (!account || !date) return response;

        return Dexie.async(function*() {
            // 获取数据库中的广告数据
            const dbData = yield MetaDB.items.get({
                account: account
            });

            if (!dbData || !dbData.protect) return response;

            // 处理广告数据
            const adData = response.body;
            if (!adData || !adData.data) return response;

            // 修改广告数据
            adData.data.forEach(item => {
                const savedItem = dbData.list.find(saved => 
                    saved.ad_id === item.id && 
                    saved.day === date
                );

                if (savedItem) {
                    // 更新展示数据
                    item.impressions += parseInt(savedItem.inflated.impressions || 0);
                    item.reach += parseInt(savedItem.inflated.reach || 0);
                    item.clicks += parseInt(savedItem.inflated.clicks || 0);
                    item.spend += parseFloat(savedItem.inflated.spend || 0);

                    // 更新转化数据
                    if (item.actions && savedItem.inflated.action) {
                        savedItem.inflated.action.forEach(inflatedAction => {
                            const action = item.actions.find(a => a.action_type === inflatedAction.name);
                            if (action) {
                                action.value += parseInt(inflatedAction.value || 0);
                            }
                        });
                    }
                }
            });

            return response;
        })();
    }

    // 拦截Ajax请求
    ah.proxy({
        onResponse: function(response, handler) {
            // 仅处理广告数据相关请求
            if (response.config.url.includes('/ads/manager/api/')) {
                handleAdData(response).then(modifiedResponse => {
                    console.log('modifiedResponse', modifiedResponse);
                    
                    handler.next(modifiedResponse);
                });
            } else {
                handler.next(response);
            }
        }
    });

})();