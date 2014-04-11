package com.h5.user.charge.servlet.ztk;

import com.h5.user.charge.impl.czk.CzkChargeServiceImpl;
import com.h5.user.charge.impl.ztk.ZtkChargeServiceImpl;
import com.h5.user.charge.utils.Common;
import com.h5.user.charge.utils.Util;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Title 直通卡充值
 * @author heming
 */
public class ZtkChargeServlet extends HttpServlet {

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
            ZtkChargeServiceImpl ztkImpl = new ZtkChargeServiceImpl();
            JSONObject jsonObject = JSONObject.fromObject(requestParameter);
            //md5(userId+cardNo+password+mobile+key)
            String args[] = {"userId", "cardNo","password","mobile"};
            String key = Common.getCommonKey();
            jsonObject = Util.getSign(jsonObject, args, key);
            JSONObject object = ztkImpl.ztkCharge(jsonObject);
            resp.getWriter().write(object.toString());
        } else {
            JSONObject object = new JSONObject();
            object.put("statusCode", "-3");
            object.put("errorMsg", "充值失败,请稍后重试");
            resp.getWriter().write(object.toString());
        }
    }
}
