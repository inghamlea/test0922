(() => {
	window.ah.proxy({
		onResponse: function(response, handler) {
				// 仅处理广告数据相关请求
				
				if (response.config.url.includes('reporting?')) {
						handler.next(null);
				} else {
						handler.next(response);
				}
		}
	});
	
if(window.location.href.includes('/adsmanager/reporting/')){
    
	let timer = null;
	let count = 5

	timer = setInterval(() => {
			window.__preloaderData = {}
			window.__pendingPreloaders = {}
			
			if(count-- <= 0){
					clearInterval(timer)
			}
	}, 500)
}
	})