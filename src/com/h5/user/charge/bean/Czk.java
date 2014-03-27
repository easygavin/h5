package com.h5.user.charge.bean;

/**
 * Title 充值卡充值实体类.
 */
public class Czk {

    //充值金额.
    private Integer amount;
    //用户Id.
    private String userId;
    //用户Token.
    private String token;
    //优惠券编号.
    private String couponNo;
    //渠道编号.
    private String canalNo;
    //充值卡号.
    private String cardNo;
    //充值卡密码.
    private String cardPwd;
    //支付通道编码
    private String payCode;

    public Czk(Integer amount, String userId, String token, String couponNo, String canalNo, String cardNo, String cardPwd, String payCode) {
        this.amount = amount;
        this.userId = userId;
        this.token = token;
        this.couponNo = couponNo;
        this.canalNo = canalNo;
        this.cardNo = cardNo;
        this.cardPwd = cardPwd;
        this.payCode = payCode;
    }

    public Czk() {
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getCouponNo() {
        return couponNo;
    }

    public void setCouponNo(String couponNo) {
        this.couponNo = couponNo;
    }

    public String getCanalNo() {
        return canalNo;
    }

    public void setCanalNo(String canalNo) {
        this.canalNo = canalNo;
    }

    public String getCardNo() {
        return cardNo;
    }

    public void setCardNo(String cardNo) {
        this.cardNo = cardNo;
    }

    public String getCardPwd() {
        return cardPwd;
    }

    public void setCardPwd(String cardPwd) {
        this.cardPwd = cardPwd;
    }

    public String getPayCode() {
        return payCode;
    }

    public void setPayCode(String payCode) {
        this.payCode = payCode;
    }
}
