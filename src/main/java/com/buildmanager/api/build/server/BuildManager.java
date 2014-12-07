package com.buildmanager.api.build.server;

import com.buildmanager.api.build.domain.Build;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.PooledByteBufAllocator;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * @author samirarabbanian
 */
public class BuildManager {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final EventLoopGroup group = new NioEventLoopGroup();

    public BuildManager(final int port) {
        logger.debug("Starting server on port: " + port);

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {

                    // make the connection attempt
                    new ServerBootstrap()
                            .option(ChannelOption.SO_BACKLOG, 1024)
                            .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
                            .group(group)
                            .channel(NioServerSocketChannel.class)
                            .childHandler(new BuildManagerInitializer())
                            .bind(port)
                            .sync()
                            .channel()
                            .closeFuture()
                            .sync();


                } catch (Exception e) {
                    throw new RuntimeException("Exception while sending request", e);
                } finally {
                    // shut down executor threads to exit
                    group.shutdownGracefully(2, 15, TimeUnit.MILLISECONDS);
                }
            }
        }).start();
    }

    public void stop() {

        group.shutdownGracefully(2, 15, TimeUnit.MILLISECONDS);
    }
}

