package com.h5.user.charge.impl.cft;

import com.h5.user.charge.services.cft.CftChargeService;
import com.h5.user.charge.utils.Common;
import com.h5.user.charge.utils.TransportUrl;
import net.sf.json.JSONObject;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Title  财付通充值业务类.
 *
 */
public class CftChargeServiceImpl implements CftChargeService {
    /**
     * 财付通WAP充值.
     * @param jsonObject 前台jason数据.
     */

    @Override
    public JSONObject cftWapCharge(JSONObject jsonObject) {
        System.out.println("CftChargeServiceImpl jsonObject========== "+jsonObject.toString());
        //本地接口请求url.
        String localRequestUrl = Common.getCftWapUrl();
        //本地接口返回数据.
        String localResponse = "";
        //以jason数据返回到前台.
        JSONObject returnResult = new JSONObject();
        try {
            String requestUrl = localRequestUrl +"?data="+ URLEncoder.encode(jsonObject.toString(), "UTF-8");
            System.out.println("CftChargeServiceImpl requestUrl ===" + requestUrl);
            //本地响应请求,返回结果.
            localResponse = TransportUrl.getLocalResponse(requestUrl).toString();
            System.out.println("CftChargeServiceImpl localResponse=== " + localResponse);
            if (null != localResponse && !"".equals(localResponse)) {
                //解析返回的json格式的数据.
                return JSONObject.fromObject(localResponse);
            } else {
                //请求接口失败返回.
                returnResult.put("statusCode", "-1");
                returnResult.put("errorMsg", "充值失败,请联系客服");
            }
        } catch (UnsupportedEncodingException e) {
            System.out.println("CftChargeServiceImpl Exception: "+e.getMessage());
            returnResult.put("statusCode", "-2");
            returnResult.put("errorMsg", "充值失败,请联系客服");
        }
        return returnResult;
    }
}
