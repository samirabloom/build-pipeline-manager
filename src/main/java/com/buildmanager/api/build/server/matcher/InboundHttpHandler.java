package com.buildmanager.api.build.server.matcher;

import com.google.common.base.Charsets;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import io.netty.util.ReferenceCountUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static io.netty.handler.codec.http.HttpHeaders.Names.*;
import static io.netty.handler.codec.http.HttpHeaders.Values.CLOSE;

public abstract class InboundHttpHandler extends SimpleChannelInboundHandler<FullHttpRequest> {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final RequestMatcher matcher;

    protected InboundHttpHandler(HttpMethod method, String uriBase) {
        super(false);
        matcher = new RequestMatcher(method, uriBase);
    }

    protected InboundHttpHandler(String uriBase) {
        this(null, uriBase);
    }

    public boolean acceptInboundMessage(FullHttpRequest request) throws Exception {
        return matcher.match(request);
    }

    @Override
    public void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
        boolean release = true;
        try {
            if (acceptInboundMessage(request)) {
                messageReceived(ctx, request);
            } else {
                release = false;
                ctx.fireChannelRead(request);
            }
        } finally {
            if (release) {
                ReferenceCountUtil.release(request);
            }
        }
    }

    protected enum HttpMethods {
        PUT,
        POST,
        GET,
        DELETE
    }

    protected abstract void messageReceived(ChannelHandlerContext ctx, FullHttpRequest msg) throws Exception;

    protected void sendResponse(ChannelHandlerContext ctx, FullHttpRequest httpRequest, HttpResponseStatus responseStatus) {
        sendResponse(ctx, httpRequest, "", null, responseStatus);
    }

    protected void sendResponse(ChannelHandlerContext ctx, FullHttpRequest httpRequest, String responseBody, String contentType, HttpResponseStatus responseStatus) {
        DefaultFullHttpResponse httpResponse = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, responseStatus, Unpooled.wrappedBuffer(responseBody.getBytes(Charsets.UTF_8)));
        if (responseBody.length() > 0) {
            httpResponse.headers().add(CONTENT_TYPE, contentType + "; charset=utf-8");
            httpResponse.headers().add(CONTENT_LENGTH, responseBody.length());
        }

        // FIXME why does this cause some of the tests to hang
//        if (isKeepAlive(httpRequest)) {
//            httpResponse.headers().add(CONNECTION, KEEP_ALIVE);
//            ctx.write(httpResponse);
//        } else {
        httpResponse.headers().add(CONNECTION, CLOSE);
        ctx.writeAndFlush(httpResponse).addListener(ChannelFutureListener.CLOSE);
//        }
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.flush();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        if (!cause.getMessage().contains("Connection reset by peer")) {
            logger.warn("Exception caught handling request", cause);
        }
        ctx.close();
    }
}
