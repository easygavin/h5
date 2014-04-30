package com.h5.user.charge.servlet.client;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Title 内嵌客户端 Servlet
 *
 * @author heming
 */
public class ClientChargeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=utf-8");
        String userToken = request.getParameter("userToken");
        String platform = request.getParameter("platform");
        String channelNo = request.getParameter("channelNo");
        if (userToken != null && !"".equals(userToken) && platform != null && !"".equals(platform) && channelNo != null && !"".equals(channelNo)) {
            StringBuilder builder = new StringBuilder("?userToken=");
            builder.append(userToken);
            builder.append("&platform=");
            builder.append(platform);
            builder.append("&channelNo=");
            builder.append(channelNo);
            builder.append("#charge/index");
            response.sendRedirect(builder.toString());
        }
    }
}
