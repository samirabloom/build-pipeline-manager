package com.buildmanager.api.build.server.pathvariables.types;

import java.io.Serializable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author jamesdbloom
 */
public class TypeRegistry {

    private final List<? extends PathVariableTypeConverter<? extends Serializable>> typeConverters = Arrays.asList(
            new FloatPathVariableTypeConverter(),
            new IntegerPathVariableTypeConverter(),
            new StringPathVariableTypeConverter(),
            new UuidPathVariableTypeConverter()
    );

    private final Map<String, PathVariableTypeConverter<? extends Serializable>> typesConvertersMap = new HashMap<>();

    public TypeRegistry() {
        for (PathVariableTypeConverter<? extends Serializable> type : typeConverters) {
            typesConvertersMap.put(type.getType(), type);
        }
    }

    public PathVariableTypeConverter getTypeParser(String type) {
        return typesConvertersMap.get(type);
    }
}
