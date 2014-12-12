package com.buildmanager.api.build.respository;

import com.buildmanager.api.build.domain.Build;
import com.buildmanager.json.ObjectMapperFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import org.mapdb.DB;
import org.mapdb.DBMaker;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentNavigableMap;

/**
 * @author jamesdbloom
 */
@Component
public class BuildRepository {

    private final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();
    private final DB db = DBMaker.newFileDB(new File("build-manager.db"))
            .closeOnJvmShutdown()
            .make();

    private ConcurrentNavigableMap<UUID, String> map = db.getTreeMap("build");

    // db.close();

    public void save(Build build) {
        synchronized (db) {
            if (build != null) {
                try {
                    map.put(build.getId(), objectMapper.writeValueAsString(build));
                    db.commit(); // persist to disk
                } catch (JsonProcessingException jpe) {
                    db.rollback(); // revert recent changes
                }
            }
        }
    }

    public Build load(UUID id) {
        synchronized (db) {
            if (id != null) {
                String buildJson = map.get(id);
                if (!Strings.isNullOrEmpty(buildJson)) {
                    try {
                        return objectMapper.readValue(buildJson, Build.class);
                    } catch (IOException jpe) {
                        // FIXME log error
                        return null;
                    }
                }
            }
            return null;
        }
    }

    public List<Build> loadAll() {
        synchronized (db) {
            Collection<String> buildsJson = map.values();
            List<Build> builds = new ArrayList<>();
            Collections.sort(builds);
            for (String buildJson : buildsJson) {
                if (!Strings.isNullOrEmpty(buildJson)) {
                    try {
                        builds.add(objectMapper.readValue(buildJson, Build.class));
                    } catch (IOException jpe) {
                        // FIXME log error
                    }
                }
            }
            return builds;
        }
    }

    public void delete(UUID id) {
        synchronized (db) {
            map.remove(id);
            db.commit(); // persist to disk
        }
    }

    public void clear() {
        synchronized (db) {
            map.clear();
            db.commit(); // persist to disk
        }
    }
}
