package com.h5.user.charge.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Title 内嵌客户端 Servlet
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
        String token = request.getParameter("token");
       // if (token == null && !"".equals(token)) {
            //response.sendRedirect("#charge/index?userToken=" + 124);
            response.sendRedirect("?userToken=124#charge/index");
        //}
    }
}
