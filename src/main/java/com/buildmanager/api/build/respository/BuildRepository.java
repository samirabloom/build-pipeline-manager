package com.buildmanager.api.build.respository;

import com.buildmanager.api.build.domain.Build;
import com.buildmanager.json.ObjectMapperFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
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

    public void save(Build build) {
        if (build != null) {
            try {
                map.put(build.getId(), objectMapper.writeValueAsString(build));
                db.commit(); // persist to disk
            } catch (JsonProcessingException jpe) {
                db.rollback(); // revert recent changes
            }
        }
    }

    public Build load(UUID id) {
        if (id != null) {
            String buildJson = map.get(id);
            if (!Strings.isNullOrEmpty(buildJson)) {
                try {
                    return objectMapper.readValue(buildJson, Build.class);
                } catch (IOException jpe) {
                    return null;
                }
            }
        }
        return null;
    }

    public void delete(UUID buildId) {
        map.remove(buildId);
        db.commit(); // persist to disk
    }
}
