var date_models = require('./date_model');
var crawler = require('./crawler');
var delay = require('./delay');
var child_
/*
var c = crawler.Crawler('page-reader', { maxWorkers: 3 });
c.on('process', onProcess);
c.use(delay(2000, 3000));
c.run(date_models.getNextFormData());
c.run(date_models.getNextFormData());
c.run(date_models.getNextFormData());

function onProcess(data) {
    console.log(data);
    if (date_models.hasNext()) {
        c.run(date_models.getNextFormData());
    } else {
        console.log("全部爬完");
    }
}


//http://amis.afa.gov.tw/
*/
var db = require('./db');
db.putTransactions({ date: '2005-01-03T15:59:18.112Z',
    transactions:
        [ { name: '棗子', describe: '', ntdPerKg: 38, kg: 1200 },
            { name: '釋迦', describe: '', ntdPerKg: 45, kg: 1020 },
            { name: '釋迦', describe: '鳳梨釋迦', ntdPerKg: 42, kg: 400 },
            { name: '小番茄', describe: '聖女', ntdPerKg: 10, kg: 1080 },
            { name: '其他', describe: '', ntdPerKg: 25, kg: 600 },
            { name: '香蕉', describe: '香蕉', ntdPerKg: 24.3, kg: 10770 },
            { name: '鳳梨', describe: '開英', ntdPerKg: 6, kg: 400 },
            { name: '鳳梨', describe: '金鑽鳳梨', ntdPerKg: 12, kg: 1020 },
            { name: '椪柑', describe: '', ntdPerKg: 21.9, kg: 4489.8 },
            { name: '海梨柑', describe: '', ntdPerKg: 16, kg: 1800 },
            { name: '甜橙', describe: '柳橙', ntdPerKg: 12, kg: 2400 },
            { name: '雜柑', describe: '檸檬', ntdPerKg: 16, kg: 300 },
            { name: '葡萄柚', describe: '紅肉', ntdPerKg: 10, kg: 600 },
            { name: '木瓜', describe: '網室紅肉', ntdPerKg: 25, kg: 1420 },
            { name: '梨', describe: '世紀梨', ntdPerKg: 43, kg: 400 },
            { name: '梨', describe: '新興梨', ntdPerKg: 43, kg: 900 },
            { name: '梨', describe: '雪梨', ntdPerKg: 47.2, kg: 9370.8 },
            { name: '番石榴', describe: '珍珠芭', ntdPerKg: 10, kg: 600 },
            { name: '蓮霧', describe: '紅蓮霧', ntdPerKg: 42, kg: 2100 },
            { name: '葡萄', describe: '巨峰', ntdPerKg: 42.7, kg: 290 },
            { name: '西瓜', describe: '大西瓜', ntdPerKg: 6, kg: 11170 },
            { name: '洋香瓜', describe: '網狀紅肉', ntdPerKg: 17, kg: 2820 },
            { name: '洋香瓜', describe: '網狀綠肉', ntdPerKg: 17, kg: 1300 },
            { name: '蘋果', describe: '惠', ntdPerKg: 94.3, kg: 36 },
            { name: '桃子', describe: '早桃', ntdPerKg: 88.8, kg: 36.6 },
            { name: '柿子', describe: '甜柿', ntdPerKg: 101.9, kg: 13252.3 },
            { name: '柿子', describe: '筆柿', ntdPerKg: 35.1, kg: 4499.4 } ],
    subTotal: { averageNtdPerKg: '38.6', averageKg: '74274.9' } });
