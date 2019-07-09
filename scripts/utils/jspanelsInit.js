//popPanel("ASHG","爱森(如东)化工有限公司",'308','232','Extension/Panels/onlineMonitor/default.html','1');
var  jsPanels={
    /**
 * 弹窗实现
 * @Create 曾国范
 * @param {*} id  panel的ID
 * @param {*} title   panel的title
 * @param {*} width   panel宽
 * @param {*} height  panel高
 * @param {*} src    iframe嵌入的html
 */
popPanel: function(id, title, width, height, src,state) {
    //关闭已打开的panel
    if (jsPanel.getPanels().length > 0) {
        let panels = jsPanel.getPanels()
        panels.forEach(item => {
            item.close();
        });
    }
    var  pyLiang=238;
    if(state=="2"){pyLiang=540}
    panel = jsPanel.create({
        id: id,
        //iconfont:'glyphicon',
        headerTitle: "<span style='font-weight:bold;font-size: 14px;'>" + title + "</span>",
        animateIn: 'jsPanelFadeIn',
        position: {
            my: "left-top",
            at: "left-top",
            offsetX: pyLiang,
         //   offsetY: $(".topbar").height() + 80
            offsetY: $(".topbar").height() + 80
        },
        panelSize: {
            width: width,
            height: height
        },
        contentSize: {
            width: width,
            height: height - 30
        },
        resizeit: {
            disable: true
        },
        theme: "primary",
        headerControls: 'closeonly'
        //  {
        //     maximize: 'remove',
        //     normalize: 'remove',
        //     minimize: 'remove',
        //    smallifyrev:'remove'
        // }
        ,

        content: '<iframe src="' + src + '"  id="iframe001" style="width: 100%; height:' + (height - 30) + 'px;border:0px solid transparent"></iframe>'
    });
}
}
