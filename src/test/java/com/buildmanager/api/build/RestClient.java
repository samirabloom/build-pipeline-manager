package com.buildmanager.api.build;

import com.google.common.base.Charsets;
import com.google.common.net.HttpHeaders;
import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.DefaultFullHttpRequest;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpVersion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

/**
 * @author samirarabbanian
 */
public class RestClient {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final String hostname;
    private final int port;

    public RestClient(String hostname, int port) {
        this.hostname = hostname;
        this.port = port;
    }

    public ClientResponse sendRequest(String method, String path, String body) {
        logger.debug("Sending request: " + method + " " + path + " with body:\n" + body);

        EventLoopGroup group = new NioEventLoopGroup();
        HttpClientInitializer channelInitializer = new HttpClientInitializer();

        try {

            // make the connection attempt
            Channel channel = new Bootstrap()
                    .group(group)
                    .channel(NioSocketChannel.class)
                    .handler(channelInitializer)
                    .connect(hostname, port).sync().channel();

            // send the HTTP request
            DefaultFullHttpRequest defaultFullHttpRequest = new DefaultFullHttpRequest(
                    HttpVersion.HTTP_1_1,
                    HttpMethod.valueOf(method),
                    path,
                    (body.isEmpty() ? Unpooled.buffer(0) : Unpooled.wrappedBuffer(body.getBytes(Charsets.UTF_8)))
            );
            if (!body.isEmpty()) {
                defaultFullHttpRequest.headers().add(HttpHeaders.CONTENT_LENGTH, body.getBytes(Charsets.UTF_8).length);
            }
            channel.writeAndFlush(defaultFullHttpRequest);

            // wait for response
            FullHttpResponse httpResponse = channelInitializer.responseFuture().get();

            logger.debug("Received response: " + httpResponse);

            // shutdown client
            group.shutdownGracefully(2, 15, TimeUnit.MILLISECONDS);

            int responseStatusCode = httpResponse.getStatus().code();
            String responseBody = httpResponse.content().readBytes(httpResponse.content().readableBytes()).toString(Charsets.UTF_8);

            return new ClientResponse(responseStatusCode, responseBody);

        } catch (Exception e) {
            throw new RuntimeException("Exception while sending request", e);
        } finally {
            // shut down executor threads to exit
            group.shutdownGracefully(2, 15, TimeUnit.MILLISECONDS);
        }
    }
}
