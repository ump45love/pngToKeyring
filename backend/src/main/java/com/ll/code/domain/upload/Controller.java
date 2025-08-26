package com.ll.code.domain.upload;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ll.code.global.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/image")
public class Controller {
	private final Service service;

	@PostMapping("/upload")
	@Transactional
	public  ResponseEntity<ApiResponse<String>> upload(@RequestBody @RequestParam(value = "file",required = false) MultipartFile file,
		HttpServletRequest request) {
		String ip = request.getRemoteAddr();
		Map<Boolean, String> response = service.upload(file,ip);
		if(response.containsKey(false))
			return  ResponseEntity.ok(ApiResponse.failure(response.get(false)));

		return ResponseEntity.ok(ApiResponse.success(response.get(true)));
	}

}
