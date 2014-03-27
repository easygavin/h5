package com.h5.user.charge.utils;

import org.json.JSONObject;
import org.json.JSONTokener;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HTTP;

import java.io.*;

/**
 *Title 数据接口传输类.
 *
 */
public class TransportUrl {

    /**
     * GET请求,得到本地响应数据.
     * @param url 主机地址 (hostUrl+parameter)
     * @return string
     */
    public static JSONObject getLocalResponse(String url) {

        HttpClient client = new DefaultHttpClient();
        HttpGet get = new HttpGet(url);
        org.json.JSONObject json = null;
        try {
            HttpResponse res = client.execute(get);
            if (res.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                HttpEntity entity = res.getEntity();
                json = new org.json.JSONObject(new JSONTokener(new InputStreamReader(entity.getContent(), HTTP.UTF_8)));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);

        } finally {
            //关闭连接 ,释放资源
            client.getConnectionManager().shutdown();
        }
        return json;
    }
}