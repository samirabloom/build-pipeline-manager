package com.buildmanager.api.build;

import com.google.common.util.concurrent.SettableFuture;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.FullHttpResponse;

public class HttpClientHandler extends SimpleChannelInboundHandler<FullHttpResponse> {

    private final SettableFuture<FullHttpResponse> responseFuture = SettableFuture.<FullHttpResponse>create();

    public SettableFuture<FullHttpResponse> getResponseFuture() {
        return responseFuture;
    }

    public HttpClientHandler() {
        super(false);
    }

    @Override
    public void channelRead0(ChannelHandlerContext ctx, FullHttpResponse response) {
        responseFuture.set(response);
        ctx.close();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        responseFuture.setException(cause);
        ctx.close();
    }
}