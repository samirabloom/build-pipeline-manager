package com.buildmanager.api.build.server.pathvariables.types;

/**
 * @author jamesdbloom
 */
public class StringPathVariableTypeConverter implements PathVariableTypeConverter<String> {

    public String getType() {
        return "String";
    }

    public String fromString(String value) {
        return value;
    }
}
