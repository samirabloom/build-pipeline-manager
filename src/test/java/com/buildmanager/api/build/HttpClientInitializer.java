package com.buildmanager.api.build;

import com.buildmanager.api.build.server.LoggingHandler;
import com.google.common.util.concurrent.SettableFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpClientCodec;
import io.netty.handler.codec.http.HttpObjectAggregator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.net.ssl.SSLException;

public class HttpClientInitializer extends ChannelInitializer<SocketChannel> {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private HttpClientHandler httpClientHandler = new HttpClientHandler();

    @Override
    public void initChannel(SocketChannel channel) throws SSLException {
        channel.pipeline()
                .addLast(new LoggingHandler("                    => RAW"))
                .addLast(new HttpClientCodec())
                .addLast(new LoggingHandler("                    => HTTP-CHUNKED"))
                .addLast(new HttpObjectAggregator(Integer.MAX_VALUE))
                .addLast(new LoggingHandler("                    => HTTP-FULL"))
                .addLast(httpClientHandler);
    }

    public SettableFuture<FullHttpResponse> responseFuture() {
        return httpClientHandler.getResponseFuture();
    }
}