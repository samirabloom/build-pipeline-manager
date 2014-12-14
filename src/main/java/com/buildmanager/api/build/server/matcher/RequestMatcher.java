package com.buildmanager.api.build.server.matcher;

import com.google.common.base.Strings;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.QueryStringDecoder;
import org.apache.commons.lang3.StringUtils;

/**
 * @author jamesdbloom
 */
public class RequestMatcher {
    private final String uriRegex;
    private final HttpMethod method;

    public RequestMatcher(HttpMethod method, String uriRegex) {
        this.uriRegex = uriRegex;
        this.method = method;
    }

    public boolean matches(FullHttpRequest request) {
        return pathMatches(request) && methodMatches(request);
    }

    public boolean methodMatches(FullHttpRequest request) {
        return method == null || method.equals(request.getMethod());
    }

    public boolean pathMatches(FullHttpRequest request) {
        return Strings.isNullOrEmpty(uriRegex)
                || StringUtils.startsWithIgnoreCase(new QueryStringDecoder(request.getUri()).path(), uriRegex)
                || new QueryStringDecoder(request.getUri()).path().matches(uriRegex);
    }
}
