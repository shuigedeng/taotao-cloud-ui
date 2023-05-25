export const getAllImage = () => {
    // 存储src属性
    let srcArray = []
    // 获取body中所有的image标签的currentSrc属性
    let bodyImages = document.querySelectorAll('img')
    Array.from(bodyImages).forEach(img => {
        srcArray.push(img.currentSrc)
    })
    // 获取iframes中所有的image标签的currentSrc属性
    let iframes = document.querySelectorAll('iframe')
    Array.from(iframes).forEach(iframe => {
        // 获取当前iframe标签里的img元素
        let iframeImages = iframe.contentDocument.querySelectorAll('img');
        Array.from(iframeImages).forEach(img => {
            srcArray.push(img.currentSrc)
        })
    })

    console.log("图片是：", srcArray)

    return srcArray
}

