package com.h5.user.charge.test;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by john on 2014/4/3.
 */
public class Test {
    public static void main(String[] args) {
                String url  = "http://locahost:8080/cftWapCallBack";
                String message ="attach=ff80808144c543a20144dd3d96c00054&bank_billno=&bank_type=0&bargainor_id=1216068701&charset=2&fee_type=1&pay_info=OK&pay_result=0&purchase_alias=130729898&sign=F1BA1486CC5ED79B7FD7E61EF63C4F63&sp_billno=TW1404031555100000373&time_end=20140403155658&total_fee=1000&transaction_id=1216068701201404039532642130&ver=2.0";
        String str  =transportUrl(url,message);
        System.out.println("======="+str);
    }
    public static String transportUrl(String url, String message) {
        StringBuffer sb = new StringBuffer();
        BufferedReader in = null;
        OutputStream os = null;
        DataOutputStream dos = null;
        HttpURLConnection uc = null;
        try {
            URL urls = new URL(url);
            uc = (HttpURLConnection) urls.openConnection();
            uc.setRequestMethod("GET");
            uc.setRequestProperty("content-type",
                    "application/x-www-form-urlencoded");
            uc.setRequestProperty("charset", "UTF-8");
            uc.setDoOutput(true);
            uc.setDoInput(true);
            uc.setReadTimeout(10000);
            uc.setConnectTimeout(10000);
            os = uc.getOutputStream();
            dos = new DataOutputStream(os);
            dos.write(message.getBytes("UTF-8"));
            dos.flush();
            in = new BufferedReader(new InputStreamReader(uc.getInputStream(),
                    "GBK"));
            String readLine = "";
            while ((readLine = in.readLine()) != null) {
                sb.append(readLine);
            }
        } catch (Exception e) {
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
                if (os != null) {
                    os.close();
                }
                if (dos != null) {
                    dos.close();
                }

                uc.disconnect();
            } catch (IOException ie) {
            }
        }
        return sb.toString();
    }

}
