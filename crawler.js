/**
 * Created by yan on 9/2/14.
 */
var child_process = require('child_process');
var util = require('util');
var events = require('events');

var Crawler = function(process, opt) {
    if (!(this instanceof Crawler)) {
        return new Crawler(process, opt);
    }
    this._middlewares = [];
    this._workers = [];
    this._queue = [];
    this.processName = process;
    this.maxWorkers = opt.maxWorkers;
};

util.inherits(Crawler, events.EventEmitter);

Crawler.prototype.use = function(callback) {
    if (typeof callback !== 'function') {
        return;
    }
    this._middlewares.push(callback);
};

Crawler.prototype.run = function(data) {
    this.checkMiddleware(data, 0);
};

Crawler.prototype.checkMiddleware = function(data, index) {
    var self = this;

    if (self._middlewares.length === 0) {
        self.process(data);
        return;
    }

    var fnNext, fnSkip;
    var fnMiddleware = self._middlewares[index++];

    if(index < self._middlewares.length) {
        fnNext = function() {
            self.checkMiddleware(data, index);
        };
    } else {
        fnNext = function() {
            self.process(data);
        };
    }
    fnSkip = function() {
        self.emit('skip', data);
    };

    fnMiddleware(data, fnNext, fnSkip);
};

Crawler.prototype.process = function(data) {
    var self = this;

    if (self._workers.length == self.maxWorkers) {
        self._queue.push(data);
        return;
    }

    var worker = child_process.fork('./' + self.processName + '.js');
    worker.on('message', function(resp) {
        self.emit("process", resp);
        worker.kill();
    });
    worker.on('exit', function() {
        var index = self._workers.indexOf(worker);
        if (index > -1) {
            self._workers.splice(index, 1);
        }
        if (self._queue.length > 0) {
            self.process(self._queue.shift());
        }
    });
    worker.send(data);
};

module.exports = {
    Crawler: Crawler
};