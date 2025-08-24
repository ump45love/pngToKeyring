package com.ll.code.util.os;

import com.ll.code.global.enumd.OsType;

public class OsConfig {
	public static OsType getOs() {
		String os = System.getProperty("os.name").toLowerCase();

		if (os.contains("win")) {
			return OsType.WIN;
		} else if (os.contains("mac")) {
			return OsType.MAC;
		} else {
			return OsType.UNKNOWN; // 기본값 처리
		}
	}
}
