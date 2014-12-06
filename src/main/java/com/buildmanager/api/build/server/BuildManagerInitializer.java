package com.buildmanager.api.build.server;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpContentCompressor;
import io.netty.handler.codec.http.HttpContentDecompressor;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author samirarabbanian
 */
public class BuildManagerInitializer extends ChannelInitializer<SocketChannel> {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    protected void initChannel(SocketChannel channel) throws Exception {

        channel.pipeline()
                .addLast(new LoggingHandler("<= RAW"))
                .addLast(new HttpServerCodec())
                .addLast(new LoggingHandler("<= HTTP-CHUNKED"))
                .addLast(new HttpContentDecompressor())
                .addLast(new HttpContentCompressor())
                .addLast(new HttpObjectAggregator(Integer.MAX_VALUE))
                .addLast(new LoggingHandler("<= HTTP-FULL"))
                .addLast(new RestAPIHandler());

    }
}
