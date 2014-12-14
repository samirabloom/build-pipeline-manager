package com.buildmanager.api.server.pathvariables.types;

import java.util.UUID;

/**
 * @author jamesdbloom
 */
public class UuidPathVariableTypeConverter implements PathVariableTypeConverter<UUID> {

    public String getType() {
        return "UUID";
    }

    public UUID fromString(String value) {
        return UUID.fromString(value);
    }
}
