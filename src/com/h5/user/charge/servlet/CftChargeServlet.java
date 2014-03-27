package com.h5.user.charge.servlet;

import com.h5.user.charge.impl.CftChargeServiceImpl;
import com.h5.user.charge.impl.ZfbChargeServiceImpl;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Title 财付通充值 Servlet
 * @author heming
 */
public class CftChargeServlet extends HttpServlet {

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
            CftChargeServiceImpl cftWapImpl = new CftChargeServiceImpl();
            JSONObject jsonObject = JSONObject.fromObject(requestParameter);
            JSONObject object = cftWapImpl.cftWapCharge(jsonObject);
            resp.getWriter().write(object.toString());
        } else {
            JSONObject object = new JSONObject();
            object.put("statusCode", "-3");
            object.put("errorMsg", "充值失败,请稍后重试");
            resp.getWriter().write(object.toString());
        }
    }
}
