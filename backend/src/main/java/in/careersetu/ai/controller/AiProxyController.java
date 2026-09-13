package in.careersetu.ai.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.net.URI;
import java.util.Enumeration;
import java.util.Map;

/**
 * AI Proxy Controller.
 *
 * Acts as an API Gateway to securely route /api/v1/ai/** requests from the frontend
 * to the Python FastAPI AI service. This prevents exposing the AI service directly
 * to the public internet and simplifies frontend CORS/URL configuration.
 */
@RestController
@RequestMapping("/api/v1/ai")
public class AiProxyController {

    private static final Logger log = LoggerFactory.getLogger(AiProxyController.class);

    private final RestTemplate restTemplate;
    private final String aiServiceUrl;

    public AiProxyController(
            @Value("${careersetu.ai.service-url:http://127.0.0.1:8000}") String aiServiceUrl) {
        this.restTemplate = new RestTemplate();
        this.aiServiceUrl = (aiServiceUrl != null && aiServiceUrl.contains("localhost"))
                ? aiServiceUrl.replace("localhost", "127.0.0.1")
                : aiServiceUrl;
    }

    @RequestMapping(value = "/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<byte[]> proxyRequest(HttpServletRequest request) throws Exception {
        String requestUrl = request.getRequestURI();
        
        // Strip context path if present (e.g. if deployed under /api/v1/ai)
        // We know the path starts with /api/v1/ai, so we pass the whole path to FastAPI
        // because FastAPI expects /api/v1/ai/... based on main.py
        
        String targetUrl = aiServiceUrl + requestUrl;
        if (request.getQueryString() != null) {
            targetUrl += "?" + request.getQueryString();
        }

        log.info("Proxying request to AI service: {}", targetUrl);

        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            // Skip host header, content-length, etc. that shouldn't be proxied blindly
            if (headerName.equalsIgnoreCase("host") || headerName.equalsIgnoreCase("content-length")) {
                continue;
            }
            // For multipart form data, let RestTemplate set the correct content-type with boundary
            if (headerName.equalsIgnoreCase("content-type") && request.getContentType() != null && request.getContentType().startsWith("multipart/form-data")) {
                continue;
            }
            headers.add(headerName, request.getHeader(headerName));
        }

        HttpEntity<?> httpEntity;

        // Handle Multipart file uploads
        if (request instanceof MultipartHttpServletRequest multipartRequest) {
            MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
            
            // Add all files
            for (Map.Entry<String, MultipartFile> entry : multipartRequest.getFileMap().entrySet()) {
                parts.add(entry.getKey(), entry.getValue().getResource());
            }
            
            // Add all form fields
            for (Map.Entry<String, String[]> entry : multipartRequest.getParameterMap().entrySet()) {
                for (String value : entry.getValue()) {
                    parts.add(entry.getKey(), value);
                }
            }
            
            HttpHeaders multipartHeaders = new HttpHeaders();
            multipartHeaders.putAll(headers);
            // Must not set content-type manually to allow RestTemplate to generate boundary
            httpEntity = new HttpEntity<>(parts, multipartHeaders);
        } else {
            byte[] body = request.getInputStream().readAllBytes();
            httpEntity = new HttpEntity<>(body, headers);
        }

        try {
            return restTemplate.exchange(new URI(targetUrl), HttpMethod.valueOf(request.getMethod()), httpEntity, byte[].class);
        } catch (Exception e) {
            log.error("Failed to proxy request to AI service: {}", e.getMessage());
            throw e;
        }
    }
}
