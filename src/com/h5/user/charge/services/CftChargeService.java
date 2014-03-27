package com.h5.user.charge.services;

import net.sf.json.JSONObject;

/**
 * Title 财付通充值接口.
 * @author heming
 */
public interface CftChargeService {

    /**
     * 财付通WAP充值.
     * @param jsonObject 前台jason数据
     */

    JSONObject cftWapCharge(JSONObject jsonObject);
}
