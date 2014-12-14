package com.buildmanager.api.build.server.handler;

import com.buildmanager.api.build.domain.Pipeline;
import com.buildmanager.api.build.json.JsonValidator;
import com.buildmanager.api.build.respository.Repository;
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
    public RestAPIPipelineHandler(Repository<Pipeline> entityRepository) throws IOException {
        super(Pipeline.class, "/api/pipeline.*", entityRepository, new JsonValidator("/json/messages/pipeline/pipeline_validation_messages.properties", "/json/schemas/pipeline/pipeline_json_schema.json"));
    }
}






