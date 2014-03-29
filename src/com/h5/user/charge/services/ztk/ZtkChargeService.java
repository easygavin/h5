package com.h5.user.charge.services.ztk;

import net.sf.json.JSONObject;

/**
 * Title 直通卡充值接口.
 */
public interface ZtkChargeService {
    JSONObject ztkCharge(JSONObject jsonObject);
}
