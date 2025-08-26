package com.ll.code.util.other;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class IPLimit {
	// 최대 저장 가능한 IP 수
	private static final int MAX_IPS = 1000;
	// 제한 시간 10초
	private static final long LIMIT_MS = 10_000;

	// LinkedHashMap: 오래된 순으로 정리됨
	private static final Map<String, Long> lastUploadTimeMap =
		new LinkedHashMap<String, Long>(16, 0.75f, true) {
			@Override
			protected boolean removeEldestEntry(Map.Entry<String, Long> eldest) {
				// 최대 크기 초과 시 자동 삭제
				return size() > MAX_IPS;
			}
		};

	public static synchronized boolean checkIp(String ip) {
		long now = System.currentTimeMillis();

		Long lastTime = lastUploadTimeMap.get(ip);
		if (lastTime != null) {
			// 이미 있는 IP
			if (now - lastTime < LIMIT_MS) {
				// 10초 안 지남 -> 업로드 제한
				return true;
			} else {
				// 10초 지남 -> 시간 갱신
				lastUploadTimeMap.put(ip, now);
				return false;
			}
		} else {
			// 새 IP → 자동으로 오래된 것 제거됨(removeEldestEntry)
			lastUploadTimeMap.put(ip, now);
			return false;
		}
	}

	// (선택) 11초 이상 지난 항목 삭제
	public static synchronized void removeExpired() {
		long now = System.currentTimeMillis();
		lastUploadTimeMap.entrySet().removeIf(e -> now - e.getValue() > 11_000);
	}
}
