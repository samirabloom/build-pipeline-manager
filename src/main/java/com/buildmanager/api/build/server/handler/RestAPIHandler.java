package com.buildmanager.api.build.server.handler;

import com.buildmanager.api.build.json.BindingError;
import com.buildmanager.api.build.json.JsonValidator;
import com.buildmanager.api.build.domain.Build;
import com.buildmanager.api.build.respository.BuildRepository;
import com.buildmanager.json.ObjectMapperFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Charsets;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * @author samirarabbanian
 */
@Component
@ChannelHandler.Sharable
public class RestAPIHandler extends HandlerMapper {
    private final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();

    private final BuildRepository buildRepository;
    private final JsonValidator jsonValidator;

    @Autowired
    public RestAPIHandler(BuildRepository buildRepository) throws IOException {
        super("/buildManager/build.*");
        this.buildRepository = buildRepository;
        jsonValidator = new JsonValidator("/json/messages/build/build_validation_messages.properties", "/json/schemas/build/build_json_schema.json");
    }

    @Override
    protected void messageReceived(ChannelHandlerContext ctx, FullHttpRequest httpRequest) throws Exception {
        String jsonRequest = httpRequest.content().readBytes(httpRequest.content().readableBytes()).toString(Charsets.UTF_8);

        switch (HttpMethods.valueOf(httpRequest.getMethod().name())) {
            case PUT: {
                if (validateJson(ctx, jsonRequest)) {
                    Build build = objectMapper.readValue(jsonRequest, Build.class);
                    build.setId(UUID.randomUUID());
                    buildRepository.save(build);
                    ctx.writeAndFlush(createResponse(objectMapper.writeValueAsString(build), HttpResponseStatus.ACCEPTED));
                }
                break;
            }
            case POST: {
                if (validateJson(ctx, jsonRequest)) {
                    UUID buildId = decodeUUID(ctx, httpRequest.getUri());
                    if (buildId != null) {
                        Build updaterBuild = objectMapper.readValue(jsonRequest, Build.class);
                        Build existingBuild = buildRepository.load(buildId);
                        if (existingBuild != null) {
                            existingBuild.update(updaterBuild);
                            buildRepository.save(existingBuild);
                            ctx.writeAndFlush(createResponse(objectMapper.writeValueAsString(existingBuild), HttpResponseStatus.ACCEPTED));
                        } else {
                            ctx.writeAndFlush(createResponse("", HttpResponseStatus.NOT_FOUND));
                        }
                    }
                }
                break;
            }
            case GET: {
                UUID buildId = decodeUUID(ctx, httpRequest.getUri());
                if (buildId != null) {
                    Build retrievedBuild = buildRepository.load(buildId);
                    if (retrievedBuild != null) {
                        ctx.writeAndFlush(createResponse(objectMapper.writeValueAsString(retrievedBuild), HttpResponseStatus.OK));
                    } else {
                        ctx.writeAndFlush(createResponse("", HttpResponseStatus.NOT_FOUND));
                    }
                }
                break;
            }
            case DELETE: {
                UUID buildId = decodeUUID(ctx, httpRequest.getUri());
                if (buildId != null) {
                    Build retrievedBuild = buildRepository.load(buildId);
                    if (retrievedBuild != null) {
                        buildRepository.delete(buildId);
                        ctx.writeAndFlush(createResponse("", HttpResponseStatus.ACCEPTED));
                    } else {
                        ctx.writeAndFlush(createResponse("", HttpResponseStatus.NOT_FOUND));
                    }
                }
                break;
            }
            default:
                ctx.writeAndFlush(createResponse("", HttpResponseStatus.METHOD_NOT_ALLOWED));
        }

        ctx.close();
    }

    private DefaultFullHttpResponse createResponse(String responseBody, HttpResponseStatus responseStatus) {
        return new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, responseStatus, Unpooled.wrappedBuffer(responseBody.getBytes(Charsets.UTF_8)));
    }

    private boolean validateJson(ChannelHandlerContext ctx, String jsonRequest) throws Exception {
        List<BindingError> errorMessages = jsonValidator.jsonValidator(jsonRequest);
        if (!errorMessages.isEmpty()) {
            ctx.writeAndFlush(createResponse(objectMapper.writeValueAsString(errorMessages), HttpResponseStatus.BAD_REQUEST));
        }
        return errorMessages.isEmpty();
    }

    private UUID decodeUUID(ChannelHandlerContext ctx, String uri) throws Exception {
        QueryStringDecoder queryStringDecoder = new QueryStringDecoder(uri);
        try {
            return UUID.fromString(StringUtils.substringAfter(queryStringDecoder.path(), "/buildManager/build/"));
        } catch (IllegalArgumentException iae) {
            ctx.writeAndFlush(createResponse(objectMapper.writeValueAsString(Arrays.asList(iae.getMessage())), HttpResponseStatus.BAD_REQUEST));
        }
        return null;
    }
}






