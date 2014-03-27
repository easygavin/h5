package com.h5.user.charge.services;

import net.sf.json.JSONObject;

/**
 * Title 支付宝充值接口.
 * @author  heming
 */
public interface ZfbChargeService {

    /**
     * 支付宝WAP充值.
     * @param jsonObject 前台jason格式数据
     */
    JSONObject zfbWapCharge(JSONObject jsonObject);


}
