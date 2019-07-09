
let option1 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    grid:{
        left:"10%",
        right:"10%"
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data:['实际排放量','排污许可证量']
    },
    xAxis: [
        {
            type: 'category',
            data: ['2009','2010','2011','2012','2013','2014','2015','2016','2017','2018'],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '排放量',
            // min: 0,
            // max: 250,
            // interval: 50,
            // axisLabel: {
            //     formatter: '{value} ml'
            // }
        }
    ],
    series: [
        {
            name:'排污许可证量',
            type:'bar',
            data:[5810000, 5810000, 5810000, 6000000, 6300000, 6300000, 6600000, 6800000, 7000000, 7000000],
            itemStyle: {
                normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#fc7260'
                    }, {
                        offset: 1,
                        color: '#fc9660'
                    }]),
                    barBorderRadius: [50,50,0,0],
                    barWidth: 10,//固定柱子宽度
                    // barWidth: 30,
                    // borderWidth: 0,
                    // borderColor: '#333',
                }
            }
        },
        {
            name:'实际排放量',
            type:'bar',
            data:[5900000, 5900000, 6300000, 6300000, 6600000, 6600000, 6800000, 6800000, 7000000, 7000000],
            itemStyle: {
                normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#35d187'
                    }, {
                        offset: 1,
                        color: '#41e2a4'
                    }]),
                    barBorderRadius: [50,50,0,0],
                    barWidth: 10,//固定柱子宽度
                    // barBorderRadius: 50,
                    // barWidth: 30,
                    // borderWidth: 0,
                    // borderColor: '#333',
                }
            }
        },

    ]
};
let option2 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    color:["#20c9fe","#fca660","#9585fc","#42d5aa","#fc7e60"],
    legend: {
        orient: 'vertical',
        x: 'left',
        data: ['一级标准','二级标准','三级标准',"四级标准","五级标准"]
    },
    series: [
        {
            name:'水质标准',
            type:'pie',
            center: ['50%', '50%'],
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    // position: 'center'
                },
                emphasis: {
                    show: true,

                }
            },
            labelLine: {
                normal: {
                    // show: false
                }
            },
            data:[
                {value:2371, name:'一级标准'},
                {value:3812, name:'二级标准'},
                {value:84584, name:'三级标准'},
                {value:20100, name:'四级标准'},
                {value:6022, name:'五级标准'},
            ]
        },
        {
            name: '外边框',
            type: 'pie',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            center: ['50%', '50%'],
            radius: ['63%', '63%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 9,
                name: '',
                itemStyle: {
                    normal: {
                        borderWidth: 8,
                        borderColor: '#d2e6fc',
                    }
                },
            }]
        }
    ]
};
let option3 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    color:["#fc7d60","#f6d849","#42d5aa","#208efe","#9585fc","#20b2fe"],
    legend: {
        orient: 'vertical',
        x: 'left',
        data: ['化学需氧量','氨氮','总磷','总氮','动植物油','其他']
    },
    series: [
        {
            name:'污染物因子排放占比',
            type:'pie',
            center: ['50%', '50%'],
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    // position: 'center'
                },
                emphasis: {
                    show: true,

                }
            },
            labelLine: {
                normal: {
                    // show: false
                }
            },
            data:[
                {value:60, name:'化学需氧量'},
                {value:32, name:'氨氮'},
                {value:3.2, name:'总磷'},
                {value:3.4, name:'总氮'},
                {value:0.8, name:'动植物油'},
                {value:0.6, name:'其他'},
            ]
        },{
            name: '外边框',
            type: 'pie',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            center: ['50%', '50%'],
            radius: ['63%', '63%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 9,
                name: '',
                itemStyle: {
                    normal: {
                        borderWidth: 8,
                        borderColor: '#d2e6fc',
                    }
                },
            }]
        }
    ]
};
let option4 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    color:["#fca660","#20c9fe","#1fdc91","#9585fc","#42d5aa","#fc7e60"],
    legend: {
        orient: 'vertical',
        x: 'left',
        data: ['暗管','明渠','泵站','涵闸','潜没','其他']
    },
    series: [
        {
            name:'污染物因子排放占比',
            type:'pie',
            center: ['50%', '50%'],
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    // position: 'center'
                },
                emphasis: {
                    show: true,

                }
            },
            labelLine: {
                normal: {
                    // show: false
                }
            },
            data:[
                {value:335, name:'暗管'},
                {value:310, name:'明渠'},
                {value:234, name:'泵站'},
                {value:234, name:'涵闸'},
                {value:234, name:'潜没'},
                {value:234, name:'其他'},
            ]
        },
        {
            name: '外边框',
            type: 'pie',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            center: ['50%', '50%'],
            radius: ['63%', '63%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 9,
                name: '',
                itemStyle: {
                    normal: {
                        borderWidth: 8,
                        borderColor: '#d2e6fc',
                    }
                },
            }]
        }
    ]
};
var data = [
    {
    name: '2009',
    count1: 2372,
    count2: 3812,
    count3: 6021,
    count4: 20100,
    count5: 84584,
},
    {
        name: '2010',
        count1: 2609.2,
        count2: 4193.2,
        count3: 6623.1,
        count4: 22110,
        count5: 93042.4,
    },
    {
        name: '2011',
        count1: 2870.12,
        count2: 4612.52,
        count3: 7285.41,
        count4: 24321,
        count5: 102346.64,
    },
    {
        name: '2012',
        count1: 3157.132,
        count2: 5073.772,
        count3: 8013.951,
        count4: 26753.1,
        count5: 112581.304,
    },
    {
        name: '2013',
        count1: 3472.8452,
        count2: 5581.1492,
        count3: 8815.3461,
        count4: 29428.41,
        count5: 123839.4344,
    },
    {
        name: '2014',
        count1: 3820.12972,
        count2: 6139.26412,
        count3: 9696.88071,
        count4: 32371.251,
        count5: 136223.3778,
    },
    {
        name: '2015',
        count1: 4202.142692 ,
        count2: 6753.190532,
        count3: 10666.56878,
        count4: 35608.3761,
        count5: 149845.7156,
    },
    {
        name: '2016',
        count1: 4622.356961,
        count2: 7428.509585,
        count3: 11733.22566,
        count4: 39169.2137,
        count5: 164830.2872,
    },
    {
        name: '2017',
        count1: 5084.592657,
        count2: 8171.360544,
        count3: 12906.54823,
        count4: 43086.13508,
        count5: 181313.3159,
    },
    {
        name: '2018',
        count1: 5593.051923,
        count2: 8988.496598,
        count3: 14197.20305,
        count4: 47394.74859,
        count5: 199444.6475,
    },
]
var names = data.map(v=>{
    return v.name
});
var count1 =  data.map(v=>{
    return v.count1
});
var count2 =  data.map(v=>{
    return v.count2
});
var count3 =  data.map(v=>{
    return v.count3
});
var count4 =  data.map(v=>{
    return v.count4
});
let option5 = {
    backgroundColor: '#fff',
    color: ['#30abca','#30cab6','#9fe643','#fcc760','#fc9b60'],
    barWidth: 50,
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);',
        textStyle: {
            color: "#333",
        }
    },
    grid: {
        left: '2%',
        right: '2%',
        bottom: '3%',
        top: '30%',
        containLabel: true
    },
    legend: {
        align: 'left',
        position: 'left',
        left: 0,
        top: 30,
    },
    xAxis: {
        type: 'category',
        axisLabel: {
            formatter: function(name) {
                return echarts.format.truncateText(name, 60, '10px Microsoft Yahei', '…');
            }
        },
        data: names
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: true,
            lineStyle: {
                color: ['#f2f2f2']
            }
        },
    },
    series: [{
        type: 'bar',
        name: '化学需氧量',
        stack: '总量',
        data: count1
    },
        {
            type: 'bar',
            name: '氨氮',
            stack: '总量',
            data: count2
        },
        {
            type: 'bar',
            name: '总磷',
            stack: '总量',
            data: count3
        },
        {
            type: 'bar',
            name: '总氮',
            stack: '总量',
            data: count4
        },
        {
            type: 'bar',
            name: '其他',
            stack: '总量',
            data: count4
        }
    ]
};
$(function () {
    // 展示饼状图
    showEchart.setOptionEcharts("bar-charts",option1);
    showEchart.setOptionEcharts("pie-shuizhi",option2);
    showEchart.setOptionEcharts("pie-yinzi",option3);
    showEchart.setOptionEcharts("pie-paifangfangshi",option4);
    showEchart.setOptionEcharts("bar-all-charts",option5);
});
