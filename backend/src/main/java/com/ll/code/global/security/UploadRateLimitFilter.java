package com.ll.code.global.security;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.springframework.stereotype.Component;

@Component
public class UploadRateLimitFilter implements Filter{


	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
		throws IOException, jakarta.servlet.ServletException {
		String clientIp = request.getRemoteAddr();
		System.out.println(clientIp);


		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
/*
		// 업로드 API 엔드포인트만 검사 (예: /api/upload)
		if (req.getRequestURI().startsWith("/api/upload")) {
			String key = req.getRemoteAddr(); // 또는 사용자 ID (인증된 경우)
			long now = System.currentTimeMillis();

			Long last = lastUploadTime.get(key);

			if (last != null && (now - last) < LIMIT_INTERVAL) {
				res.sendError(429, "이미지 업로드는 10초에 1회만 가능합니다.");
				return; // 컨트롤러로 가지 않음
			}

			lastUploadTime.put(key, now);
		}
*/
		chain.doFilter(request, response);
	}
}
