package com.h5.user.charge.servlet.zfb;

import com.alipay.client.security.SecurityManagerImpl;
import com.alipay.client.util.ParameterUtil;
import com.h5.user.charge.utils.Common;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Title 支付宝回调接口.
 * 支付成功返回商户的链接地址
 * 用于同步接收支付宝回调数据
 * 需要对回调的数据进行验签名操作
 * @author  heming.
 */
public class ZfbWapCallBackServlet extends HttpServlet {
    /**
     * <pre>
     * 回调的参数有：sign,result,request_token,out_trade_no,trade_no
     * 通过request.getParameter("sign");可以获取到相关数据
     * </pre>
     * @param request
     * @param response
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String sign = request.getParameter("sign");
        String result = request.getParameter("result");
        String requestToken = request.getParameter("request_token");
        String outTradeNo = request.getParameter("out_trade_no");
        String tradeNo = request.getParameter("trade_no");
        Map<String,String> resMap  = new HashMap<String,String>();

        resMap.put("result", result);
        resMap.put("request_token", requestToken);
        resMap.put("out_trade_no", outTradeNo);
        resMap.put("trade_no", tradeNo);
        String verifyData = ParameterUtil.getSignData(resMap);
        try {
            // 算法签名
            String signAlgo =Common.getZfbSignType();
            // 商户密钥
            String key = Common.getZfbWapKey();
            // 签名验证.
            SecurityManagerImpl securityManager = new SecurityManagerImpl();
            boolean  verified = securityManager.verify(signAlgo, verifyData, sign, key);
            System.out.println("verified="+verified);
            System.out.println("result="+result);
            if (!verified || !result.equals("success")) {
                System.out.println("支付宝WAP手机支付验证签名失败！");
                response.sendRedirect("#charge/index");
            } else {
                System.out.println("支付宝WAP手机支付验证签名成功！");
                response.sendRedirect("#charge/index");
            }
        } catch (Exception e) {
            System.out.println("支付宝WAP手机支付校验异常");
            response.sendRedirect("#charge/index");
        }

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }
}
