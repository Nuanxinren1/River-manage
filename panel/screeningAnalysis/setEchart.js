var showEchart={
    // 变量
    echartId:null,
    // 方法定义
    /**
     * 获取dom句柄,最先调用这个
     * @returns {*}
     */
    getEchartById:function (id) {
        let echartHandle=echarts.init(document.getElementById(id));
        return echartHandle;
    },
    /**
     * 生成图表
     */
    setOptionEcharts:function (id,options) {
        // 给句柄赋值
        this.echartId=this.getEchartById(id);
        // 当有句柄的时候 ,生成图表
        if(this.echartId)
            this.echartId.setOption(this.getOptionEcharts(options));
        return;
    },
    /**
     * 获取图表配置
     */
    getOptionEcharts:function (options) {
        return options;
    },
    /**
     * 获取数据
     * @param data
     * @returns {*}
     */
    getEchartsData:function (data) {
        return data;
    },
    setResize:function (id) {
        // 给句柄赋值
        this.echartId=this.getEchartById(id);
        this.echartId.resize();
    }


};
