/**
 * Created by yan on 9/5/14.
 */

//查詢的資料群組
var queryDates = [];
var dds = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
for (var yy = 104; yy >= 94; yy--) {
    for (var mm = 12; mm >= 1; mm--) {
        var ddMax = dds[mm - 1];
        if (mm == 2 && yy % 4 === 0) {
            ddMax = 29;
        }
        for (var dd = ddMax; dd >= 1; dd--) {
            queryDates[queryDates.length] = [yy, mm, dd];
        }
    }
}

module.exports = {
    hasNext: function() {
        return queryDates.length > 0;
    },
    getNextFormData: function() {
        return queryDates.pop();
    }
};