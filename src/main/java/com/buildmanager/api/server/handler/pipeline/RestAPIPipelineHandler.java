package com.buildmanager.api.server.handler.pipeline;

import com.buildmanager.api.domain.Pipeline;
import com.buildmanager.api.json.BindingError;
import com.buildmanager.api.json.JsonValidator;
import com.buildmanager.api.respository.PipelineRepository;
import com.buildmanager.api.server.matcher.InboundHttpHandler;
import com.buildmanager.api.uuid.UUIDFactory;
import com.google.common.base.Charsets;
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
public class RestAPIPipelineHandler extends InboundHttpHandler {

    @Resource
    private PipelineRepository pipelineRepository;

    @Resource
    protected UUIDFactory uuidFactory;

    private JsonValidator jsonValidator;

    public RestAPIPipelineHandler() throws IOException {
        super("/api/pipeline.*");
        this.jsonValidator = new JsonValidator("/json/messages/pipeline/pipeline_validation_messages.properties", "/json/schemas/pipeline/pipeline_json_schema.json");
    }

    @Override
    protected void messageReceived(ChannelHandlerContext ctx, FullHttpRequest httpRequest) throws Exception {
        String jsonRequest = httpRequest.content().readBytes(httpRequest.content().readableBytes()).toString(Charsets.UTF_8);

        HttpMethods method = HttpMethods.valueOf(httpRequest.getMethod().name());
        switch (method) {
            case PUT: {
                if (validateJson(ctx, jsonRequest)) {
                    UUID entityId = decodeUUID(ctx, httpRequest.getUri(), true);
                    if (entityId != null) {
                        Pipeline updaterEntity = objectMapper.readValue(jsonRequest, Pipeline.class);
                        Pipeline existingEntity = pipelineRepository.load(entityId);
                        if (existingEntity != null) {
                            existingEntity.update(updaterEntity);
                            pipelineRepository.save(existingEntity);
                            sendResponse(ctx, existingEntity, HttpResponseStatus.ACCEPTED);
                        } else {
                            sendError(ctx, HttpResponseStatus.NOT_FOUND);
                        }
                    }
                }
                break;
            }
            case POST: {
                if (validateJson(ctx, jsonRequest)) {
                    Pipeline entity = objectMapper.readValue(jsonRequest, Pipeline.class);
                    entity.setId(uuidFactory.generateUUID());
                    pipelineRepository.save(entity);
                    sendResponse(ctx, entity, HttpResponseStatus.ACCEPTED);
                }
                break;
            }
            case GET: {
                UUID entityId = decodeUUID(ctx, httpRequest.getUri(), false);
                if (entityId != null) {
                    Pipeline retrievedEntity = pipelineRepository.load(entityId);
                    if (retrievedEntity != null) {
                        sendResponse(ctx, retrievedEntity, HttpResponseStatus.OK);
                    } else {
                        sendError(ctx, HttpResponseStatus.NOT_FOUND);
                    }
                } else {
                    List<Pipeline> retrievedEntities = pipelineRepository.loadAll();
                    sendResponse(ctx, retrievedEntities, HttpResponseStatus.OK);
                }
                break;
            }
            case DELETE: {
                UUID entityId = decodeUUID(ctx, httpRequest.getUri(), true);
                if (entityId != null) {
                    Pipeline retrievedEntity = pipelineRepository.load(entityId);
                    if (retrievedEntity != null) {
                        pipelineRepository.delete(entityId);
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
