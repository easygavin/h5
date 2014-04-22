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
      hasPool: true, // 是否有奖池信息
      hasLevels: true, // 是否有中奖等级,
      type: "digit", // 彩种类型
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
            {id: "0", desc: "红", yl: "遗漏"},
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
      hasPool: true, // 是否有奖池信息
      hasLevels: true, // 是否有中奖等级
      type: "digit", // 彩种类型
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
            {id: "0", desc: "红", yl: "遗漏"},
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
      hasPool: false, // 是否有奖池信息
      hasLevels: true, // 是否有中奖等级
      type: "digit", // 彩种类型
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
            {id: "0", desc: "百位", yl: "遗漏"},
            {id: "1", desc: "十位", yl: ""},
            {id: "2", desc: "个位", yl: ""}
          ], rdm: true, omit: true, omitIndex: 6, omitKey: "9", playType: "2", betType: "1",
            desc: "每位至少选择1个号码，单注奖金1000元",
            tips: "请至少选择一注"
          },
          "1": {key: "1", name: "组三", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "1", playType: "2", betType: "3",
            desc: "至少选择2个号码，单注奖金320元",
            tips: "请至少选择一注"
          },
          "2": {key: "2", name: "组六", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "2", playType: "2", betType: "4",
            desc: "至少选择3个号码，单注奖金160元",
            tips: "请至少选择一注"
          },
          /*"3": {key: "3", name: "直选胆拖", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "1",
            desc: "由1-2个胆拖加n个拖码组成",
            tips: "请至少选择一注,胆码不能超过2个球"
          },*/
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
      hasPool: false, // 是否有奖池信息
      hasLevels: true, // 是否有中奖等级
      type: "digit", // 彩种类型
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
            {id: "0", desc: "百位", yl: "遗漏"},
            {id: "1", desc: "十位", yl: ""},
            {id: "2", desc: "个位", yl: ""}
          ], rdm: true, omit: true, omitIndex: 6, omitKey: "9", playType: "2", betType: "1",
            desc: "每位至少选择1个号码，单注奖金1000元",
            tips: "请至少选择一注"
          },
          "1": {key: "1", name: "组三", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "1", playType: "2", betType: "3",
            desc: "至少选择2个号码，单注奖金320元",
            tips: "请至少选择一注"
          },
          "2": {key: "2", name: "组六", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "2", playType: "2", betType: "4",
            desc: "至少选择3个号码，单注奖金160元",
            tips: "请至少选择一注"
          },
          /*"3": {key: "3", name: "直选胆拖", shows: [
            {id: "0", desc: "胆", yl: ""},
            {id: "1", desc: "拖", yl: ""}
          ], rdm: false, omit: false, playType: "5", betType: "1",
            desc: "由1-2个胆码加n个拖码组成",
            tips: "请至少选择一注,胆码不能超过2个球"
          },*/
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
      hasPool: false, // 是否有奖池信息
      hasLevels: true, // 是否有中奖等级
      type: "freq", // 彩种类型
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
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "201", ctxKey: "201", bonus: 13, playType: "1", betType: "1",
            desc: "至少选择1个号码，单注奖金13元",
            tips: "请至少选择一注"
          },
          "1": {key: "1", name: "任二", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "202", bonus: 6, playType: "1", betType: "1",
            desc: "至少选择2个号码，单注奖金6元",
            tips: "请至少选择一注"
          },
          "2": {key: "2", name: "任三", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "203", bonus: 19, playType: "1", betType: "1",
            desc: "至少选择3个号码，单注奖金19元",
            tips: "请至少选择一注"
          },
          "3": {key: "3", name: "任四", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "204", bonus: 78, playType: "1", betType: "1",
            desc: "至少选择4个号码，单注奖金78元",
            tips: "请至少选择一注"
          },
          "4": {key: "4", name: "任五", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "205", bonus: 540, playType: "1", betType: "1",
            desc: "至少选择5个号码，单注奖金540元",
            tips: "请至少选择一注"
          },
          "5": {key: "5", name: "任六", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "206", bonus: 90, playType: "1", betType: "1",
            desc: "至少选择6个号码，单注奖金90元",
            tips: "请至少选择一注"
          },
          "6": {key: "6", name: "任七", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "207", bonus: 26, playType: "1", betType: "1",
            desc: "至少选择7个号码，单注奖金26元",
            tips: "请至少选择一注"
          },
          "7": {key: "7", name: "任八", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "208", bonus: 9, playType: "1", betType: "1",
            desc: "至少选择8个号码，单注奖金9元",
            tips: "请至少选择一注"
          },
          "8": {key: "8", name: "前三直选", shows: [
            {id: "0", desc: "一", yl: "遗漏"},
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
            {id: "0", desc: "一", yl: "遗漏"},
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
          /*"12": {key: "12", name: "前三直选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "512", bonus: 1170, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金1170元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },*/
          "13": {key: "13", name: "前三组选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "502", bonus: 195, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金195元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          /*"14": {key: "14", name: "前二直选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "412", bonus: 130, playType: "1", betType: "1",
            desc: "由1个胆码加n个拖码组成，单注奖金130元",
            tips: "请至少选择一注,胆码不能超过1个球"
          },*/
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
    syx: { // 11选5
      key: "syx",
      lotteryId: "34",
      name: "11选5",
      desc: "10分钟一期",
      logo: "images/syx.png",
      hasDetail: true,
      hasPool: false, // 是否有奖池信息
      hasLevels: true, // 是否有中奖等级
      type: "freq", // 彩种类型
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
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 0, omitKey: "201", ctxKey: "201", bonus: 13, playType: "1", betType: "1",
            desc: "至少选择1个号码，单注奖金13元",
            tips: "请至少选择一注"
          },
          "1": {key: "1", name: "任二", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "202", bonus: 6, playType: "1", betType: "1",
            desc: "至少选择2个号码，单注奖金6元",
            tips: "请至少选择一注"
          },
          "2": {key: "2", name: "任三", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "203", bonus: 19, playType: "1", betType: "1",
            desc: "至少选择3个号码，单注奖金19元",
            tips: "请至少选择一注"
          },
          "3": {key: "3", name: "任四", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "204", bonus: 78, playType: "1", betType: "1",
            desc: "至少选择4个号码，单注奖金78元",
            tips: "请至少选择一注"
          },
          "4": {key: "4", name: "任五", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "205", bonus: 540, playType: "1", betType: "1",
            desc: "至少选择5个号码，单注奖金540元",
            tips: "请至少选择一注"
          },
          "5": {key: "5", name: "任六", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "206", bonus: 90, playType: "1", betType: "1",
            desc: "至少选择6个号码，单注奖金90元",
            tips: "请至少选择一注"
          },
          "6": {key: "6", name: "任七", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "207", bonus: 26, playType: "1", betType: "1",
            desc: "至少选择7个号码，单注奖金26元",
            tips: "请至少选择一注"
          },
          "7": {key: "7", name: "任八", shows: [
            {id: "0", desc: "选号", yl: "遗漏"}
          ], rdm: true, omit: true, omitIndex: 1, omitKey: "202", ctxKey: "208", bonus: 9, playType: "1", betType: "1",
            desc: "至少选择8个号码，单注奖金9元",
            tips: "请至少选择一注"
          },
          "8": {key: "8", name: "前三直选", shows: [
            {id: "0", desc: "一", yl: "遗漏"},
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
            {id: "0", desc: "一", yl: "遗漏"},
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
          /*"12": {key: "12", name: "前三直选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "512", bonus: 1170, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金1170元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },*/
          "13": {key: "13", name: "前三组选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "502", bonus: 195, playType: "1", betType: "1",
            desc: "由1-2个胆码加n个拖码组成，单注奖金195元",
            tips: "请至少选择一注,胆码不能超过2个球"
          },
          /*"14": {key: "14", name: "前二直选胆拖", shows: [
            {id: "0", desc: "胆"},
            {id: "1", desc: "拖"}
          ], rdm: false, omit: false, ctxKey: "412", bonus: 130, playType: "1", betType: "1",
            desc: "由1个胆码加n个拖码组成，单注奖金130元",
            tips: "请至少选择一注,胆码不能超过1个球"
          },*/
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
      lotteryId: '',
      name: "竞彩篮球",
      desc: "简单易玩，2串1易中奖",
      logo: "images/jcl.png",
      hasDetail: false,
      type: "jc" // 彩种类型
    },
    jcz: { // 竞彩足球
      key: "jcz",
      name: "竞彩足球",
      desc: "返奖率高达69%",
      logo: "images/jcz.png",
      hasDetail: false,
      type: "jc" // 彩种类型
    },
    gjj: { // 冠军竞猜
      key: "gjj",
      name: "冠军竞猜",
      desc: "返奖率高达69%",
      logo: "images/gjj.png",
      hasDetail: false,
      type: "jc", // 彩种类型
      localKey: "local_gjj",
      modes: { // 模式
        def: "0", // 默认模式
        list: { // 模式列表
          "0": {key: "0", name: "世界杯", endTime: "2014-07-14 02:55:00", event: "S", issueNo: "2014"},
          "1": {key: "1", name: "欧冠杯", endTime: "2014-05-25 02:40:00", event: "O", issueNo: "2014"}
        }
      },
      flags: {
        "巴西": "images/flags/lm_flag9.png",
        "德国": "images/flags/lm_flag2.png",
        "阿根廷": "images/flags/lm_flag24.png",
        "西班牙": "images/flags/lm_flag8.png",
        "比利时": "images/flags/lm_flag3.png",
        "荷兰": "images/flags/lm_flag22.png",
        "意大利": "images/flags/lm_flag21.png",
        "法国": "images/flags/lm_flag20.png",
        "葡萄牙": "images/flags/lm_flag31.png",
        "哥伦比亚": "images/flags/lm_flag15.png",
        "乌拉圭": "images/flags/lm_flag12.png",
        "英格兰": "images/flags/lm_flag11.png",
        "智利": "images/flags/lm_flag16.png",
        "俄罗斯": "images/flags/lm_flag30.png",
        "科特迪瓦": "images/flags/lm_flag19.png",
        "瑞士": "images/flags/lm_flag7.png",
        "日本": "images/flags/lm_flag1.png",
        "波黑": "images/flags/lm_flag18.png",
        "克罗地亚": "images/flags/lm_flag14.png",
        "厄瓜多尔": "images/flags/lm_flag25.png",
        "墨西哥": "images/flags/lm_flag29.png",
        "美国": "images/flags/lm_flag10.png",
        "加纳": "images/flags/lm_flag26.png",
        "尼日利亚": "images/flags/lm_flag13.png",
        "希腊": "images/flags/lm_flag4.png",
        "韩国": "images/flags/lm_flag6.png",
        "喀麦隆": "images/flags/lm_flag17.png",
        "澳大利亚": "images/flags/lm_flag5.png",
        "哥斯达黎加": "images/flags/lm_flag32.png",
        "洪都拉斯": "images/flags/lm_flag27.png",
        "伊朗": "images/flags/lm_flag28.png",
        "阿尔及利亚": "images/flags/lm_flag23.png",
        "拜仁慕尼黑": "images/flags/lm_flag36.png",
        "巴塞罗那": "images/flags/lm_flag33.png",
        "皇家马德里": "images/flags/lm_flag35.png",
        "多特蒙德": "images/flags/lm_flag37.png",
        "切尔西": "images/flags/lm_flag38.png",
        "巴黎圣日尔曼": "images/flags/lm_flag39.png",
        "马德里竞技": "images/flags/lm_flag34.png",
        "曼彻斯特联": "images/flags/lm_flag40.png",
        "曼彻斯特城": "images/flags/lm_flag41.png",
        "奥林匹亚科斯": "images/flags/lm_flag42.png",
        "阿森纳": "images/flags/lm_flag43.png",
        "AC米兰": "images/flags/lm_flag44.png",
        "加拉塔萨雷": "images/flags/lm_flag45.png",
        "圣彼得堡泽尼特": "images/flags/lm_flag46.png",
        "勒沃库森": "images/flags/lm_flag47.png",
        "沙尔克04": "images/flags/lm_flag48.png"
      }
    }
  };
  // 彩种ID映射字符标示
  config.lotteryIdToStr = {
    4: "pl3", // 排列3
    11: "ssq", // 双色球
    12: "f3d", // 福彩3D
    13: "dlt", // 大乐透
    31: "syy", // 十一运夺金
    34: "syx", // 11选5
    46: "jcz", // 竞彩足球
    36: "jcl" // 竞彩篮球
  };

  //所有合买彩种.
  //1_胜负彩,4_排列3,5_任选9场,6_排列5,8_七星彩,11_双色球,12_福彩3D,13_大乐透,46_竞彩足球胜平负
  //47_竞彩足球比分,48_竞彩足球总进球,49_竞彩足球半全场,52_竞彩足球混投,56_竞彩足球让球胜平负
  //36_竞彩篮球胜负,37_竞彩篮球让分胜负,38_竞彩篮球胜分差,39_竞彩篮球大小分,53_竞彩蓝球混投
  //89_北单让球胜平负,92_北单比分
  //var lotteryTypeArray = '1|4|5|6|8|11|12|13|46|47|48|49|52|56|36|37|38|39|53|89|92';
  config.lotteryIdReflectStr = {
    1: {"abbreviation": "sfc", "title": "胜负彩"},
    4: {"abbreviation": "pls", "title": "排列3"},
    5: {"abbreviation": "rx9c", "title": "任选9场"},
    6: {"abbreviation": "plw", "title": "排列5"},
    8: {"abbreviation": "qxc", "title": "七星彩"},
    11: {"abbreviation": "ssq", "title": "双色球"},
    12: {"abbreviation": "f3d", "title": "福彩3D"},
    13: {"abbreviation": "dlt", "title": "大乐透"},
    46: {"abbreviation": "jczqspf", "title": "竞彩足球胜平负"},
    47: {"abbreviation": "jczqbf", "title": "竞彩足球比分"},
    48: {"abbreviation": "jczqzjq", "title": "竞彩足球总进球"},
    49: {"abbreviation": "jczqbqc", "title": "竞彩足球半全场"},
    52: {"abbreviation": "jczqht", "title": "竞彩足球混投"},
    56: {"abbreviation": "jczrqspf", "title": "竞彩足球让球胜平负"},
    36: {"abbreviation": "jclqsf", "title": "竞彩篮球胜负"},
    37: {"abbreviation": "jclqrfsf", "title": "竞彩篮球让分胜负"},
    38: {"abbreviation": "jclqsfc", "title": "竞彩篮球胜分差"},
    39: {"abbreviation": "jclqdxf", "title": "竞彩篮球大小分"},
    53: {"abbreviation": "jclqht", "title": "竞彩篮球混投"},
    89: {"abbreviation": "bjdcrqspf", "title": "北单让球胜平负"},
    92: {"abbreviation": "bjdcbf", "title": "北单比分"}
  };
  module.exports = config;
});
