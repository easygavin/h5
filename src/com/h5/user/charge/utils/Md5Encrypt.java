package com.h5.user.charge.utils;

import org.apache.commons.lang.StringUtils;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Title 支付MD5签名核心类
 *
 */
public class Md5Encrypt {

	// 支付宝适用
	private static final char[] DIGITS = { '0', '1', '2', '3', '4', '5', '6', '7', '8',
			'9', 'a', 'b', 'c', 'd', 'e', 'f' };

	// 财付通适用
	private static final String HEXDIGITS[] = { "0", "1", "2", "3", "4", "5", "6", "7",
			"8", "9", "a", "b", "c", "d", "e", "f" };
	
	// 快钱适用
	private static final String HEX_CHARS = "0123456789abcdef";

	/**
	 * 支付宝支付MD5签名类
	 * 
	 * @param text 明文
	 * @return 密文
	 */
	public static String md5(String text) {
		MessageDigest msgDigest = null;
		try {
			msgDigest = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException("System doesn't support MD5 algorithm");
		}
		try {
			// 注意改接口是按照指定编码形式签名
			msgDigest.update(text.getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) {
			throw new IllegalStateException(
					"System doesn't support your EncodingException");
		}
		byte[] bytes = msgDigest.digest();
		String md5Str = new String(encodeHex(bytes));
		
		return md5Str;
	}
	private static char[] encodeHex(byte[] data) {
		int l = data.length;

		char[] out = new char[l << 1];

		for (int i = 0, j = 0; i < l; i++) {
			out[j++] = DIGITS[(0xF0 & data[i]) >>> 4];
			out[j++] = DIGITS[0x0F & data[i]];
		}

		return out;
	}

	/**
	 * 财付通支付MD5签名类
	 * 
	 * @param str 明文
	 * @param charset 字符集
	 * @return 密文
	 */
	public static String MD5Encode(String str, String charset) {
		String resultString = null;
		try {
			resultString = new String(str);
			MessageDigest md = MessageDigest.getInstance("MD5");
			if (StringUtils.isBlank(charset)) {
				resultString = byteArrayToHexString(md.digest(resultString.getBytes()));
			} else {
				resultString = byteArrayToHexString(md.digest(resultString.getBytes(charset)));
			}
		} catch (Exception exception) {
		}
		return resultString;
	}
	private static String byteArrayToHexString(byte b[]) {
		StringBuffer resultSb = new StringBuffer();
		for (int i = 0; i < b.length; i++)
			resultSb.append(byteToHexString(b[i]));

		return resultSb.toString();
	}
	private static String byteToHexString(byte b) {
		int n = b;
		if (n < 0) n += 256;
		int d1 = n / 16;
		int d2 = n % 16;
		return HEXDIGITS[d1] + HEXDIGITS[d2];
	}
	
	/**
	 * 银联在线支付MD5签名类
	 * 
	 * @param str 明文
	 * @return 密文
	 */
	public static String md5(String str, String charset) {
		if (str == null) {
			return null;
		}

		MessageDigest messageDigest = null;
		try {
			messageDigest = MessageDigest.getInstance("MD5");
			messageDigest.reset();
			messageDigest.update(str.getBytes(charset));
		} catch (NoSuchAlgorithmException e) {
			return str;
		} catch (UnsupportedEncodingException e) {
			return str;
		}

		byte[] byteArray = messageDigest.digest();
		StringBuffer md5StrBuff = new StringBuffer();
		for (int i = 0; i < byteArray.length; i++) {
			if (Integer.toHexString(0xFF & byteArray[i]).length() == 1) {
				md5StrBuff.append("0").append(
						Integer.toHexString(0xFF & byteArray[i]));
			} else {
				md5StrBuff.append(Integer.toHexString(0xFF & byteArray[i]));
			}
		}
		return md5StrBuff.toString();
	}
	
	/**
	 * 快钱支付MD5签名类
	 * 
	 * @param data 明文
	 * @return 密文
	 */
	public static String toSign(byte[] data) {
		StringBuffer sb = new StringBuffer();
		try {
			byte[] b = MessageDigest.getInstance("MD5").digest(data);
			for (int i = 0; i < b.length; i++) {
				sb.append(HEX_CHARS.charAt(b[i] >>> 4 & 0x0F));
				sb.append(HEX_CHARS.charAt(b[i] & 0x0F));
			}
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException("System doesn't support MD5 algorithm");
		}
		return sb.toString();
	}

	/**
	 * 获取16位MD5签名串
	 * 
	 * @param str 待签名串
	 * @return 16bit签名串
	 */
	public static String get16BitMD5(String str) {
		String str32 = md5(str);
		return str32.substring(8, 24);
	}
	
	/**
	 * TCL银联手机支付签名类
	 * 
	 * @param str 明文
	 * @param signType 签名方式
	 * @param charset 字符编码集
	 * @return 密文
	 */
	public static String md5(String str, String signType, String charset) {
		if (str == null) {
			return null;
		}

		MessageDigest messageDigest = null;
		try {
			messageDigest = MessageDigest.getInstance(signType);
			messageDigest.reset();
			messageDigest.update(str.getBytes(charset));
		} catch (NoSuchAlgorithmException e) {
			return str;
		} catch (UnsupportedEncodingException e) {
			return str;
		}

		byte[] byteArray = messageDigest.digest();
		StringBuffer md5StrBuff = new StringBuffer();

		for (int i = 0; i < byteArray.length; i++) {
			if (Integer.toHexString(0xFF & byteArray[i]).length() == 1)
				md5StrBuff.append("0").append(Integer.toHexString(0xFF & byteArray[i]));
			else
				md5StrBuff.append(Integer.toHexString(0xFF & byteArray[i]));
		}
		return md5StrBuff.toString();
	}
}
