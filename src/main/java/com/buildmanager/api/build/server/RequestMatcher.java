package com.buildmanager.api.build.server;

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

    public boolean match(FullHttpRequest request) {
        boolean methodMatches = method == null || method.equals(request.getMethod());
        boolean uriBaseMatches = Strings.isNullOrEmpty(uriRegex) || StringUtils.startsWithIgnoreCase(new QueryStringDecoder(request.getUri()).path(), uriRegex) || new QueryStringDecoder(request.getUri()).path().matches(uriRegex);
        return uriBaseMatches && methodMatches;
    }
}
