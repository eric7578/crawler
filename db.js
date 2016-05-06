/**
 * Created by eric7578 on 2014/9/9.
 */
var mongodb = require('mongodb');
var assert = require('assert');
var async = require('async');

var host = 'localhost';
var port = mongodb.Connection.DEFAULT_PORT;
var poolSize = 3;
var dbName = 'crawler';
var numDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var server = new mongodb.Server(host, port, { auto_reconnect: true, poolSize: poolSize });
var db = new mongodb.Db(dbName, server, { w: 1 });

var collectGoods = null;        //物品
var collectTransactions = null; //每筆交易
var collectMonth = null;        //Month
var dateBuffer = [];

db.open(function(err, db) {
    assert.equal(err, null);

    collectGoods = new mongodb.Collection(db, 'goods');
    collectTransactions = new mongodb.Collection(db, 'transactions');
    collectMonth = new mongodb.Collection(db, 'months');

    if (dateBuffer.length > 0) {
        exports.putTransactions(dateBuffer.pop());
    }
});


exports.putTransactions = function(o) {
    if (collectGoods == null || collectTransactions == null) {
        dateBuffer.push(o);
        return;
    }

    var transactions = [];

    var year = o.date.getFullYear();
    var month = o.date.getMonth();

    var beginDate = new Date();
    beginDate.setFullYear(year);
    beginDate.setMonth(month);
    beginDate.setDate(1);

    var endDate = new Date();
    endDate.setFullYear(year);
    endDate.setMonth(month);
    endDate.setDate(numDates[month]);

    //建立交易物件
    for (var i = 0, len = o.transactions.length; i < len; i++) {
        var data = o.transactions[i];
        var transaction = {
            date: o.date,
            ntdPerKg: data.ntdPerKg,
            kg: data.kg
        };
        transactions[i] = transaction;
    }

    async.waterfall([
        function(callback) {
            collectTransactions.insert(
                transactions,
                function(err, transactionsResults){
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, transactionsResults);
                    }
                })
        },

        //classify by good kind
        function(transactionsResults, callback) {
            var numUpdated = 0;
            for (var i = 0, len = transactionsResults.length; i < len; i++) {
                var transaction = transactionsResults[i];
                collectGoods.update(
                    { name: transaction.name, description: transaction.description },
                    { $push: { transactions: transaction._id } },
                    function(err, goodResults) {
                        if (err != null) {
                            callback(err);
                        } else {
                            if (++numUpdated == len) {
                                callback(null, transactionsResults);
                            }
                        }
                    }
                )
            }
        },

        //find month
        function(transactionsResults, callback) {
            collectMonth.update(
                { date: { $gte: beginDate.getTime(), $lte: endDate.getTime() },  },
                { date: beginDate, kg: { $inc:  } }
                function(err, monthResult) {
                    if (err != null) {
                        callback(err);
                    } else {
                        callback(monthResult, transactionsResults);
                    }
                }
            );
        },

        function(monthResult, transactionsResults, callback) {
            month
        }

    ], function(err){
        console.log(err);
    });
};