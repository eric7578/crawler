//http://amis.afa.gov.tw/t-asp/v201q.asp

var iconv = require('iconv-lite');
var request = require('request');
var jsdom = require('jsdom');

var jquery = ['https://code.jquery.com/jquery-2.1.1.min.js'];
var date = null;

process.on('message', onFormRequest);

function onFormRequest(data) {
    date = new Date();
    date.setFullYear(data[0] + 1911);
    date.setMonth(data[1] - 1);
    date.setDate(data[2]);

    var strYear = data[0].toString();
    while (strYear.length < 3) strYear = "0" + strYear;

    var strMonth = data[1].toString();
    while (strMonth.length < 2) strMonth = "0" + strMonth;

    var strDay = data[2].toString();
    while (strDay.length < 2) strDay = "0" + strDay;

    request.post(
        'http://amis.afa.gov.tw/t-asp/v201r.asp',
        {
            form: {
                //本期
                myy: strYear,
                mmm: strMonth,
                mdd: strDay,

                //上期
                myy1: strYear,
                mmm1: strMonth,
                mdd1: strDay,

                //市場合併
                rb1: 2,

                //全部產品
                rb2: 1
            },
            encoding: null
        },
        onResponse);
}

function onResponse(err, resp, bytes) {
    if (err !== null) {
        return;
    }
    var html = iconv.decode(bytes, 'BIG5');
    jsdom.env(html, jquery, onJSDomReady);
}

function onJSDomReady(err, window) {
    if (err == null) {
        onJQueryLoaded(window.$);
    }
}

function onJQueryLoaded($) {
    var parseResult = {
        date: date,
        transactions: [],
        subTotal: {}
    };

    var $rows = $('table>tbody').eq(1).children('tr');
    var lastIndex = $rows.size() - 1;

    $rows.each(function(index) {
        if (index < 2) {
            return;
        }

        var $td = $(this).children('td');

        var name = $td.eq(0)
            .eq(0)
            .text()
            .trim()
            .replace('&nbsp', '');

        if (name != '') {
            var describe = $td
                .eq(1)
                .text()
                .trim()
                .replace('&nbsp', '');

            var ntdPerKg = parseFloat($td
                .eq(2)
                .text()
                .trim()
                .replace('&nbsp', ''));

            var kg = parseFloat($td
                .eq(6)
                .text()
                .trim()
                .replace('&nbsp', ''));

            if (index < lastIndex) {
                parseResult.transactions.push({
                    name: name,
                    describe: describe,
                    ntdPerKg: ntdPerKg,
                    kg: kg
                });
            } else {
                parseResult.subTotal.averageNtdPerKg = ntdPerKg;
                parseResult.subTotal.averageKg = kg;
            }
        }
    });

    process.send(parseResult);
}
