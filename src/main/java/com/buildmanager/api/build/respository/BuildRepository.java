package com.buildmanager.api.build.respository;

import com.buildmanager.api.build.domain.Build;
import com.buildmanager.json.ObjectMapperFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapdb.DB;
import org.mapdb.DBMaker;

import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.ConcurrentNavigableMap;

/**
 * @author jamesdbloom
 */
public class BuildRepository {

    private final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();
    private DB db = DBMaker.newFileDB(new File("build-manager.db"))
            .closeOnJvmShutdown()
            .make();

    private ConcurrentNavigableMap<UUID, String> map = db.getTreeMap("build");

    // db.close();

    public void saveBuild(Build build) {
        try {
            map.put(build.getId(), objectMapper.writeValueAsString(build));
            db.commit(); // persist to disk
        } catch (JsonProcessingException jpe) {
            db.rollback(); // revert recent changes
        }
    }

    public Build loadBuild(UUID id) {
        String buildJson = map.get(id);
        try {
            return objectMapper.readValue(buildJson, Build.class);
        } catch (IOException jpe) {
            return null;
        }
    }
}
