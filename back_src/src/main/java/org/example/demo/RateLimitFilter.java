package org.example.demo;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebFilter(urlPatterns = {"/post-servlet"})
public class RateLimitFilter implements Filter {

    private final Map<String, Long> requestTimes = new HashMap<>();
    private static final long LIMIT = 60000;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String ipAddress = httpRequest.getRemoteAddr();
        Long lastRequestTime = requestTimes.get(ipAddress);

        if (lastRequestTime != null && System.currentTimeMillis() - lastRequestTime < LIMIT) {
            httpResponse.sendError(429, "You are sending too many requests. Please wait a minute and try again.");            return;
        }

        requestTimes.put(ipAddress, System.currentTimeMillis());
        chain.doFilter(request, response);
    }
}