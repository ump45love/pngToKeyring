package com.ll.code.util.config;


import static com.ll.code.util.os.OsConfig.*;

import org.springframework.context.annotation.Configuration;

import com.ll.code.global.enumd.OsType;

@Configuration
public class AppConfig {
	public static String getSiteFrontUrl() {
		return "http://localhost:3000";
	}
	public static String getStaticDirectory() {
		if(getOs() == OsType.WIN)
			return "C://";
		else if(getOs() == OsType.MAC) {
			return "/Users/"+System.getProperty("user.name");
		}
		else
			return"/";
	}
	public static String getImagesFolder() {return "images/";}
}

