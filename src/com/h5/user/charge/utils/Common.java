package com.h5.user.charge.utils;

/**
 * 资源配置文件.
 */
public class Common {

    private static String config = "com.h5.user.charge.config.payInfo"; //配置文件地址.

    private static String zfbWapUrl;   //支付宝WAP充值URL.
    private static String zfbWapKey;   //支付宝WAP密钥
    private static String zfbSignType; //支付宝SignType
    private static String cftWapUrl;   //财付通WAP充值URL.
    private static String cftWapKey;   //财付通WAP密钥.
    private static String czkUrl;      //充值卡充值URL.
    private static String ztkUrl;      //直通卡充值.
    private static String commonKey;   //充值卡,直通卡共有密钥



    static {
        ResLoader resLoader = new ResLoader(config);
        zfbWapUrl = resLoader.getString("zfbWapRequestURl");
        zfbWapKey = resLoader.getString("zfbWapKey");
        zfbSignType =resLoader.getString("zfbSignType");
        cftWapUrl = resLoader.getString("cftWapRequestUrl");
        cftWapKey = resLoader.getString("cftWapKey");
        czkUrl = resLoader.getString("czkRequestUrl");
        ztkUrl = resLoader.getString("ztkRequestUrl");
        commonKey =resLoader.getString("commonKey");

    }

    public static String getZfbWapUrl() {
        return zfbWapUrl;
    }

    public static void setZfbWapUrl(String zfbWapUrl) {
        Common.zfbWapUrl = zfbWapUrl;
    }

    public static String getCftWapUrl() {
        return cftWapUrl;
    }

    public static void setCftWapUrl(String cftWapUrl) {
        Common.cftWapUrl = cftWapUrl;
    }

    public static String getCzkUrl() {
        return czkUrl;
    }

    public static void setCzkUrl(String czkUrl) {
        Common.czkUrl = czkUrl;
    }

    public static String getZtkUrl() {
        return ztkUrl;
    }

    public static void setZtkUrl(String ztkUrl) {
        Common.ztkUrl = ztkUrl;
    }

    public static String getZfbWapKey() {
        return zfbWapKey;
    }

    public static void setZfbWapKey(String zfbWapKey) {
        Common.zfbWapKey = zfbWapKey;
    }

    public static String getCftWapKey() {
        return cftWapKey;
    }

    public static void setCftWapKey(String cftWapKey) {
        Common.cftWapKey = cftWapKey;
    }

    public static String getZfbSignType() {
        return zfbSignType;
    }

    public static void setZfbSignType(String zfbSignType) {
        Common.zfbSignType = zfbSignType;
    }

    public static String getCommonKey() {
        return commonKey;
    }

    public static void setCommonKey(String commonKey) {
        Common.commonKey = commonKey;
    }
}
