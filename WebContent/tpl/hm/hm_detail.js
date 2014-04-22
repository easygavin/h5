define(function(){ return function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="hmBox" style="font-size: 1.0em">\r\n  <p class="bl3">发起人：' +
((__t = (data.createUser)) == null ? '' : __t) +
'</p>\r\n  <P>\r\n    中奖总金额：<i style="color:red">\r\n    ' +
((__t = (data.createUserWinAmount)) == null ? '' : __t) +
'</i>元\r\n  </p>\r\n  <p>中奖次数：<i style="color:red">' +
((__t = (data.createUserWinCount)) == null ? '' : __t) +
'</i>次</p>\r\n  <p class="f16">方案编号：' +
((__t = (data.lotteryNo)) == null ? '' : __t) +
'</p>\r\n  <p>发起时间：' +
((__t = (data.createDate)) == null ? '' : __t) +
'</p>\r\n  <p>方案总金额：<i style="color:red">' +
((__t = (data.totalAmount)) == null ? '' : __t) +
'</i>元</p>\r\n  <P>提成：<i style="color:red">' +
((__t = (data.commPercent)) == null ? '' : __t) +
'</i>%</p>\r\n  <p>共<i style="color:red">\r\n    ' +
((__t = (data.totalCount)) == null ? '' : __t) +
'</i>份,剩余<i style="color:red">\r\n    ' +
((__t = (data.totalCount-data.buyVolume)) == null ? '' : __t) +
'</i>份,&nbsp;每份金额：<i style="color:red">\r\n    ' +
((__t = (data.oneAmount)) == null ? '' : __t) +
'</i>元</p>\r\n  <p>\r\n    进度：<i class="jdbox">\r\n    <i style="width:' +
((__t = ((data.buyVolume/data.totalCount).toFixed(1)*100)) == null ? '' : __t) +
'%"></i> </i>\r\n    ' +
((__t = (((parseInt(data.buyVolume)/parseInt(data.totalCount))*100).toFixed(2))) == null ? '' : __t) +
'%+(保)\r\n    ' +
((__t = (((parseInt(data.holdVolume)/parseInt(data.totalCount))*100).toFixed(2))) == null ? '' : __t) +
'%\r\n  </p>\r\n</div>\r\n\r\n<table cellpadding="0" cellspacing="0" width="100%" class="line30 tabp bt3">\r\n  ';
if(display_flag=='jc'){;
__p += '\r\n  <colgroup>\r\n    <col width=\'70%\'>\r\n    <col width=\'20%\'>\r\n    <col width=\'10%\'>\r\n  </colgroup>\r\n  <thead>\r\n  <tr>\r\n    <td colspan="3">' +
((__t = (data.title)) == null ? '' : __t) +
'' +
((__t = (data.issueNo)) == null ? '' : __t) +
'期<span class="fr">' +
((__t = (data.passWay)) == null ? '' : __t) +
'</span></td>\r\n  </tr>\r\n  </thead>\r\n  <tbody>\r\n\r\n  ';
if(typeof data.detail!='undefined'&&typeof data.detail.content!='undefined'){;
__p += '\r\n\r\n  ';

  for(var i = 0, len = data.detail.length; i < len; i++) {
  var content = data.detail[i].content.replace(/{/g, '<span class="cdd1049">').replace(/}/g, '</span>').replace(/\n/g, '<br>');
  ;
__p += '\r\n  <tr>\r\n    <td>' +
((__t = (content)) == null ? '' : __t) +
'</td>\r\n    <td>' +
((__t = (data.detail[i].score)) == null ? '' : __t) +
'</td>\r\n    <td class="cdd1049">' +
((__t = (data.detail[i].dan)) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  ';
};
__p += '\r\n  ';
}else {;
__p += '\r\n  <tr>\r\n    ';
if(data.openState=='1'){;
__p += '\r\n    <td class="cdd1049">跟单后公开</td>\r\n    ';
}else if(data.openState=='1'){;
__p += '\r\n    <td class="cdd1049">截止后公开</td>\r\n    ';
}else if(data.openState='3'){;
__p += '\r\n    <td class="cdd1049">不公开</td>\r\n    ';
};
__p += '\r\n  </tr>\r\n  ';
};
__p += '\r\n\r\n  </tbody>\r\n  ';
}else if(display_flag='digit'){;
__p += '\r\n  <tr>\r\n    <td style=\'text-align:center;\'>' +
((__t = (data.title)) == null ? '' : __t) +
'</td>\r\n  </tr>\r\n  <tr>\r\n    <td>\r\n      <div style=\'overflow:auto;height:200px;\'>\r\n        ' +
((__t = (data.detail.replace(/\#/g,'<br>'))) == null ? '' : __t) +
'\r\n      </div>\r\n    </td>\r\n  </tr>\r\n  ';
};
__p += '\r\n</table>\r\n\r\n<div class="w45"></div>';

}
return __p
}});