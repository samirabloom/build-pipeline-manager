package com.buildmanager.api.server.handler.build;

import com.buildmanager.api.domain.Build;
import com.buildmanager.api.domain.Pipeline;
import com.buildmanager.api.domain.Stage;
import com.buildmanager.api.json.BindingError;
import com.buildmanager.api.json.JsonValidator;
import com.buildmanager.api.respository.BuildRepository;
import com.buildmanager.api.respository.PipelineRepository;
import com.buildmanager.api.server.matcher.InboundHttpHandler;
import com.buildmanager.api.uuid.UUIDFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.github.fge.msgsimple.bundle.MessageBundle;
import com.github.fge.msgsimple.bundle.PropertiesBundle;
import com.google.common.base.Charsets;
import com.google.common.base.Function;
import com.google.common.collect.Lists;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.QueryStringDecoder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * @author samirarabbanian
 */
@Component
@ChannelHandler.Sharable
public class RestAPIBuildHandler extends InboundHttpHandler {

    @Resource
    private BuildRepository buildRepository;

    @Resource
    private PipelineRepository pipelineRepository;

    @Resource
    protected UUIDFactory uuidFactory;

    private JsonValidator newJsonValidator;
    private JsonValidator updateJsonValidator;

    private final MessageBundle messageBundle = PropertiesBundle.forPath("/json/messages/build/build_validation_messages.properties");

    public RestAPIBuildHandler() throws IOException {
        super("/api/build.*");
        this.newJsonValidator = new JsonValidator("/json/messages/build/build_validation_messages.properties", "/json/schemas/build/new_build_json_schema.json");
        this.updateJsonValidator = new JsonValidator("/json/messages/build/build_validation_messages.properties", "/json/schemas/build/update_build_json_schema.json");
    }

    @Override
    protected void messageReceived(ChannelHandlerContext ctx, FullHttpRequest httpRequest) throws Exception {
        String jsonRequest = httpRequest.content().readBytes(httpRequest.content().readableBytes()).toString(Charsets.UTF_8);

        HttpMethods method = HttpMethods.valueOf(httpRequest.getMethod().name());
        switch (method) {
            case PUT: {
                if (validateJson(ctx, method, jsonRequest)) {
                    UUID entityId = decodeUUID(ctx, httpRequest.getUri(), true);
                    if (entityId != null) {
                        Build updaterEntity = objectMapper.readValue(jsonRequest, Build.class);
                        Build existingEntity = buildRepository.load(entityId);
                        if (existingEntity != null) {
                            existingEntity.update(updaterEntity);
                            buildRepository.save(existingEntity);
                            sendResponse(ctx, existingEntity, HttpResponseStatus.ACCEPTED);
                        } else {
                            sendError(ctx, HttpResponseStatus.NOT_FOUND);
                        }
                    }
                }
                break;
            }
            case POST: {
                if (validateJson(ctx, method, jsonRequest)) {
                    Build entity = objectMapper.readValue(jsonRequest, Build.class);
                    entity.setId(uuidFactory.generateUUID());
                    buildRepository.save(entity);
                    sendResponse(ctx, entity, HttpResponseStatus.ACCEPTED);
                }
                break;
            }
            case GET: {
                UUID entityId = decodeUUID(ctx, httpRequest.getUri(), false);
                if (entityId != null) {
                    Build retrievedEntity = buildRepository.load(entityId);
                    if (retrievedEntity != null) {
                        sendResponse(ctx, retrievedEntity, HttpResponseStatus.OK);
                    } else {
                        sendError(ctx, HttpResponseStatus.NOT_FOUND);
                    }
                } else {
                    List<Build> retrievedEntities = buildRepository.loadAll();
                    sendResponse(ctx, retrievedEntities, HttpResponseStatus.OK);
                }
                break;
            }
            case DELETE: {
                UUID entityId = decodeUUID(ctx, httpRequest.getUri(), true);
                if (entityId != null) {
                    Build retrievedEntity = buildRepository.load(entityId);
                    if (retrievedEntity != null) {
                        buildRepository.delete(entityId);
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

    private boolean validateJson(ChannelHandlerContext ctx, HttpMethods method, String jsonRequest) throws Exception {
        JsonValidator jsonValidator = newJsonValidator;
        if (method == HttpMethods.PUT) {
            jsonValidator = updateJsonValidator;
        }
        List<BindingError> errorMessages = jsonValidator.jsonValidator(jsonRequest);
        JsonNode build = objectMapper.readTree(jsonRequest);
        if (build.get("pipelineId") != null) {
            UUID pipelineId = null;
            try {
                pipelineId = UUID.fromString(build.get("pipelineId").asText());
            } catch (Exception e) {
                // do nothing
            }
            if (pipelineId != null) {
                Pipeline pipeline = pipelineRepository.load(pipelineId);
                if (pipeline != null) {
                    if (build.get("stage") != null && !pipeline.containsStage(build.get("stage").asText())) {
                        errorMessages.add(new BindingError("stage", "enum", String.format(messageBundle.getMessage("err.stage.enum"), Lists.transform(pipeline.getStages(), new Function<Stage, String>() {
                            public String apply(Stage input) {
                                return input.getName();
                            }
                        }))));
                    }
                }
            }
        }
        if (!errorMessages.isEmpty()) {
            sendResponse(ctx, objectMapper.writeValueAsString(errorMessages), "application/json", HttpResponseStatus.BAD_REQUEST);
        }
        return errorMessages.isEmpty();
    }

    private UUID decodeUUID(ChannelHandlerContext ctx, String uri, boolean mustExist) throws Exception {
        QueryStringDecoder queryStringDecoder = new QueryStringDecoder(uri);
        UUID entityId = null;
        try {
            entityId = UUID.fromString(StringUtils.substringAfterLast(queryStringDecoder.path(), "/"));
        } catch (IllegalArgumentException iae) {
            if (mustExist) {
                sendResponse(ctx, objectMapper.writeValueAsString(Arrays.asList(iae.getMessage())), "application/json", HttpResponseStatus.BAD_REQUEST);
            }
        }
        return entityId;
    }
}
