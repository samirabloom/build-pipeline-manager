package com.buildmanager.api.respository;

import com.buildmanager.api.domain.Entity;
import com.buildmanager.api.json.ObjectMapperFactory;
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
public abstract class Repository<T extends Entity> {
    private final Class<T> entityClass;
    private final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();
    private final DB db;
    private final ConcurrentNavigableMap<UUID, String> map;

    // FIXME do we need to close the db as follows? db.close()

    protected Repository(Class<T> entityClass) {
        this.entityClass = entityClass;
        this.db = DBMaker.newFileDB(new File(entityClass.getSimpleName().toLowerCase() + "-entities.db"))
                .closeOnJvmShutdown()
                .make();
        this.map = db.getTreeMap("entity");
    }

    public void save(T entity) {
        synchronized (db) {
            if (entity != null) {
                try {
                    map.put(entity.getId(), objectMapper.writeValueAsString(entity));
                    db.commit(); // persist to disk
                } catch (JsonProcessingException jpe) {
                    db.rollback(); // revert recent changes
                }
            }
        }
    }

    public T load(UUID id) {
        synchronized (db) {
            if (id != null) {
                String entityJson = map.get(id);
                if (!Strings.isNullOrEmpty(entityJson)) {
                    try {
                        return objectMapper.readValue(entityJson, entityClass);
                    } catch (IOException jpe) {
                        // FIXME log error
                        return null;
                    }
                }
            }
            return null;
        }
    }

    public List<T> loadAll() {
        synchronized (db) {
            Collection<String> entitiesJson = map.values();
            List<T> entities = new ArrayList<>();
            for (String entityJson : entitiesJson) {
                if (!Strings.isNullOrEmpty(entityJson)) {
                    try {
                        entities.add(objectMapper.readValue(entityJson, entityClass));
                    } catch (IOException jpe) {
                        // FIXME log error
                    }
                }
            }
            Collections.sort(entities);
            return entities;
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
