package com.buildmanager.api.server.handler.pipeline;

import com.buildmanager.api.domain.Pipeline;
import com.buildmanager.api.json.JsonValidator;
import com.buildmanager.api.server.handler.RestAPIHandler;
import com.buildmanager.api.respository.PipelineRepository;
import io.netty.channel.ChannelHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * @author samirarabbanian
 */
@Component
@ChannelHandler.Sharable
public class RestAPIPipelineHandler extends RestAPIHandler<Pipeline> {

    @Autowired
    public RestAPIPipelineHandler(PipelineRepository pipelineRepository) throws IOException {
        super(Pipeline.class, "/api/pipeline.*", pipelineRepository, new JsonValidator("/json/messages/pipeline/pipeline_validation_messages.properties", "/json/schemas/pipeline/pipeline_json_schema.json"));
    }
}






