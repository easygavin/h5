package com.h5.user.charge.utils;

/**
 * 资源配置文件.
 */
public class Common {

    private static String config = "com.h5.user.charge.config.payInfo"; //配置文件地址.

    private static String zfbWapUrl; //支付宝WAP充值.
    private static String cftWapUrl; //财付通WAP充值.
    private static String czkUrl;    //充值卡充值.
    private static String ztkUrl;    //直通卡充值.

    static {
        ResLoader resLoader = new ResLoader(config);
        zfbWapUrl = resLoader.getString("zfbWapRequestURl");
        cftWapUrl = resLoader.getString("cftWapRequestUrl");
        czkUrl = resLoader.getString("czkRequestUrl");
        ztkUrl = resLoader.getString("ztkRequestUrl");
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
}
