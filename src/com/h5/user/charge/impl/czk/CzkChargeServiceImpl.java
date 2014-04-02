package com.h5.user.charge.impl.czk;

import com.h5.user.charge.services.czk.CzkChargeService;
import com.h5.user.charge.utils.Common;
import com.h5.user.charge.utils.TransportUrl;
import net.sf.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Title 充值卡充值业务类.
 * @author heming
 */
public class CzkChargeServiceImpl implements CzkChargeService {

    /**
     * 充值卡充值.
     * @param jsonObject 前台jason数据.
     */
    @Override
    public JSONObject czkCharge(JSONObject jsonObject) {
        //本地接口请求url.
        String localRequestUrl = Common.getCzkUrl();
        //本地接口返回数据.
        org.json.JSONObject localResponse;
        //以jason数据返回到前台.
        JSONObject returnResult = new JSONObject();
        try {
            String requestUrl = localRequestUrl +"?data="+ URLEncoder.encode(jsonObject.toString(), "UTF-8");
            //本地响应请求,返回结果.
            localResponse = TransportUrl.getLocalResponse(requestUrl);
            if (null != localResponse) {
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
