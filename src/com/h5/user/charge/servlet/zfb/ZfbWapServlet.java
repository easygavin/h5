package com.h5.user.charge.servlet.zfb;

import com.h5.user.charge.impl.zfb.ZfbChargeServiceImpl;
import com.h5.user.charge.utils.Common;
import com.h5.user.charge.utils.Util;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Title 支付宝充值Servlet
 *
 * @author heming
 */
public class ZfbWapServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        req.setCharacterEncoding("utf-8");
        resp.setContentType("text/html; charset=utf-8");
        //前端数据,jason数据格式.
        String requestParameter = req.getParameter("data");
        if (null != requestParameter && !"".equals(requestParameter)) {
            ZfbChargeServiceImpl zfbWapImpl = new ZfbChargeServiceImpl();
            JSONObject jsonObject = JSONObject.fromObject(requestParameter);
            //sign=md5(amount + userId + key);
            String args[] = {"amount", "userId"};
            String key = Common.getCommonKey();
            jsonObject = Util.getSign(jsonObject, args, key);
            JSONObject object = zfbWapImpl.zfbWapCharge(jsonObject);
            resp.getWriter().write(object.toString());
        } else {
            JSONObject object = new JSONObject();
            object.put("statusCode", "-3");
            object.put("errorMsg", "充值失败,请稍后重试");
            resp.getWriter().write(object.toString());
        }
    }
}
