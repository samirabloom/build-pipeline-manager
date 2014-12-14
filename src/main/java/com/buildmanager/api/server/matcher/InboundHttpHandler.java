package com.buildmanager.api.server.matcher;

import com.google.common.base.Charsets;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import io.netty.util.ReferenceCountUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static io.netty.handler.codec.http.HttpHeaders.Names.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaders.Names.CONTENT_TYPE;
import static io.netty.handler.codec.http.HttpHeaders.Values.CLOSE;
import static io.netty.handler.codec.http.HttpHeaders.setContentLength;
import static io.netty.handler.codec.http.HttpResponseStatus.*;

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

    @Override
    public void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
        if (!request.getDecoderResult().isSuccess()) {
            sendError(ctx, BAD_REQUEST);
            return;
        }
        boolean release = true;
        try {
            // FIXME introduce a match result to avoid doing path matching twice
            if (matcher.pathMatches(request) && !matcher.methodMatches(request)) {
                sendError(ctx, METHOD_NOT_ALLOWED);
            } else if (matcher.matches(request)) {
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

    protected void sendError(ChannelHandlerContext ctx, HttpResponseStatus responseStatus) {
        sendResponse(ctx, "", "text/plain", responseStatus);
    }

    protected void sendResponse(ChannelHandlerContext ctx, String responseBody, String contentType, HttpResponseStatus responseStatus) {
        DefaultFullHttpResponse httpResponse = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, responseStatus, Unpooled.wrappedBuffer(responseBody.getBytes(Charsets.UTF_8)));
        if (responseBody.length() > 0) {
            setContentLength(httpResponse, responseBody.length());
        }
        httpResponse.headers().add(CONTENT_TYPE, contentType + "; charset=utf-8");

        httpResponse.headers().add(CONNECTION, CLOSE);
        ctx.writeAndFlush(httpResponse).addListener(ChannelFutureListener.CLOSE);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        if (!cause.getMessage().contains("Connection reset by peer")) {
            logger.warn("Exception caught handling request", cause);
        }
        if (ctx.channel().isActive()) {
            sendError(ctx, INTERNAL_SERVER_ERROR);
        }
        ctx.close();
    }
}
