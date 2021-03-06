package com.buildmanager.api.server;

import com.buildmanager.api.server.handler.build.RestAPIBuildHandler;
import com.buildmanager.api.server.handler.StaticFileHandler;
import com.buildmanager.api.server.handler.pipeline.RestAPIPipelineHandler;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
//import io.netty.handler.codec.http.HttpContentCompressor;
import io.netty.handler.codec.http.HttpContentDecompressor;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.logging.LoggingHandler;
import io.netty.handler.stream.ChunkedWriteHandler;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @author samirarabbanian
 */
@Component
public class BuildManagerInitializer extends ChannelInitializer<SocketChannel> {

    @Resource
    private RestAPIBuildHandler restAPIBuildHandler;

    @Resource
    private RestAPIPipelineHandler restAPIPipelineHandler;

    @Override
    protected void initChannel(SocketChannel channel) throws Exception {

        channel.pipeline()
                .addLast(new LoggingHandler("<= RAW"))
                .addLast(new HttpServerCodec())
                .addLast(new LoggingHandler("<= HTTP-CHUNKED"))
                .addLast(new HttpContentDecompressor())
//                .addLast(new HttpContentCompressor())
                .addLast(new HttpObjectAggregator(Integer.MAX_VALUE))
                .addLast(new ChunkedWriteHandler())
                .addLast(new LoggingHandler("<= HTTP-FULL"))
                .addLast(restAPIBuildHandler)
                .addLast(restAPIPipelineHandler)
                .addLast(new StaticFileHandler());

    }
}
