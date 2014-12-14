package com.buildmanager.api.server.handler;

import com.buildmanager.api.build.uuid.UUIDFactory;
import com.buildmanager.api.domain.Entity;
import com.buildmanager.api.json.BindingError;
import com.buildmanager.api.json.JsonValidator;
import com.buildmanager.api.respository.Repository;
import com.buildmanager.api.server.matcher.InboundHttpHandler;
import com.buildmanager.json.ObjectMapperFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Charsets;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.QueryStringDecoder;
import org.apache.commons.lang3.StringUtils;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * @author samirarabbanian
 */
@ChannelHandler.Sharable
public class RestAPIHandler<T extends Entity> extends InboundHttpHandler {
    private final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();
    private final Class<T> entityClass;
    private final Repository<T> entityRepository;
    private final JsonValidator jsonValidator;

    @Resource
    protected UUIDFactory uuidFactory;

    public RestAPIHandler(Class<T> entityClass, String uriBase, Repository<T> entityRepository, JsonValidator jsonValidator) throws IOException {
        super(uriBase);
        this.entityClass = entityClass;
        this.entityRepository = entityRepository;
        this.jsonValidator = jsonValidator;
    }

    @Override
    protected void messageReceived(ChannelHandlerContext ctx, FullHttpRequest httpRequest) throws Exception {
        String jsonRequest = httpRequest.content().readBytes(httpRequest.content().readableBytes()).toString(Charsets.UTF_8);

        switch (HttpMethods.valueOf(httpRequest.getMethod().name())) {
            case PUT: {
                if (validateJson(ctx, jsonRequest)) {
                    UUID entityId = decodeUUID(ctx, httpRequest.getUri(), true);
                    if (entityId != null) {
                        T updaterEntity = objectMapper.readValue(jsonRequest, entityClass);
                        T existingEntity = entityRepository.load(entityId);
                        if (existingEntity != null) {
                            existingEntity.update(updaterEntity);
                            entityRepository.save(existingEntity);
                            sendResponse(ctx, objectMapper.writeValueAsString(existingEntity), "application/json", HttpResponseStatus.ACCEPTED);
                        } else {
                            sendError(ctx, HttpResponseStatus.NOT_FOUND);
                        }
                    }
                }
                break;
            }
            case POST: {
                if (validateJson(ctx, jsonRequest)) {
                    T entity = objectMapper.readValue(jsonRequest, entityClass);
                    entity.setId(uuidFactory.generateUUID());
                    entityRepository.save(entity);
                    sendResponse(ctx, objectMapper.writeValueAsString(entity), "application/json", HttpResponseStatus.ACCEPTED);
                }
                break;
            }
            case GET: {
                UUID entityId = decodeUUID(ctx, httpRequest.getUri(), false);
                if (entityId != null) {
                    T retrievedEntity = entityRepository.load(entityId);
                    if (retrievedEntity != null) {
                        sendResponse(ctx, objectMapper.writeValueAsString(retrievedEntity), "application/json", HttpResponseStatus.OK);
                    } else {
                        sendError(ctx, HttpResponseStatus.NOT_FOUND);
                    }
                } else {
                    List<T> retrievedEntitys = entityRepository.loadAll();
                    sendResponse(ctx, objectMapper.writeValueAsString(retrievedEntitys), "application/json", HttpResponseStatus.OK);
                }
                break;
            }
            case DELETE: {
                UUID entityId = decodeUUID(ctx, httpRequest.getUri(), true);
                if (entityId != null) {
                    T retrievedEntity = entityRepository.load(entityId);
                    if (retrievedEntity != null) {
                        entityRepository.delete(entityId);
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
            entityId = UUID.fromString(StringUtils.substringAfter(queryStringDecoder.path(), "/api/build/"));
        } catch (IllegalArgumentException iae) {
            if (mustExist) {
                sendResponse(ctx, objectMapper.writeValueAsString(Arrays.asList(iae.getMessage())), "application/json", HttpResponseStatus.BAD_REQUEST);
            }
        }
        return entityId;
    }
}





