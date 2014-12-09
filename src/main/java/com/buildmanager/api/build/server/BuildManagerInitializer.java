package com.buildmanager.api.build.server;

import com.buildmanager.api.build.server.handler.RestAPIHandler;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpContentCompressor;
import io.netty.handler.codec.http.HttpContentDecompressor;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.logging.LoggingHandler;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @author samirarabbanian
 */
@Component
public class BuildManagerInitializer extends ChannelInitializer<SocketChannel> {

    @Resource
    private RestAPIHandler restAPIHandler;

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
                .addLast(restAPIHandler);

    }
}
