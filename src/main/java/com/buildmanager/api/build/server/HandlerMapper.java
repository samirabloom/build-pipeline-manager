package com.buildmanager.api.build.server;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpMethod;

public abstract class HandlerMapper extends SimpleChannelInboundHandler<FullHttpRequest> {

    enum HttpMethods {
        PUT,
        POST,
        GET,
        DELETE
    }

    private final RequestMatcher matcher;

    protected HandlerMapper(HttpMethod method, String uriBase) {
        matcher = new RequestMatcher(method, uriBase);
    }

    protected HandlerMapper(String uriBase) {
        this(null, uriBase);
    }

    public boolean acceptInboundMessage(FullHttpRequest request) throws Exception {
        return matcher.match(request);
    }

    @Override
    public void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
        if (acceptInboundMessage(request)) {
            messageReceived(ctx, request);
        } else {
            ctx.fireChannelRead(request);
        }
    }

    protected abstract void messageReceived(ChannelHandlerContext ctx, FullHttpRequest msg) throws Exception;
}
