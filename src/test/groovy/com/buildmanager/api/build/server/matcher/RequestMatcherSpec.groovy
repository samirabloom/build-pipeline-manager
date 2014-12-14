package com.buildmanager.api.build.server.matcher

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
            boolean matches = new RequestMatcher(matcherMethod, matcherUri).matches(httpRequest);

        then:
            matches == result

        where:
            requestMethod  | requestUri                 | matcherMethod   | matcherUri                 || result
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | "/some/uri.*"              || true
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | "/some/.*"                 || true
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | "/some/uri"                || true
            HttpMethod.GET | "/some/uri/something"      | HttpMethod.GET  | "/some/uri"                || true
            HttpMethod.GET | "/some/uri/something/else" | HttpMethod.GET  | "/some/uri"                || true
            HttpMethod.GET | "/some/uri"                | null            | "/some/uri"                || true
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | null                       || true
            HttpMethod.GET | "/some/uri"                | HttpMethod.POST | "/some/uri.*"              || false
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | "/some/uri/something/else" || false
            HttpMethod.GET | "/some/uri"                | HttpMethod.GET  | "/other/uri"               || false
            HttpMethod.GET | "/some/uri"                | null            | "/some/other"              || false
            HttpMethod.GET | "/some/uri"                | HttpMethod.POST | null                       || false
    }

    @Unroll
    void '#requestMethod should match #matcherMethod as #result'() {
        given:
            HttpRequest httpRequest = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, requestMethod, "")

        when:
            boolean matches = new RequestMatcher(matcherMethod, "").methodMatches(httpRequest);

        then:
            matches == result

        where:
            requestMethod     | matcherMethod     || result
            HttpMethod.GET    | HttpMethod.GET    || true
            HttpMethod.POST   | HttpMethod.POST   || true
            HttpMethod.DELETE | HttpMethod.DELETE || true
            HttpMethod.HEAD   | HttpMethod.HEAD   || true
            HttpMethod.GET    | null              || true
            HttpMethod.GET    | HttpMethod.POST   || false
            HttpMethod.POST   | HttpMethod.GET    || false
    }

    @Unroll
    void '#requestUri should match #matcherUri as #result'() {
        given:
            HttpRequest httpRequest = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.GET, requestUri)

        when:
            boolean matches = new RequestMatcher(HttpMethod.GET, matcherUri).pathMatches(httpRequest);

        then:
            matches == result

        where:
            requestUri                 | matcherUri                 || result
            "/some/uri"                | "/some/uri.*"              || true
            "/some/uri"                | "/some/.*"                 || true
            "/some/uri"                | "/some/uri"                || true
            "/some/uri/something"      | "/some/uri"                || true
            "/some/uri/something/else" | "/some/uri"                || true
            "/some/uri"                | "/some/uri"                || true
            "/some/uri"                | null                       || true
            "/some/uri"                | "/some/uri/something/else" || false
            "/some/uri"                | "/other/uri"               || false
            "/some/uri"                | "/some/other"              || false
    }
}
