package com.buildmanager.api.build.server.handler;

import com.buildmanager.api.build.server.matcher.InboundHttpHandler;
import com.google.common.base.Charsets;
import com.google.common.base.Strings;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.QueryStringDecoder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 * @author samirarabbanian
 */
@Component
@ChannelHandler.Sharable
public class StaticHandler extends InboundHttpHandler {

    private final String classpathBase;

    private final static Map<String, String> CONTENT_TYPES = new HashMap<String, String>() {{
        put("html", "text/html");
        put("jpeg", "image/jpeg");
        put("jpg", "image/jpeg");
        put("png", "image/png");
        put("js", "text/javascript");
        put("json", "text/javascript");
        put("pdf", "application/pdf");
        put("css", "text/css");
        put("woff", "application/font-woff");
    }};

    public StaticHandler() throws IOException {
        super(HttpMethod.GET, "/.*");

        String classLocation = this.getClass().getCanonicalName().replace(".", "/") + ".class";
        URL resource = this.getClass().getClassLoader().getResource(classLocation);
        if (resource != null) {
            classpathBase = resource.toString().replace(classLocation, "").replace("file:", "");
        } else {
            classpathBase = "";
        }
    }

    @Override
    protected void messageReceived(ChannelHandlerContext ctx, FullHttpRequest httpRequest) throws Exception {
        String path = new QueryStringDecoder(httpRequest.getUri()).path();
        if (path.equals("/")) {
            path = "index.html";
        }
        String contentType = CONTENT_TYPES.get(StringUtils.substringAfterLast(path, "."));
        if (Strings.isNullOrEmpty(contentType)) {
            contentType = "text/html";
        }

        RandomAccessFile file = null;

        try {
            file = new RandomAccessFile(classpathBase + path, "r");
            long length = file.length();
            if (length <= Integer.MAX_VALUE) {
                byte[] data = new byte[(int) length];
                file.readFully(data);

                sendResponse(ctx, httpRequest, new String(data, Charsets.UTF_8), contentType, HttpResponseStatus.OK);
            }

//            if (ctx.pipeline().get(SslHandler.class) == null) {
//                // SSL not enabled use zero-copy file transfer
//                ctx.write(new DefaultFileRegion(file.getChannel(), 0, length));
//            } else {
//                // SSL enabled cannot use zero-copy file transfer
//                ctx.write(new ChunkedFile(file));
//            }

        } catch (Exception e) {
            logger.error("Exception while loading file", e);
            sendResponse(ctx, httpRequest, HttpResponseStatus.INTERNAL_SERVER_ERROR);
        } finally {
            if (file != null) {
                file.close();
            }
        }
    }
}






