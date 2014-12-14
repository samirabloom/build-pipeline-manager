package com.buildmanager.api.server;

import com.buildmanager.api.configuration.RestAPIConfiguration;
import com.google.common.util.concurrent.SettableFuture;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.PooledByteBufAllocator;
import io.netty.channel.Channel;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.concurrent.TimeUnit;

/**
 * @author samirarabbanian
 */
public class BuildManager {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final EventLoopGroup group = new NioEventLoopGroup();

    public BuildManager(final int port) {

        final SettableFuture<String> hasStarted = SettableFuture.create();

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    logger.debug("Starting server on port: " + port);

                    ApplicationContext context = new AnnotationConfigApplicationContext(RestAPIConfiguration.class);

                    // make the connection attempt
                    Channel channel = new ServerBootstrap()
                            .option(ChannelOption.SO_BACKLOG, 1024)
                            .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
                            .group(group)
                            .channel(NioServerSocketChannel.class)
                            .childHandler(context.getBean(BuildManagerInitializer.class))
                            .bind(port)
                            .sync()
                            .channel();

                    hasStarted.set("STARTED");

                    channel.closeFuture().sync();
                } catch (Exception e) {
                    hasStarted.setException(e);
                } finally {
                    // shut down executor threads to exit
                    group.shutdownGracefully(2, 15, TimeUnit.MILLISECONDS);
                }
            }
        }).start();

        try {
            // wait for proxy to start all channels
            hasStarted.get();
        } catch (Exception e) {
            logger.debug("Exception starting BuildManager", e);
        }
    }

    public void stop() {

        group.shutdownGracefully(2, 15, TimeUnit.MILLISECONDS);
    }
}

