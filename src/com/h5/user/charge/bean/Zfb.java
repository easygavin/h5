package com.h5.user.charge.bean;

/**
 * Title 支付宝充值实体类.
 */
public class Zfb {

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

    public Zfb(Integer amount, String userId, String token, String couponNo, String canalNo) {
        this.amount = amount;
        this.userId = userId;
        this.token = token;
        this.couponNo = couponNo;
        this.canalNo = canalNo;
    }

    public Zfb() {

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
}
