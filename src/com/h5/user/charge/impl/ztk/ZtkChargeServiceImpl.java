package com.h5.user.charge.impl.ztk;

import com.h5.user.charge.services.ztk.ZtkChargeService;
import com.h5.user.charge.utils.Common;
import com.h5.user.charge.utils.TransportUrl;
import net.sf.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Title 直通卡充值业务类.
 * @author heming
 */
public class ZtkChargeServiceImpl implements ZtkChargeService {

    /**
     * 直通卡充值.
     * @param jsonObject 前端jason数据
     * @return JSONObject
     */

    @Override
    public JSONObject ztkCharge(JSONObject jsonObject) {
        //本地接口请求url.
        String localRequestUrl = Common.getZtkUrl();
        //以jason数据返回到前台.
        JSONObject returnResult = new JSONObject();
        try {
            String requestUrl = localRequestUrl + "?data=" + URLEncoder.encode(jsonObject.toString(), "UTF-8");
            //本地响应请求,返回结果.
            String localResponse = TransportUrl.getLocalResponse(requestUrl).toString();
            if (null != localResponse && !"".equals(localResponse)) {
                //解析返回的json格式的数据.
                return JSONObject.fromObject(localResponse); //org.json.JSONObject转net.sf.json
            } else {
                //请求接口失败返回.
                returnResult.put("statusCode", "-1");
                returnResult.put("errorMsg", "充值失败,请联系客服");
            }
        } catch (UnsupportedEncodingException e) {
            //try{}catch{} 异常返回.
            returnResult.put("statusCode", "-2");
            returnResult.put("errorMsg", "充值失败,请联系客服");
        }
        return returnResult;
    }
}
