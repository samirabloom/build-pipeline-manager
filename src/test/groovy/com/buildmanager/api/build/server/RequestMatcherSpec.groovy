package com.buildmanager.api.build.server

import io.netty.handler.codec.http.DefaultFullHttpRequest
import io.netty.handler.codec.http.HttpMethod
import io.netty.handler.codec.http.HttpRequest
import io.netty.handler.codec.http.HttpVersion
import spock.lang.Specification
import spock.lang.Unroll

/**
 * @author jamesdbloom
 */
class RequestMatcherSpec extends Specification {

    @Unroll
    void '#requestMethod and #requestUri should match #matcherMethod #matcherUri as #result'() {
        given:
            HttpRequest httpRequest = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, requestMethod, requestUri)

        when:
            boolean matches = new RequestMatcher(matcherMethod, matcherUri).match(httpRequest);

        then:
            matches == result

        where:
            requestMethod  | requestUri                 | matcherMethod   | matcherUri                 || result
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | "/some/uri.*"              || true
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | "/some/uri"                || true
            HttpMethod.GET | "/some/uri/something"      | HttpMethod.GET  | "/some/uri"                || true
            HttpMethod.GET | "/some/uri/something/else" | HttpMethod.GET  | "/some/uri"                || true
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | "/some/uri/something/else" || false
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | "/other/uri"               || false
            HttpMethod.GET | "/some/uri"                | HttpMethod.POST | "/some/uri.*"              || false
            HttpMethod.GET | "/some/uri"                | null            | "/some/uri"                || true
            HttpMethod.GET | "/some/uri"                | null            | "/some/other"              || false
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | null                       || true
            HttpMethod.GET | "/some/uri"                | HttpMethod.POST | null                       || false
    }
}
