package com.h5.user.charge.services;

import net.sf.json.JSONObject;

/**
 * Title 充值卡充值接口.
 * @author  heming
 */
public interface CzkChargeService {

    /**
     * 充值卡充值.
     * @param jsonObject 前台jason数据
     */

    JSONObject czkCharge(JSONObject jsonObject);


}
