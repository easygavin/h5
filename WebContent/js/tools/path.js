/**
 * APP Path
 */
define(function (require, exports, module) {
  // 管家服务器地址
  // 管家测试："http://uatjc.ecp888.com/" 管家正式："http://gj.cpocp.com/"
  var SERVER_URL = "http://uatjc.ecp888.com/";

  // 公告服务器地址
  // 公告测试："" 公告正式："http://gj.caipiao123.com.cn/";
  var NOTICE_SERVER_URL = "http://gj.caipiao123.com.cn/";

  // 中间件接口地址.
  var MIDDLEWARE = "http://mw.cpocp.com/";

  module.exports = {
    // 用于设置图片路径
    NOTICE_SERVER_URL: NOTICE_SERVER_URL,
    // 客户端激活接口
    USER_ACTIVE: SERVER_URL + "gjdigit/user/reg/0/saveClientActiveRecord.shtml",
    // 用户登录接口
    USER_LOGIN: SERVER_URL + "gjuser/login/0/servantLogin.shtml",
    // 用户注销接口
    USER_LOGOUT: SERVER_URL + "gjuser/login/0/logout.shtml",
    // 用户注册接口
    USER_REG: SERVER_URL + "gjuser/reg/0/reg.shtml",
    // 修改登录密码接口
    CHANG_PWD: SERVER_URL + "gjuser/reg/0/changePw.shtml",
    //修改昵称接口
    UPDATE_NICK_NAME:SERVER_URL+"gjuser/setNickName.shtml",
    //修改提款密码
    UPDATE_WITHDRAWAL:SERVER_URL+"gjuser/changeDrawPw.shtml",
    // 获取账户余额/提款资料接口
    GET_BALANCE: MIDDLEWARE + "gjuser/blance/0/getBlance.shtml",
    // 获取银行列表接口
    GET_BANKS: SERVER_URL + "gjuser/bindbankcard/3/getBanks.shtml",
    //优惠券接口
    GET_COUPONS:SERVER_URL+"coupon/getCouponList.shtml",

    //通过token查找用户信息接口
    GET_USER_BY_TOKEN: SERVER_URL + "gjuser/getUserInfoByToken.shtml",

    // 获取银行卡省市列表接口
    GET_BANK_LOCUS: SERVER_URL + "gjuser/bindbankcard/3/getBankLocus.shtml",
    // 绑定银行卡接口
    BIND_BANK_CARD: SERVER_URL + "gjuser/bindbankcard/2/bindBankCard.shtml",
    // 绑定身份证接口
    BIND_PERSON_CARD: SERVER_URL + "gjuser/bindidcard/0/bindPersonCard.shtml",
    // 获取身份证信息接口
    GET_CARD_ID: SERVER_URL + "gjuser/bindidcard/0/getCardId.shtml",
    // 提款接口
    DRAWING: SERVER_URL + "gjuser/drawmoneys/3/drawing.shtml",
    // 发送验证码接口
    SEND_MSG_TO_PHONE: SERVER_URL + "gjuser/bindphoneno/0/sendMsgToPhone.shtml",
    // 绑定手机号码接口
    VALIDATE_CODE: SERVER_URL + "gjuser/bindphoneno/0/validateCodeOfBindMebile.shtml",
    // 获取用户帐户明细
    GET_ACCOUNT_DETAIL: SERVER_URL + "gjdigit/user/member!getAccountDetail.shtml",
    // 获取用户购彩记录
    BUY_AWARD: SERVER_URL + "gjdigit/user/buyaward!index.shtml",
    // 获取购彩/合买方案详情接口
    AWARD_DETAIL: SERVER_URL + "gjjczq!detail.shtml",
    // 获取方案奖金优化详情接口
    JJYH_DETAIL: SERVER_URL + "gjjczq!jjyhdetail.shtml",
    // 支付宝快捷登陆接口
    SHORT_CUT_LOGIN: SERVER_URL + "gjuser/shortcutlogin/0/wireless.shtml",
    // 用户反馈建议接口
    FEEDBACK: SERVER_URL + "gjuser/customerasks/1/ask.shtml",
    // 合买大厅列表接口
    GROUP_BUY: SERVER_URL + "gjdigit/group-buy/api/index.shtml",
    // 合买认购接口
    GROUP_SUBSCRIBE: SERVER_URL + "gjjczq!subscribe.shtml",
    // 获取数字/高频彩当前期号信息接口
    GET_CURRENT_LOTTERY: SERVER_URL + "gjdigit/lotteryissue!getCurrentLottery.shtml",
    // 获取高频彩上期开奖号码及遗漏数据接口
    GET_LAST_ISSUE_MSG: SERVER_URL + "gjdigit/lotteryissue!getLastIssueMessage.shtml",
    // 获取幸运赛车前一/位置奖金接口
    GET_RACING_POS_AWARD: SERVER_URL + "gjdigit/lotteryissue!getXYSCJiangjinInfo.shtml",
    // 数字/高频彩投注接口
    DIGIT_BUY: SERVER_URL + "gjdigit/buy.shtml",
    // 数字/高频方案详情
    SUBSCRIBE_ORDER: SERVER_URL + "gjdigit/partner/api/subscribeorder.shtml",
    // 数字/高频方案详情可追期列表
    ALL_ISSUE: SERVER_URL + "gjdigit/group-buy/api/allissue.shtml",
    // 数字彩某期开奖详情接口
    GET_DIGIT_NB: SERVER_URL + "gjdigit/lotteryissue!getDigitKjNumber.shtml",
    // 数字/高频彩复活追号接口
    ADD_BUY_DIGIT: SERVER_URL + "gjdigit/buy!addBuyDigit.shtml",
    // 彩种开奖列表接口
    AWARD_LIST: SERVER_URL + "gjkj!allkj.shtml",
    // 彩种历史开奖列表接口
    AWARD_LIST_ISSUE: SERVER_URL + "gjdigit/lotteryissue!getKjNumberByIsscout.shtml",
    // 用户中奖信息
    USER_AWARD_INFO: MIDDLEWARE + "gjkj!getzjuser.shtml",
    // 当前期彩种的销售信息
    GET_LOTTERY_INFO: MIDDLEWARE + "gjkj!allkjbyhtml5.shtml",
    // 彩种的开奖等级信息
    GET_LOTTERY_LEVEL_INFO: MIDDLEWARE + "gjkj!getzjlevel.shtml",
    // 竞彩足球对阵接口
    //JCZQ_GAME_LIST: SERVER_URL + "gjjczq!betlist.shtml",
    JCZQ_GAME_LIST: MIDDLEWARE + 'gjjclq!betbyfootwalllist.shtml',
    //竞彩足球购买接口.
    JCZQ_GAME_BUY: MIDDLEWARE + "gjjczq.shtml",
    // 竞彩足球对阵情报分析
    JCZQ_AGAINST: MIDDLEWARE + "gjdata/gjdata!index.shtml",
    // 竞彩足球购彩记录
    JCZQ_DETAIL: MIDDLEWARE + "gjjczq!detail.shtml",
    // 竞彩足球开奖结果接口
    JCZQ_LOTTERY_RECORD: NOTICE_SERVER_URL + "gjjczq!kjlist.shtml",
    // 竞彩足球赛事对阵开奖SP值.
    JCZQ_SP_LOTTERY: NOTICE_SERVER_URL + "gjjczq!kjsp.shtml",
    // 竞彩蓝球对阵接口
    JCLQ_GAME_LIST: SERVER_URL + "gjjclq!betlist.shtml",
    // 竞彩蓝球购买
    JCLQ_GAME_BUY: SERVER_URL + "gjjclq.shtml",
    // 竞彩蓝球购彩记录
    JCLQ_DETAIL: SERVER_URL + "gjjclq!detail.shtml",
    // 竞彩篮球历史开奖列表接口
    JCLQ_AWARD_LIST_ISSUE: NOTICE_SERVER_URL + "gjjclq!kjlist.shtml",
    // 竞彩篮球历史开奖详情SP值
    JCLQ_AWARD_DETAIL_SP: NOTICE_SERVER_URL + "gjjclq!kjsp.shtml",
    // 获取冠军竞猜对阵列表
    GJJ_GET_MATCH_LIST: SERVER_URL + "sportsfootballguanjun/gj/getGjMatch.shtml",
    // 冠军竞猜投注
    GJJ_TO_BUY: SERVER_URL + "sportsfootballguanjun/gjgg/createGuanjunProject.shtml",
    // 冠军竞猜方案详情
    GJJ_GET_PROJECT_DETAIL: SERVER_URL + "sportsfootballguanjun/gj/getProjectDetail.shtml",

    // 活动公告列表接口
    NOTICE_LIST: NOTICE_SERVER_URL + "gjgonggao/app/notic_app!index.shtml",
    // 活动公告详情接口
    NOTICE_DETAIL: NOTICE_SERVER_URL + "gjgonggao/app/notic_app!show.shtml",

    // 请求参数
    // 平台类型
    channelNo: "H5",
    // 渠道号/推荐人
    platform: "e",
    // 手机型号
    cellphoneType: "sdk",
    // sim 卡号
    simCd: "89014103211118510720",
    // 手机屏幕大小
    resolution: "480*800",
    // 手机物理地址
    macAddr: "7C:61:93:F6:64:00",
    // 手机序列号
    imei: "355067048777916"
  };
});