package com.buildmanager.api.server.handler.build;

import com.buildmanager.api.domain.Build;
import com.buildmanager.api.json.JsonValidator;
import com.buildmanager.api.respository.BuildRepository;
import com.buildmanager.api.server.handler.RestAPIHandler;
import io.netty.channel.ChannelHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * @author samirarabbanian
 */
@Component
@ChannelHandler.Sharable
public class RestAPIBuildHandler extends RestAPIHandler<Build> {

    @Autowired
    public RestAPIBuildHandler(BuildRepository buildRepository) throws IOException {
        super(
                Build.class,
                "/api/build.*",
                buildRepository,
                new JsonValidator("/json/messages/build/build_validation_messages.properties", "/json/schemas/build/new_build_json_schema.json"),
                new JsonValidator("/json/messages/build/build_validation_messages.properties", "/json/schemas/build/update_build_json_schema.json")
        );
    }
}
