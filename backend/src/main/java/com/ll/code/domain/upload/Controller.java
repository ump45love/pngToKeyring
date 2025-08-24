package com.ll.code.domain.upload;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ll.code.global.ApiResponse;

@RequestMapping("/api/image")
public class Controller {
	@PostMapping("/upload")
	@Transactional
	public  ResponseEntity<ApiResponse<String>> upload(@RequestBody @RequestParam(value = "file",required = false) MultipartFile file) {

		Map<Boolean, String> response = Service.upload(file);
		if(response.containsKey(false))
			return  ResponseEntity.ok(ApiResponse.failure(response.get(false)));

		return ResponseEntity.ok(ApiResponse.success(response.get(true)));
	}

}
