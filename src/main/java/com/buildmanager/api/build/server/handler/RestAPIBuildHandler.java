package com.buildmanager.api.build.server.handler;

import com.buildmanager.api.build.domain.Build;
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
public class RestAPIBuildHandler extends RestAPIHandler<Build> {

    @Autowired
    public RestAPIBuildHandler(Repository<Build> entityRepository) throws IOException {
        super(Build.class, "/api/build.*", entityRepository, new JsonValidator("/json/messages/build/build_validation_messages.properties", "/json/schemas/build/build_json_schema.json"));
    }
}






