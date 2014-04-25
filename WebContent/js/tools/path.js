/**
 * APP Path
 */
define(function (require, exports, module) {

  var NOTICE_SERVER_URL = "http://gj.caipiao123.com.cn/";

  /*
  * UAT环境 :     //uatjc.ecp888.com/
  * 中间件地址
  * 内部测试环境： http://192.168.1.115:8080/middle_web/
  * 东莞测试环境： //mw.cpocp.com/
  * */
  var MIDDLEWARE = "http://192.168.1.115:8080/middle_web/";

  module.exports = {
    // 用于设置图片路径
    NOTICE_SERVER_URL: NOTICE_SERVER_URL,
    // 客户端激活接口
    USER_ACTIVE: MIDDLEWARE + "gjdigit/user/reg/0/saveClientActiveRecord.shtml",
    // 用户登录接口
    USER_LOGIN: MIDDLEWARE + "gjuser/login/0/servantLogin.shtml",
    // 用户注销接口
    USER_LOGOUT: MIDDLEWARE + "gjuser/login/0/logout.shtml",
    // 用户注册接口
    USER_REG: MIDDLEWARE + "gjuser/reg/0/reg.shtml",
    // 修改登录密码接口
    CHANG_PWD: MIDDLEWARE + "gjuser/reg/0/changePw.shtml",
    //修改昵称接口
    UPDATE_NICK_NAME: MIDDLEWARE + "gjuser/setNickName.shtml",
    //修改提款密码
    UPDATE_WITHDRAWAL: MIDDLEWARE + "gjuser/changeDrawPw.shtml",
    // 获取账户余额/提款资料接口
    GET_BALANCE: MIDDLEWARE + "gjuser/blance/0/getBlance.shtml",
    // 获取银行列表接口
    GET_BANKS: MIDDLEWARE + "gjuser/bindbankcard/3/getBanks.shtml",
    //优惠券接口
    GET_COUPONS: MIDDLEWARE + "coupon/getCouponList.shtml",

    //通过token查找用户信息接口
    GET_USER_BY_TOKEN: MIDDLEWARE + "gjuser/getUserInfoByToken.shtml",

    // 获取银行卡省市列表接口
    GET_BANK_LOCUS: MIDDLEWARE + "gjuser/bindbankcard/3/getBankLocus.shtml",
    // 绑定银行卡接口
    BIND_BANK_CARD: MIDDLEWARE + "gjuser/bindbankcard/2/bindBankCard.shtml",
    // 绑定身份证接口
    BIND_PERSON_CARD: MIDDLEWARE + "gjuser/bindidcard/0/bindPersonCard.shtml",
    // 获取身份证信息接口
    GET_CARD_ID: MIDDLEWARE + "gjuser/bindidcard/0/getCardId.shtml",
    // 提款接口
    DRAWING: MIDDLEWARE + "gjuser/drawmoneys/3/drawing.shtml",
    // 发送验证码接口
    SEND_MSG_TO_PHONE: MIDDLEWARE + "gjuser/bindphoneno/0/sendMsgToPhone.shtml",
    // 绑定手机号码接口
    VALIDATE_CODE: MIDDLEWARE + "gjuser/bindphoneno/0/validateCodeOfBindMebile.shtml",
    // 获取用户帐户明细
    GET_ACCOUNT_DETAIL: MIDDLEWARE + "gjdigit/user/member!getAccountDetail.shtml",
    // 获取用户购彩记录
    BUY_AWARD: MIDDLEWARE + "gjdigit/user/buyaward!index.shtml",
    // 获取购彩/合买方案详情接口
    AWARD_DETAIL: MIDDLEWARE + "gjjczq!detail.shtml",
    // 获取方案奖金优化详情接口
    JJYH_DETAIL: MIDDLEWARE + "gjjczq!jjyhdetail.shtml",
    // 支付宝快捷登陆接口
    SHORT_CUT_LOGIN: MIDDLEWARE + "gjuser/shortcutlogin/0/wireless.shtml",
    // 用户反馈建议接口
    FEEDBACK: MIDDLEWARE + "gjuser/customerasks/1/ask.shtml",
    // 合买大厅列表接口
    GROUP_BUY: MIDDLEWARE + "gjdigit/group-buy/api/index.shtml",
    // 合买认购接口
    GROUP_SUBSCRIBE: MIDDLEWARE + "gjjczq!subscribe.shtml",
    // 获取数字/高频彩当前期号信息接口
    GET_CURRENT_LOTTERY: MIDDLEWARE + "gjdigit/lotteryissue!getCurrentLottery.shtml",
    // 获取高频彩上期开奖号码及遗漏数据接口
    GET_LAST_ISSUE_MSG: MIDDLEWARE + "gjdigit/lotteryissue!getLastIssueMessage.shtml",
    // 获取幸运赛车前一/位置奖金接口
    GET_RACING_POS_AWARD: MIDDLEWARE + "gjdigit/lotteryissue!getXYSCJiangjinInfo.shtml",
    // 数字/高频彩投注接口
    DIGIT_BUY: MIDDLEWARE + "gjdigit/buy.shtml",
    // 数字/高频方案详情
    SUBSCRIBE_ORDER: MIDDLEWARE + "gjdigit/partner/api/subscribeorder.shtml",
    // 数字/高频方案详情可追期列表
    ALL_ISSUE: MIDDLEWARE + "gjdigit/group-buy/api/allissue.shtml",
    // 数字彩某期开奖详情接口
    GET_DIGIT_NB: MIDDLEWARE + "gjdigit/lotteryissue!getDigitKjNumber.shtml",
    // 数字/高频彩复活追号接口
    ADD_BUY_DIGIT: MIDDLEWARE + "gjdigit/buy!addBuyDigit.shtml",
    // 彩种开奖列表接口
    AWARD_LIST: MIDDLEWARE + "gjkj!allkj.shtml",
    // 彩种历史开奖列表接口
    AWARD_LIST_ISSUE: MIDDLEWARE + "gjdigit/lotteryissue!getKjNumberByIsscout.shtml",
    // 用户中奖信息
    USER_AWARD_INFO: MIDDLEWARE + "gjkj!getzjuser.shtml",
    // 当前期彩种的销售信息
    GET_LOTTERY_INFO: MIDDLEWARE + "gjkj!allkjbyhtml5.shtml",
    // 彩种的开奖等级信息
    GET_LOTTERY_LEVEL_INFO: MIDDLEWARE + "gjkj!getzjlevel.shtml",
    // 竞彩足球对阵接口
    //JCZQ_GAME_LIST: MIDDLEWARE + "gjjczq!betlist.shtml",
    JCZQ_GAME_LIST: MIDDLEWARE + 'gjjclq!betbyfootwalllist.shtml',
    //竞彩足球购买接口.
    JCZQ_GAME_BUY: MIDDLEWARE + "gjjczq.shtml",
    // 竞彩足球对阵情报分析
    JCZQ_AGAINST: MIDDLEWARE + "gjdata/gjdata!index.shtml",
    // 竞彩足球购彩记录
    JCZQ_DETAIL: MIDDLEWARE + "gjjczq!detail.shtml",
    // 竞彩足球开奖结果接口
    JCZQ_LOTTERY_RECORD: MIDDLEWARE + "gjjczq!kjlist.shtml",
    // 竞彩足球赛事对阵开奖SP值.
    JCZQ_SP_LOTTERY: MIDDLEWARE + "gjjczq!kjsp.shtml",
    // 竞彩蓝球对阵接口
    JCLQ_GAME_LIST: MIDDLEWARE + "gjjclq!betlist.shtml",
    // 竞彩蓝球购买
    JCLQ_GAME_BUY: MIDDLEWARE + "gjjclq.shtml",
    // 竞彩蓝球购彩记录
    JCLQ_DETAIL: MIDDLEWARE + "gjjclq!detail.shtml",
    // 竞彩篮球历史开奖列表接口
    JCLQ_AWARD_LIST_ISSUE: MIDDLEWARE + "gjjclq!kjlist.shtml",
    // 竞彩篮球历史开奖详情SP值
    JCLQ_AWARD_DETAIL_SP: MIDDLEWARE + "gjjclq!kjsp.shtml",
    // 获取冠军竞猜对阵列表
    GJJ_GET_MATCH_LIST: MIDDLEWARE + "sportsfootballguanjun/gj/getGjMatch.shtml",
    // 冠军竞猜投注
    GJJ_TO_BUY: MIDDLEWARE + "sportsfootballguanjun/gjgg/createGuanjunProject.shtml",
    // 冠军竞猜方案详情
    GJJ_GET_PROJECT_DETAIL: MIDDLEWARE + "sportsfootballguanjun/gj/getProjectDetail.shtml",
    // 获取合买数据列表接口.
    HM_DETAIL_LIST:MIDDLEWARE+"gjdigit/group-buy/api/index.shtml",
    //数字彩合买详情接口
    DIGIT_HM_DETAIL:MIDDLEWARE+"gjdigit/partner/api/subscribeorder.shtml",
    //竞彩足球合买详情接口
    JCZQ_HM_DETAIL:MIDDLEWARE+"gjjczq!detail.shtml",
    //竞彩篮球合买详情接口
    JCLQ_HM_DETAIL:MIDDLEWARE+"gjjclq!detail.shtml",
    //北京单场合买详情接口
    BJDC_HM_DETAIL:MIDDLEWARE+"gjzcbd/gjbd!detail.shtml",
    //北京单场/传统足球合买详情接口
    TRADITIONAL_BALL_HM_DETAIL:MIDDLEWARE+"gjzcbd/gjzc!detail.shtml",
    //参与合买接口{所有彩种共一个接口}
    JOIN_HM_ACTION:MIDDLEWARE+"gjjczq!subscribe.shtml",
    // 活动公告列表接口
    NOTICE_LIST: NOTICE_SERVER_URL + "gjgonggao/app/notic_app!index.shtml",
    // 活动公告详情接口
    NOTICE_DETAIL: NOTICE_SERVER_URL + "gjgonggao/app/notic_app!show.shtml",

    // 渠道号/推荐人
    channelNo: "H5",
    // 平台类型
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