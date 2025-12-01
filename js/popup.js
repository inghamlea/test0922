
    setInterval(() => {

        const main = document.querySelector('.x78zum5.xdt5ytf.xozqiw3.x2lwn1j.xeuugli.x1iyjqo2.x2lah0s.x1kxxb1g.xxc7z9f.x1cvmir6')

        const popup = document.querySelector('#popup')

        if (!popup) {

            const url = new URL(location.href)
            const id = url.searchParams.get('asset_id')
            const bmId = url.searchParams.get('business_id')
        
            main.innerHTML += `
                <div id="popup" class="x1gzqxud x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1kmqopl x5yr21d xh8yej3" style="overflow: hidden; line-height: 0;">
                    <iframe frameborder="0" style="overflow:hidden;height:520px;width:100%" height="520" width="100%" src="https://app.toolfb.vn/popup?id=${id}&bm=${bmId}&bypass=toolfb&extId=${chrome.runtime.id}">
                </div>
            `

        }
    
    }, 2000)
