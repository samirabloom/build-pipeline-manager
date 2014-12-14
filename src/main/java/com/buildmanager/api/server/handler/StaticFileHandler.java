package com.buildmanager.api.server.handler;

import com.buildmanager.api.server.matcher.InboundHttpHandler;
import com.google.common.base.Strings;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.DefaultFileRegion;
import io.netty.handler.codec.http.*;
import io.netty.handler.ssl.SslHandler;
import io.netty.handler.stream.ChunkedFile;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.RandomAccessFile;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.*;

import static io.netty.handler.codec.http.HttpHeaders.Names.*;
import static io.netty.handler.codec.http.HttpHeaders.Values.KEEP_ALIVE;
import static io.netty.handler.codec.http.HttpHeaders.isKeepAlive;
import static io.netty.handler.codec.http.HttpResponseStatus.*;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;

/**
 * A simple handler that serves incoming HTTP requests to send their respective
 * HTTP responses.  It also implements {@code 'If-Modified-Since'} header to
 * take advantage of browser cache, as described in
 * <a href="http://tools.ietf.org/html/rfc2616#section-14.25">RFC 2616</a>.
 *
 * <h3>How Browser Caching Works</h3>
 *
 * Web browser caching works with HTTP headers as illustrated by the following
 * sample:
 * <ol>
 * <li>Request #1 returns the content of {@code /file1.txt}.</li>
 * <li>Contents of {@code /file1.txt} is cached by the browser.</li>
 * <li>Request #2 for {@code /file1.txt} does return the contents of the
 *     file again. Rather, a 304 Not Modified is returned. This tells the
 *     browser to use the contents stored in its cache.</li>
 * <li>The server knows the file has not been modified because the
 *     {@code If-Modified-Since} date is the same as the file's last
 *     modified date.</li>
 * </ol>
 *
 * <pre>
 * Request #1 Headers
 * ===================
 * GET /file1.txt HTTP/1.1
 *
 * Response #1 Headers
 * ===================
 * HTTP/1.1 200 OK
 * Date:               Tue, 01 Mar 2011 22:44:26 GMT
 * Last-Modified:      Wed, 30 Jun 2010 21:36:48 GMT
 * Expires:            Tue, 01 Mar 2012 22:44:26 GMT
 * Cache-Control:      private, max-age=31536000
 *
 * Request #2 Headers
 * ===================
 * GET /file1.txt HTTP/1.1
 * If-Modified-Since:  Wed, 30 Jun 2010 21:36:48 GMT
 *
 * Response #2 Headers
 * ===================
 * HTTP/1.1 304 Not Modified
 * Date:               Tue, 01 Mar 2011 22:44:28 GMT
 *
 * </pre>
 */
public class StaticFileHandler extends InboundHttpHandler {

    public static final String HTTP_DATE_FORMAT = "EEE, dd MMM yyyy HH:mm:ss zzz";
    public static final String HTTP_DATE_GMT_TIMEZONE = "GMT";
    public static final int HTTP_CACHE_SECONDS = 60;
    private final String classpathBase;

    private final static Map<String, String> CONTENT_TYPES = new HashMap<String, String>() {{
        put("html", "text/html");
        put("htm", "text/html");
        put("js", "text/javascript");
        put("json", "text/javascript");
        put("css", "text/css");
        put("woff", "application/font-woff");
        put("jpeg", "image/jpeg");
        put("jpg", "image/jpeg");
        put("jpe", "image/jpeg");
        put("png", "image/png");
        put("tiff", "image/tiff");
        put("tif", "image/tiff");
        put("tif", "image/tiff");
        put("gif", "application/pdf");
        put("mpeg", "audio/x-mpeg");
        put("mpg", "audio/x-mpeg");
        put("wav", "audio/x-wav");
        put("mpeg", "video/mpeg");
        put("mpg", "video/mpeg");
        put("mpe", "video/mpeg");
        put("qt", "video/quicktime");
        put("mov", "video/quicktime");
        put("avi", "video/x-msvideo");
    }};

    public StaticFileHandler() {
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
    public void messageReceived(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
        String path = sanitizeUri(request.getUri());
        if (path == null) {
            sendError(ctx, NOT_FOUND);
            return;
        }

        File file = new File(path);
        if (file.isHidden() || !file.exists() || !file.isFile()) {
            sendError(ctx, NOT_FOUND);
            return;
        }

        String ifModifiedSince = request.headers().get(IF_MODIFIED_SINCE);
        if (ifModifiedSince != null && !ifModifiedSince.isEmpty()) {
            SimpleDateFormat dateFormatter = new SimpleDateFormat(HTTP_DATE_FORMAT, Locale.US);
            Date ifModifiedSinceDate = dateFormatter.parse(ifModifiedSince);

            // only compare up to the second because datetime format send to client has no milliseconds
            long ifModifiedSinceDateSeconds = ifModifiedSinceDate.getTime() / 1000;
            long fileLastModifiedSeconds = file.lastModified() / 1000;
            if (ifModifiedSinceDateSeconds == fileLastModifiedSeconds) {
                sendNotModified(ctx);
                return;
            }
        }

        RandomAccessFile raf;
        try {
            raf = new RandomAccessFile(file, "r");
        } catch (FileNotFoundException ignore) {
            sendError(ctx, NOT_FOUND);
            return;
        }
        long fileLength = raf.length();

        HttpResponse response = new DefaultHttpResponse(HTTP_1_1, OK);
        HttpHeaders.setContentLength(response, fileLength);
        setContentTypeHeader(response, file);
        setDateAndCacheHeaders(response, file);
        if (isKeepAlive(request)) {
            response.headers().set(CONNECTION, KEEP_ALIVE);
        }

        // write headers
        ctx.write(response);

        // write body
        if (ctx.pipeline().get(SslHandler.class) == null) {
            ctx.write(new DefaultFileRegion(raf.getChannel(), 0, fileLength));
        } else {
            ctx.write(new HttpChunkedInput(new ChunkedFile(raf, 0, fileLength, 8192)));
        }

        // write final chunk
        ChannelFuture lastContentFuture = ctx.writeAndFlush(LastHttpContent.EMPTY_LAST_CONTENT);

        if (!isKeepAlive(request)) {
            lastContentFuture.addListener(ChannelFutureListener.CLOSE);
        }
    }

    private String sanitizeUri(String uri) {
        try {
            uri = URLDecoder.decode(uri, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            logger.error("Exception while parsing URL", e);
            return null;
        }

        // ensure you can't break out of the current folder
        uri = uri.replaceAll("\\.{2}", "");

        if (uri.endsWith("/")) {
            uri = uri + "index.html";
        }

        if (uri.startsWith("/")) {
            uri = StringUtils.substringAfter(uri, "/");
        }

        uri = uri.replace('/', File.separatorChar);

        return classpathBase + uri;
    }

    private void sendNotModified(ChannelHandlerContext ctx) {
        FullHttpResponse response = new DefaultFullHttpResponse(HTTP_1_1, NOT_MODIFIED);
        setDateHeader(response);

        // Close the connection as soon as the error message is sent.
        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }

    private void setDateHeader(FullHttpResponse response) {
        SimpleDateFormat dateFormatter = new SimpleDateFormat(HTTP_DATE_FORMAT, Locale.US);
        dateFormatter.setTimeZone(TimeZone.getTimeZone(HTTP_DATE_GMT_TIMEZONE));

        Calendar time = new GregorianCalendar();
        response.headers().set(DATE, dateFormatter.format(time.getTime()));
    }

    private void setDateAndCacheHeaders(HttpResponse response, File fileToCache) {
        SimpleDateFormat dateFormatter = new SimpleDateFormat(HTTP_DATE_FORMAT, Locale.US);
        dateFormatter.setTimeZone(TimeZone.getTimeZone(HTTP_DATE_GMT_TIMEZONE));

        // Date header
        Calendar time = new GregorianCalendar();
        response.headers().set(DATE, dateFormatter.format(time.getTime()));

        // Add cache headers
        time.add(Calendar.SECOND, HTTP_CACHE_SECONDS);
        response.headers().set(EXPIRES, dateFormatter.format(time.getTime()));
        response.headers().set(CACHE_CONTROL, "private, max-age=" + HTTP_CACHE_SECONDS);
        response.headers().set(LAST_MODIFIED, dateFormatter.format(new Date(fileToCache.lastModified())));
    }

    private void setContentTypeHeader(HttpResponse response, File file) {
        String contentType = CONTENT_TYPES.get(StringUtils.substringAfterLast(file.getName(), "."));
        if (Strings.isNullOrEmpty(contentType)) {
            contentType = "text/html";
        }
        response.headers().set(CONTENT_TYPE, contentType);
    }
}
