package com.ll.code.domain.upload;

import static com.ll.code.util.config.AppConfig.*;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

public class Service {
	public static Map<Boolean, String> upload(MultipartFile file) {
		Map<Boolean, String> response = new HashMap<Boolean, String>();
		if (file.isEmpty()) {
			response.put(false, "이미지 업로드에 실패했습니다.");
			return response;
		}
		String name = makeFileName(Objects.requireNonNull(file.getOriginalFilename()));
		if (name.isEmpty()) {
			response.put(false, "지원되지 않는 형식입니다.");
			return response;
		}

		String staticUrl = "images/"+ name;
		String saveUrl = getStaticDirectory() + staticUrl;

		File destFile = new File(saveUrl);
		if (!destFile.getParentFile().exists()) {
			destFile.getParentFile().mkdirs();
		}
		try {
			file.transferTo(destFile);
			response.put(true, staticUrl);
		} catch (IOException e) {
			throw new NoSuchElementException("이미지 업로드에 실패했습니다.");
		}

		return response;
	}

	public String makeFileName(String file) {
		String attcFileNm = UUID.randomUUID().toString().replaceAll("-", "");
		String attcFileOriExt = fileExtCheck(file.substring(file.lastIndexOf(".")));
		if (attcFileOriExt.isEmpty())
			return "";
		return attcFileNm + attcFileOriExt;
	}

	public String fileExtCheck(String originalFileExtension) {
		originalFileExtension = originalFileExtension.toLowerCase();
		if (originalFileExtension.equals(".jpg") || originalFileExtension.equals(".gif")
			|| originalFileExtension.equals(".png") || originalFileExtension.equals(".jpeg")
			|| originalFileExtension.equals(".bmp")) {
			return originalFileExtension;
		}
		return "";
	}
}
