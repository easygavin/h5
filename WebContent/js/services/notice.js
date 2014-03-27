/**
 * 资讯服务
 */
define(function (require, exports, module) {

  var path = require('path');

    /**
     * 获取公告列表
     * @param callback
     */
    var getNoticeList = function (callback) {

        // 请求参数
        var data = {
            "platform":path.platform,
            "channelNo":path.channelNo
        };

        // 请求公告列表
        var request = $.ajax({
            type:"GET",
            url:path.NOTICE_LIST,
            data:{data:JSON.stringify(data)},
            dataType:"jsonp",
            success:callback,
            error:callback
        });
      return request;
    };

    /**
     * 获取公告详情
     * @param noticeId
     * @param callback
     */
    var getNoticeDetail = function (noticeId, callback) {

        // 请求参数
        var data = {
            "noticeId":noticeId
        };

        // 请求公告详情
        var request = $.ajax({
            type:"GET",
            url:path.NOTICE_DETAIL,
            data:{data:JSON.stringify(data)},
            dataType:"jsonp",
            success:callback,
            error:callback
        });
      return request;
    };

    return {
        getNoticeList:getNoticeList,
        getNoticeDetail:getNoticeDetail
    };
});
