package com.h5.user.charge.servlet.cft;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import com.h5.user.charge.utils.Common;
import com.tenpay.ResponseHandler;

/**
 * Title 财付通充值 回调.
 */
public class CftWapCallBackServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String key = Common.getCftWapKey();
        //创建实例
        ResponseHandler respHandler = new ResponseHandler(request, response);
        respHandler.setKey(key);
        respHandler.setUriEncoding("ISO-8859-1");
        // 充值订单金额
        String totalFee = respHandler.getParameter("total_fee");
        String orderNo = respHandler.getParameter("sp_billno");
        // 验证签名
        if (respHandler.isTenpaySign()) {
            String payResult = respHandler.getParameter("pay_result");

            // 判断是否支付成功
            if ("0".equals(payResult)) {
                System.out.printf("财付通wap手机支付后台通知支付成功，充值订单号为" + orderNo);
            } else {
                System.out.printf("财付通wap手机支付后台通知支付失败，支付结果为：" + payResult
                        + "，充值订单号为：" + orderNo);
            }
        } else {
            System.out.printf("服务器异步返回=>" + respHandler.getDebugInfo());
            System.out.printf("财付通wap手机支付服务器通知，验证签名失败！");
        }


    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
