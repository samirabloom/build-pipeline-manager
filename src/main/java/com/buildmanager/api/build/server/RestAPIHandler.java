package com.buildmanager.api.build.server;

import com.buildmanager.api.build.domain.Build;
import com.buildmanager.api.build.respository.BuildRepository;
import com.buildmanager.json.ObjectMapperFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.core.report.ProcessingMessage;
import com.github.fge.jsonschema.core.report.ProcessingReport;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import com.github.fge.jsonschema.main.JsonValidator;
import com.google.common.base.Charsets;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * @author samirarabbanian
 */
@Component
@ChannelHandler.Sharable
public class RestAPIHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();

    private final BuildRepository buildRepository;

    @Autowired
    public RestAPIHandler(BuildRepository buildRepository) {
        this.buildRepository = buildRepository;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest httpRequest) throws Exception {
        String jsonRequest = httpRequest.content().readBytes(httpRequest.content().readableBytes()).toString(Charsets.UTF_8);
        String responseBody = "";
        HttpResponseStatus responseStatus;
        HttpMethod httpMethod = httpRequest.getMethod();

        if (httpMethod == HttpMethod.PUT) {
            JsonValidator jsonValidator = JsonSchemaFactory.byDefault().getValidator();
            JsonNode buildSchema = JsonLoader.fromResource("/json/schemas/build_json_schema.json");
            ProcessingReport validationReport = jsonValidator.validate(buildSchema, objectMapper.readTree(jsonRequest));
            if (validationReport.isSuccess()) {
                Build build = objectMapper.readValue(jsonRequest, Build.class);
                build.setId(UUID.randomUUID());
                buildRepository.save(build);
                responseBody = objectMapper.writeValueAsString(build);
                responseStatus = HttpResponseStatus.ACCEPTED;
            } else {
                List<String> errorMessages = new ArrayList<>();
                for (ProcessingMessage processingMessage : validationReport) {
                    errorMessages.add(processingMessage.getMessage());
                }
                responseBody = objectMapper.writeValueAsString(errorMessages);
                responseStatus = HttpResponseStatus.BAD_REQUEST;
            }
        } else if (httpMethod == HttpMethod.GET) {
            QueryStringDecoder queryStringDecoder = new QueryStringDecoder(httpRequest.getUri());
            try {
                UUID buildId = UUID.fromString(StringUtils.substringAfter(queryStringDecoder.path(), "/buildManager/build/"));
                Build retrievedBuild = buildRepository.load(buildId);
                if (retrievedBuild != null) {
                    responseBody = objectMapper.writeValueAsString(retrievedBuild);
                    responseStatus = HttpResponseStatus.OK;
                } else {
                    responseStatus = HttpResponseStatus.NOT_FOUND;
                }
            } catch (IllegalArgumentException iae) {
                responseBody = objectMapper.writeValueAsString(Arrays.asList(iae.getMessage()));
                responseStatus = HttpResponseStatus.BAD_REQUEST;
            }
        } else if (httpMethod == HttpMethod.DELETE) {
            QueryStringDecoder queryStringDecoder = new QueryStringDecoder(httpRequest.getUri());
            try {
                UUID buildId = UUID.fromString(StringUtils.substringAfter(queryStringDecoder.path(), "/buildManager/build/"));
                Build retrievedBuild = buildRepository.load(buildId);
                if (retrievedBuild != null) {
                    buildRepository.delete(buildId);
                    responseStatus = HttpResponseStatus.OK;
                } else {
                    responseStatus = HttpResponseStatus.NOT_FOUND;
                }
            } catch (IllegalArgumentException iae) {
                responseBody = objectMapper.writeValueAsString(Arrays.asList(iae.getMessage()));
                responseStatus = HttpResponseStatus.BAD_REQUEST;
            }
        } else if (httpMethod == HttpMethod.POST) {
            JsonValidator jsonValidator = JsonSchemaFactory.byDefault().getValidator();
            JsonNode buildSchema = JsonLoader.fromResource("/json/schemas/build_json_schema.json");
            ProcessingReport validationReport = jsonValidator.validate(buildSchema, objectMapper.readTree(jsonRequest));
            if (validationReport.isSuccess()) {
                QueryStringDecoder queryStringDecoder = new QueryStringDecoder(httpRequest.getUri());
                try {
                    UUID buildId = UUID.fromString(StringUtils.substringAfter(queryStringDecoder.path(), "/buildManager/build/"));
                    Build updaterBuild = objectMapper.readValue(jsonRequest, Build.class);
                    Build existingBuild = buildRepository.load(buildId);
                    if (existingBuild != null) {
                        responseBody = objectMapper.writeValueAsString(existingBuild.update(updaterBuild));
                        responseStatus = HttpResponseStatus.OK;
                    } else {
                        responseStatus = HttpResponseStatus.NOT_FOUND;
                    }
                } catch (IllegalArgumentException iae) {
                    responseBody = objectMapper.writeValueAsString(Arrays.asList(iae.getMessage()));
                    responseStatus = HttpResponseStatus.BAD_REQUEST;
                }
            } else {
                List<String> errorMessages = new ArrayList<>();
                for (ProcessingMessage processingMessage : validationReport) {
                    errorMessages.add(processingMessage.getMessage());
                }
                responseBody = objectMapper.writeValueAsString(errorMessages);
                responseStatus = HttpResponseStatus.BAD_REQUEST;
            }
        } else {
            responseStatus = HttpResponseStatus.METHOD_NOT_ALLOWED;
        }

        ctx.writeAndFlush(new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, responseStatus, Unpooled.wrappedBuffer(responseBody.getBytes(Charsets.UTF_8))));
        ctx.close();
    }
}






