## tips
* 注意sw注册的scope，一般需要将sw.js放在根目录，这样就能拦截到全path的fetch事件，否则可能会出现无法触发fetch的情况
* devtool中application面下，有两个勾选项需要注意，一个是update on reload，表示每次刷新页面都会update sw.js文件(卸载，重装)，另一个是bypass for network，表示直接绕过servicework的缓存，直接请求(某次不小心勾选后，一直无法触发serviceworker事件)
