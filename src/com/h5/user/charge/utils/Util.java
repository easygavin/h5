package com.h5.user.charge.utils;

import net.sf.json.JSONObject;

/**
 * Title 充值加密辅助类.
 */
public class Util {

    /**
     * sign加密
     * @param jsonObject 前台传递json对象
     * @param args       需要获取的参数
     * @param key        密钥
     * @return           jsonObject
     */
    public  static JSONObject getSign(JSONObject jsonObject, String args[], String key) {
        StringBuilder builder = new StringBuilder();
        for (String str : args) {
            builder.append(jsonObject.getString(str));
        }
        builder.append(key);
        String sign = Md5Encrypt.md5(builder.toString());
        jsonObject.put("sign", sign);
        return jsonObject;
    }

}
