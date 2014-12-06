package com.buildmanager.api.build.server;

import com.buildmanager.api.build.domain.Build;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author samirarabbanian
 */

@ChannelHandler.Sharable
public class RestAPIHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest httpRequest) throws Exception {
        String jsonRequest = httpRequest.content().readBytes(httpRequest.content().readableBytes()).toString(Charsets.UTF_8);
        String responseBody = "";
        HttpResponseStatus responseStatus;
        HttpMethod httpMethod = httpRequest.getMethod();
//        httpRequest.getUri();

        if (httpMethod == HttpMethod.PUT) {
            JsonValidator jsonValidator = JsonSchemaFactory.byDefault().getValidator();
            JsonNode buildSchema = JsonLoader.fromResource("/json/schemas/build_json_schema.json");
            ProcessingReport validationReport = jsonValidator.validate(buildSchema, objectMapper.readTree(jsonRequest));
            if (validationReport.isSuccess()) {
                Build build = objectMapper.readValue(jsonRequest, Build.class);
//        build.setId(new Random().nextInt());
                build.setId(1);
                BuildManager.database.put(build.getId(), build);
                responseBody = objectMapper.writeValueAsString(build);
                responseStatus = HttpResponseStatus.ACCEPTED;
            } else {
                List<String> errorMessages = new ArrayList<String>();
                for (ProcessingMessage processingMessage : validationReport) {
                    errorMessages.add(processingMessage.getMessage());
                }
                responseBody = objectMapper.writeValueAsString(errorMessages);
                responseStatus = HttpResponseStatus.BAD_REQUEST;
            }
        } else if (httpMethod == HttpMethod.GET) {
            QueryStringDecoder queryStringDecoder = new QueryStringDecoder(httpRequest.getUri());
            try {
                Integer buildId = Integer.parseInt(StringUtils.substringAfter(queryStringDecoder.path(), "/buildManager/build/"));
                Build retrievedBuild = BuildManager.database.get(buildId);
                if (retrievedBuild != null) {
                    responseBody = objectMapper.writeValueAsString(retrievedBuild);
                    responseStatus = HttpResponseStatus.OK;
                    System.out.println("the returned body is: " + responseBody + "\n");
                } else {
                    responseStatus = HttpResponseStatus.NOT_FOUND;
                }
            } catch (NumberFormatException nfe) {
                responseBody = objectMapper.writeValueAsString(Arrays.asList("Invalid id " + nfe.getMessage()));
                responseStatus = HttpResponseStatus.BAD_REQUEST;
            }
        } else {
            responseStatus = HttpResponseStatus.METHOD_NOT_ALLOWED;
        }

        ctx.writeAndFlush(new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, responseStatus, Unpooled.wrappedBuffer(responseBody.getBytes(Charsets.UTF_8))));
        ctx.close();
    }
}






