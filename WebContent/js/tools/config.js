/**
 * 配置
 */
define(function (require, exports, module) {
  var config = {};
  // 首页菜单列表
  config.menus = {
    def: "digit",
    list: [
      {
        key: "custom", // 标示
        title: "我的定制", // 标题
        focus: false // 焦点
      },
      // 我的定制
      {key: "digit", title: "数字彩", focus: true},
      // 数字彩
      {key: "athletics", title: "竞技彩", focus: false},
      // 竞技彩
      {key: "freq", title: "高频彩", focus: false},
      // 高频彩
      {key: "info", title: "资讯", focus: false} // 资讯
    ]};

  // 菜单对于彩种
  config.menusLottery = {
    digit: ["ssq", "dlt", "f3d", "pl3"],
    athletics: ["jcl", "jcz", "gjj"],
    freq: ["syy", "syx"]
  };

  // 彩种信息设置
  config.lotteryMap = {
    ssq: { // 双色球
      key: "ssq", // 标示
      lotteryId: "11", // 彩种
      name: "双色球", // 名称
      desc: "2元能中1000万", // 说明
      logo: "images/ssq.png", // 图标
      hasDetail: true, // 需要显示上期开奖号码
      hasLevels: true, // 是否有中奖等级
      paths: {
        ball: {js: 'digit/ssq/ball', tpl: '../../../views/digit/ssq/ball.html'},
        list: {js: 'digit/ssq/list', tpl: '../../../views/digit/ssq/list.html'},
        intro: {js: 'digit/intro', tpl: '../../views/digit/intro/ssq.html'}
      },
      localKey: "local_ssq",
      modes: { // 模式
        def: "0", // 默认模式
        list: { // 模式列表
          "0": {key: "0", name: "普通投注", shows: [
            {id: "0", desc: "红", yl: "漏"},
            {id: "2", desc: "蓝", yl: ""}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "1", playType: "2", betType: "1",
            desc: "红球区-至少选择6个，篮球区-至少选择1个",
            tips: "请至少选择一注,最多选择20个红球"
          },
          "1": {key: "1", name: "胆拖投注", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""},
            {id: "2", desc: "蓝球", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "1",
            desc: "红球-胆码区-至少选择1个，最多5个，拖码区-至少选择1个，蓝球区-至少选择1个",
            tips: "请至少选择一注,胆码不能超过5个球"
          }
        }
      }
    },
    dlt: { // 大乐透
      key: "dlt",
      lotteryId: "13",
      name: "大乐透",
      desc: "2元能中500万",
      logo: "images/dlt.png",
      hasDetail: true,
      hasLevels: true, // 是否有中奖等级
      paths: {
        ball: {js: 'digit/dlt/ball', tpl: '../../../views/digit/dlt/ball.html'},
        list: {js: 'digit/dlt/list', tpl: '../../../views/digit/dlt/list.html'},
        intro: {js: 'digit/intro', tpl: '../../views/digit/intro/dlt.html'}
      },
      localKey: "local_dlt",
      modes: { // 模式
        def: "0", // 默认模式
        list: { // 模式列表
          "0": {key: "0", name: "普通投注", shows: [
            {id: "0", desc: "红", yl: "漏"},
            {id: "2", desc: "蓝", yl: ""}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "1", playType: "2", betType: "1",
            desc: "前区-至少选择5个，后区-至少选择2个",
            tips: "请至少选择一注,最多选择20个红球"
          },
          "1": {key: "1", name: "胆拖投注", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""},
            {id: "2", desc: "胆", yl: ""},
            {id: "3", desc: "拖", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "1",
            desc: "前区-胆码区-至少选择1个，最多4个，拖码区-至少选择1个，后区-胆码区-最多1个，拖码区-至少选择2个",
            tips: "请至少选择一注,胆码不能超过4个球"
          }
        }
      }
    },
    f3d: { // 福彩3D
      key: "f3d",
      lotteryId: "12",
      name: "福彩3D",
      desc: "天天开奖",
      logo: "images/f3d.png",
      hasDetail: true,
      hasLevels: true, // 是否有中奖等级
      paths: {
        ball: {js: 'digit/three/ball', tpl: '../../../views/digit/three/ball.html'},
        list: {js: 'digit/three/list', tpl: '../../../views/digit/three/list.html'},
        intro: {js: 'digit/intro', tpl: '../../views/digit/intro/f3d.html'}
      },
      localKey: "local_f3d",
      modes: { // 模式
        def: "0", // 默认模式
        list: { // 模式列表
          "0": {key: "0", name: "直选", shows: [
            {id: "0", desc: "百位", yl: "漏"},
            {id: "1", desc: "十位", yl: ""},
            {id: "2", desc: "个位", yl: ""}
          ], rdm: true, omit: true, omitIndex: 6, omitKey: "9", playType: "2", betType: "1",
            desc: "每位至少选1个",
            tips: "请至少选择一注"
          },
          "1": {key: "1", name: "组三", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "1", playType: "2", betType: "3",
            desc: "至少选择2个号码",
            tips: "请至少选择一注"
          },
          "2": {key: "2", name: "组六", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "2", playType: "2", betType: "4",
            desc: "至少选择3个号码，单注奖金160元",
            tips: "请至少选择一注"
          },
          "3": {key: "3", name: "直选胆拖", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "1",
            desc: "由1-2个胆拖加n个拖码组成",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          "4": {key: "4", name: "组三胆拖", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "3",
            desc: "由1个胆码加n个拖码组成",
            tips: "请至少选择一注,胆码不能超过1个球"
          },
          "5": {key: "5", name: "组六胆拖", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "4",
            desc: "由1-2个胆码加n个拖码组成",
            tips: "请至少选择一注,胆码不能超过2个球"
          }
        }
      }
    },
    pl3: { // 排列3
      key: "pl3",
      lotteryId: "4",
      name: "排列3",
      desc: "好玩易中",
      logo: "images/pl3.png",
      hasDetail: true,
      hasLevels: true, // 是否有中奖等级
      paths: {
        ball: {js: 'digit/three/ball', tpl: '../../../views/digit/three/ball.html'},
        list: {js: 'digit/three/list', tpl: '../../../views/digit/three/list.html'},
        intro: {js: 'digit/intro', tpl: '../../views/digit/intro/pl3.html'}
      },
      localKey: "local_pl3",
      modes: { // 模式
        def: "0", // 默认模式
        list: { // 模式列表
          "0": {key: "0", name: "直选", shows: [
            {id: "0", desc: "百位", yl: "漏"},
            {id: "1", desc: "十位", yl: ""},
            {id: "2", desc: "个位", yl: ""}
          ], rdm: true, omit: true, omitIndex: 6, omitKey: "9", playType: "2", betType: "1",
            desc: "每位至少选择1个号码，单注奖金1000元",
            tips: "请至少选择一注"
          },
          "1": {key: "1", name: "组三", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "1", playType: "2", betType: "3",
            desc: "至少选择2个号码，单注奖金320元",
            tips: "请至少选择一注"
          },
          "2": {key: "2", name: "组六", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "2", playType: "2", betType: "4",
            desc: "至少选择3个号码，单注奖金160元",
            tips: "请至少选择一注"
          },
          "3": {key: "3", name: "直选胆拖", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "1",
            desc: "由1-2个胆码加n个拖码组成",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          "4": {key: "4", name: "组三胆拖", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "3",
            desc: "由1个胆码加n个拖码组成",
            tips: "请至少选择一注,胆码不能超过1个球"
          },
          "5": {key: "5", name: "组六胆拖", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "4",
            desc: "由1-2个胆码加n个拖码组成",
            tips: "请至少选择一注,胆码不能超过2个球"
          }
        }
      }
    },
    syy: { // 十一运夺金
      key: "syy",
      lotteryId: "31",
      name: "十一运夺金",
      desc: "10分钟一期",
      logo: "images/syy.png",
      hasDetail: true,
      hasLevels: false, // 是否有中奖等级
      paths: {
        ball: {js: 'freq/five/ball', tpl: '../../../views/freq/five/ball.html'},
        list: {js: 'freq/five/list', tpl: '../../../views/freq/five/list.html'},
        intro: {js: 'freq/intro', tpl: '../../views/freq/intro/syy.html'},
        smart: {js: 'freq/five/smart', tpl: '../../../views/freq/five/smart.html'}
      },
      localKey: "local_syy",
      modes: { // 模式
        def: "4", // 默认模式
        list: { // 模式列表
          "0": {key: "0", name: "任一", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "201", ctxKey: "201", bonus: 13, playType: "1", betType: "1",
            desc: "至少选择1个号码，单注奖金13元",
            tips: "请至少选择一注"
          },
          "1": {key: "1", name: "任二", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "202", bonus: 6, playType: "1", betType: "1",
            desc: "至少选择2个号码，单注奖金6元",
            tips: "请至少选择一注"
          },
          "2": {key: "2", name: "任三", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "203", bonus: 19, playType: "1", betType: "1",
            desc: "至少选择3个号码，单注奖金19元",
            tips: "请至少选择一注"
          },
          "3": {key: "3", name: "任四", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "204", bonus: 78, playType: "1", betType: "1",
            desc: "至少选择4个号码，单注奖金78元",
            tips: "请至少选择一注"
          },
          "4": {key: "4", name: "任五", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "205", bonus: 540, playType: "1", betType: "1",
            desc: "至少选择5个号码，单注奖金540元",
            tips: "请至少选择一注"
          },
          "5": {key: "5", name: "任六", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "206", bonus: 90, playType: "1", betType: "1",
            desc: "至少选择6个号码，单注奖金90元",
            tips: "请至少选择一注"
          },
          "6": {key: "6", name: "任七", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "207", bonus: 26, playType: "1", betType: "1",
            desc: "至少选择7个号码，单注奖金26元",
            tips: "请至少选择一注"
          },
          "7": {key: "7", name: "任八", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "208", bonus: 9, playType: "1", betType: "1",
            desc: "至少选择8个号码，单注奖金9元",
            tips: "请至少选择一注"
          },
          "8": {key: "8", name: "前三直选", shows: [
            {id: "0", desc: "一", yl: "漏"},
            {id: "1", desc: "二"},
            {id: "2", desc: "三"}
          ], rdm: true, omit: true, omitIndex: 2, omitKey: "511", ctxKey: "511", bonus: 1170, playType: "1", betType: "1",
            desc: "每位至少选择1个号码，单注奖金1170元",
            tips: "请至少选择一注"
          },
          "9": {key: "9", name: "前三组选", shows: [
            {id: "0", desc: "选号"}
          ], rdm: true, omit: false, ctxKey: "501", bonus: 195, playType: "1", betType: "1",
            desc: "至少选择3个号码，单注奖金195元",
            tips: "请至少选择一注"
          },
          "10": {key: "10", name: "前二直选", shows: [
            {id: "0", desc: "一", yl: "漏"},
            {id: "1", desc: "二"}
          ], rdm: true, omit: true, omitIndex: 3, omitKey: "411", ctxKey: "411", bonus: 130, playType: "1", betType: "1",
            desc: "每位至少选择1个号码，单注奖金130元",
            tips: "请至少选择一注"
          },
          "11": {key: "11", name: "前二组选", shows: [
            {id: "0", desc: "选号"}
          ], rdm: true, omit: false, ctxKey: "401", bonus: 65, playType: "1", betType: "1",
            desc: "至少选择2个号码，单注奖金65元",
            tips: "请至少选择一注"
          },
          "12": {key: "12", name: "前三直选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "512", bonus: 1170, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金1170元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          "13": {key: "13", name: "前三组选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "502", bonus: 195, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金195元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          "14": {key: "14", name: "前二直选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "412", bonus: 130, playType: "1", betType: "1",
            desc: "由1个胆码加n个拖码组成，单注奖金130元",
            tips: "请至少选择一注,胆码不能超过1个球"
          },
          "15": {key: "15", name: "前二组选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "402", bonus: 65, playType: "1", betType: "1",
            desc: "由1个胆码加n个拖码组成，单注奖金65元",
            tips: "请至少选择一注,胆码不能超过1个球"
          },
          "16": {key: "16", name: "任二胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "302", bonus: 6, playType: "1", betType: "1",
            desc: "由1个胆码加n个拖码组成，单注奖金6元",
            tips: "请至少选择一注,胆码不能超过1个球"
          },
          "17": {key: "17", name: "任三胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "303", bonus: 19, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金19元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          "18": {key: "18", name: "任四胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "304", bonus: 78, playType: "1", betType: "1",
            desc: "由1-3个胆码加n个拖码组成，单注奖金78元",
            tips: "请至少选择一注,胆码不能超过3个球"
          },
          "19": {key: "19", name: "任五胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "305", bonus: 540, playType: "1", betType: "1",
            desc: "由1-4个胆码加n个拖码组成，单注奖金540元",
            tips: "请至少选择一注,胆码不能超过4个球"
          },
          "20": {key: "20", name: "任六胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "306", bonus: 90, playType: "1", betType: "1",
            desc: "由1-5个胆码加n个拖码组成，单注奖金90元",
            tips: "请至少选择一注,胆码不能超过5个球"
          },
          "21": {key: "21", name: "任七胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "307", bonus: 26, playType: "1", betType: "1",
            desc: "由1-6个胆码加n个拖码组成，单注奖金26元",
            tips: "请至少选择一注,胆码不能超过6个球"
          },
          "22": {key: "22", name: "任八胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "308", bonus: 9, playType: "1", betType: "1",
            desc: "由1-7个胆码加n个拖码组成，单注奖金9元",
            tips: "请至少选择一注,胆码不能超过7个球"
          }
        }
      }
    },
    syx: { // 十一选5
      key: "syx",
      lotteryId: "34",
      name: "十一选5",
      desc: "10分钟一期",
      logo: "images/syx.png",
      hasDetail: true,
      hasLevels: true, // 是否有中奖等级
      paths: {
        ball: {js: 'freq/five/ball', tpl: '../../../views/freq/five/ball.html'},
        list: {js: 'freq/five/list', tpl: '../../../views/freq/five/list.html'},
        intro: {js: 'freq/intro', tpl: '../../views/freq/intro/syx.html'},
        smart: {js: 'freq/five/smart', tpl: '../../../views/freq/five/smart.html'}
      },
      localKey: "local_syx",
      modes: { // 模式
        def: "4", // 默认模式
        list: { // 模式列表
          "0": {key: "0", name: "任一", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "201", ctxKey: "201", bonus: 13, playType: "1", betType: "1",
            desc: "至少选择1个号码，单注奖金13元",
            tips: "请至少选择一注"
          },
          "1": {key: "1", name: "任二", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "202", bonus: 6, playType: "1", betType: "1",
            desc: "至少选择2个号码，单注奖金6元",
            tips: "请至少选择一注"
          },
          "2": {key: "2", name: "任三", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "203", bonus: 19, playType: "1", betType: "1",
            desc: "至少选择3个号码，单注奖金19元",
            tips: "请至少选择一注"
          },
          "3": {key: "3", name: "任四", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "204", bonus: 78, playType: "1", betType: "1",
            desc: "至少选择4个号码，单注奖金78元",
            tips: "请至少选择一注"
          },
          "4": {key: "4", name: "任五", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "205", bonus: 540, playType: "1", betType: "1",
            desc: "至少选择5个号码，单注奖金540元",
            tips: "请至少选择一注"
          },
          "5": {key: "5", name: "任六", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "206", bonus: 90, playType: "1", betType: "1",
            desc: "至少选择6个号码，单注奖金90元",
            tips: "请至少选择一注"
          },
          "6": {key: "6", name: "任七", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "207", bonus: 26, playType: "1", betType: "1",
            desc: "至少选择7个号码，单注奖金26元",
            tips: "请至少选择一注"
          },
          "7": {key: "7", name: "任八", shows: [
            {id: "0", desc: "选号", yl: "漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "208", bonus: 9, playType: "1", betType: "1",
            desc: "至少选择8个号码，单注奖金9元",
            tips: "请至少选择一注"
          },
          "8": {key: "8", name: "前三直选", shows: [
            {id: "0", desc: "一", yl: "漏"},
            {id: "1", desc: "二"},
            {id: "2", desc: "三"}
          ], rdm: true, omit: true, omitIndex: 2, omitKey: "511", ctxKey: "511", bonus: 1170, playType: "1", betType: "1",
            desc: "每位至少选择1个号码，单注奖金1170元",
            tips: "请至少选择一注"
          },
          "9": {key: "9", name: "前三组选", shows: [
            {id: "0", desc: "选号"}
          ], rdm: true, omit: false, ctxKey: "501", bonus: 195, playType: "1", betType: "1",
            desc: "至少选择3个号码，单注奖金195元",
            tips: "请至少选择一注"
          },
          "10": {key: "10", name: "前二直选", shows: [
            {id: "0", desc: "一", yl: "漏"},
            {id: "1", desc: "二"}
          ], rdm: true, omit: true, omitIndex: 3, omitKey: "411", ctxKey: "411", bonus: 130, playType: "1", betType: "1",
            desc: "每位至少选择1个号码，单注奖金130元",
            tips: "请至少选择一注"
          },
          "11": {key: "11", name: "前二组选", shows: [
            {id: "0", desc: "选号"}
          ], rdm: true, omit: false, ctxKey: "401", bonus: 65, playType: "1", betType: "1",
            desc: "至少选择2个号码，单注奖金65元",
            tips: "请至少选择一注"
          },
          "12": {key: "12", name: "前三直选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "512", bonus: 1170, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金1170元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          "13": {key: "13", name: "前三组选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "502", bonus: 195, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金195元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          "14": {key: "14", name: "前二直选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "412", bonus: 130, playType: "1", betType: "1",
            desc: "由1个胆码加n个拖码组成，单注奖金130元",
            tips: "请至少选择一注,胆码不能超过1个球"
          },
          "15": {key: "15", name: "前二组选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "402", bonus: 65, playType: "1", betType: "1",
            desc: "由1个胆码加n个拖码组成，单注奖金65元",
            tips: "请至少选择一注,胆码不能超过1个球"
          },
          "16": {key: "16", name: "任二胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "302", bonus: 6, playType: "1", betType: "1",
            desc: "由1个胆码加n个拖码组成，单注奖金6元",
            tips: "请至少选择一注,胆码不能超过1个球"
          },
          "17": {key: "17", name: "任三胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "303", bonus: 19, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金19元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          "18": {key: "18", name: "任四胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "304", bonus: 78, playType: "1", betType: "1",
            desc: "由1-3个胆码加n个拖码组成，单注奖金78元",
            tips: "请至少选择一注,胆码不能超过3个球"
          },
          "19": {key: "19", name: "任五胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "305", bonus: 540, playType: "1", betType: "1",
            desc: "由1-4个胆码加n个拖码组成，单注奖金540元",
            tips: "请至少选择一注,胆码不能超过4个球"
          },
          "20": {key: "20", name: "任六胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "306", bonus: 90, playType: "1", betType: "1",
            desc: "由1-5个胆码加n个拖码组成，单注奖金90元",
            tips: "请至少选择一注,胆码不能超过5个球"
          },
          "21": {key: "21", name: "任七胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "307", bonus: 26, playType: "1", betType: "1",
            desc: "由1-6个胆码加n个拖码组成，单注奖金26元",
            tips: "请至少选择一注,胆码不能超过6个球"
          },
          "22": {key: "22", name: "任八胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "308", bonus: 9, playType: "1", betType: "1",
            desc: "由1-7个胆码加n个拖码组成，单注奖金9元",
            tips: "请至少选择一注,胆码不能超过7个球"
          }
        }
      }
    },
    jcl: { // 竞彩篮球
      key: "jcl",
      name: "竞彩篮球",
      desc: "简单易玩，2串1易中奖",
      logo: "images/jcl.png",
      hasDetail: false
    },
    jcz: { // 竞彩足球
      key: "jcz",
      name: "竞彩足球",
      desc: "返奖率高达69%",
      logo: "images/jcz.png",
      hasDetail: false
    },
    gjj: { // 冠军竞猜
      key: "gjj",
      name: "冠军竞猜",
      desc: "返奖率高达69%",
      logo: "images/gjj.png",
      hasDetail: false
    }
  };
  // 彩种ID映射字符标示
  config.lotteryIdToStr = {
    4: "pl3", // 排列3
    11: "ssq", // 双色球
    12: "f3d", // 福彩3D
    13: "dlt", // 大乐透
    31: "syy", // 十一运夺金
    34: "syx" // 十一选5
  };
  module.exports = config;
});
