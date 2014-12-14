package com.buildmanager.api.build.server.handler;

import com.buildmanager.api.build.domain.Build;
import com.buildmanager.api.build.json.BindingError;
import com.buildmanager.api.build.json.JsonValidator;
import com.buildmanager.api.build.respository.BuildRepository;
import com.buildmanager.api.build.server.matcher.InboundHttpHandler;
import com.buildmanager.json.ObjectMapperFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Charsets;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.QueryStringDecoder;
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
public class RestAPIHandler extends InboundHttpHandler {
    private final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();

    private final BuildRepository buildRepository;
    private final JsonValidator jsonValidator;

    @Autowired
    public RestAPIHandler(BuildRepository buildRepository) throws IOException {
        super("/api/build.*");
        this.buildRepository = buildRepository;
        jsonValidator = new JsonValidator("/json/messages/build/build_validation_messages.properties", "/json/schemas/build/build_json_schema.json");
    }

    @Override
    protected void messageReceived(ChannelHandlerContext ctx, FullHttpRequest httpRequest) throws Exception {
        String jsonRequest = httpRequest.content().readBytes(httpRequest.content().readableBytes()).toString(Charsets.UTF_8);

        switch (HttpMethods.valueOf(httpRequest.getMethod().name())) {
            case PUT: {
                if (validateJson(ctx, jsonRequest)) {
                    UUID buildId = decodeUUID(ctx, httpRequest.getUri(), true);
                    if (buildId != null) {
                        Build updaterBuild = objectMapper.readValue(jsonRequest, Build.class);
                        Build existingBuild = buildRepository.load(buildId);
                        if (existingBuild != null) {
                            existingBuild.update(updaterBuild);
                            buildRepository.save(existingBuild);
                            sendResponse(ctx, objectMapper.writeValueAsString(existingBuild), "application/json", HttpResponseStatus.ACCEPTED);
                        } else {
                            sendError(ctx, HttpResponseStatus.NOT_FOUND);
                        }
                    }
                }
                break;
            }
            case POST: {
                if (validateJson(ctx, jsonRequest)) {
                    Build build = objectMapper.readValue(jsonRequest, Build.class);
                    build.setId(UUID.randomUUID());
                    buildRepository.save(build);
                    sendResponse(ctx, objectMapper.writeValueAsString(build), "application/json", HttpResponseStatus.ACCEPTED);
                }
                break;
            }
            case GET: {
                UUID buildId = decodeUUID(ctx, httpRequest.getUri(), false);
                if (buildId != null) {
                    Build retrievedBuild = buildRepository.load(buildId);
                    if (retrievedBuild != null) {
                        sendResponse(ctx, objectMapper.writeValueAsString(retrievedBuild), "application/json", HttpResponseStatus.OK);
                    } else {
                        sendError(ctx, HttpResponseStatus.NOT_FOUND);
                    }
                } else {
                    List<Build> retrievedBuilds = buildRepository.loadAll();
                    sendResponse(ctx, objectMapper.writeValueAsString(retrievedBuilds), "application/json", HttpResponseStatus.OK);
                }
                break;
            }
            case DELETE: {
                UUID buildId = decodeUUID(ctx, httpRequest.getUri(), true);
                if (buildId != null) {
                    Build retrievedBuild = buildRepository.load(buildId);
                    if (retrievedBuild != null) {
                        buildRepository.delete(buildId);
                        sendError(ctx, HttpResponseStatus.ACCEPTED);
                    } else {
                        sendError(ctx, HttpResponseStatus.NOT_FOUND);
                    }
                }
                break;
            }
            default:
                sendError(ctx, HttpResponseStatus.METHOD_NOT_ALLOWED);
        }
    }

    private boolean validateJson(ChannelHandlerContext ctx, String jsonRequest) throws Exception {
        List<BindingError> errorMessages = jsonValidator.jsonValidator(jsonRequest);
        if (!errorMessages.isEmpty()) {
            sendResponse(ctx, objectMapper.writeValueAsString(errorMessages), "application/json", HttpResponseStatus.BAD_REQUEST);
        }
        return errorMessages.isEmpty();
    }

    private UUID decodeUUID(ChannelHandlerContext ctx, String uri, boolean mustExist) throws Exception {
        QueryStringDecoder queryStringDecoder = new QueryStringDecoder(uri);
        UUID buildId = null;
        try {
            buildId = UUID.fromString(StringUtils.substringAfter(queryStringDecoder.path(), "/api/build/"));
        } catch (IllegalArgumentException iae) {
            if (mustExist) {
                sendResponse(ctx, objectMapper.writeValueAsString(Arrays.asList(iae.getMessage())), "application/json", HttpResponseStatus.BAD_REQUEST);
            }
        }
        return buildId;
    }
}






