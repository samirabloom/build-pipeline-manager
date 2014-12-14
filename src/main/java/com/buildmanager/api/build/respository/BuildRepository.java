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
public class BuildRepository extends Repository<Build> {

    protected BuildRepository() {
        super(Build.class);
    }
}
