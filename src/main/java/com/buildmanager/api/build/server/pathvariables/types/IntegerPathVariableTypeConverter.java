package com.buildmanager.api.build.server.pathvariables.types;

/**
 * @author jamesdbloom
 */
public class IntegerPathVariableTypeConverter implements PathVariableTypeConverter<Integer> {

    public String getType() {
        return "Integer";
    }

    public Integer fromString(String value) {
        return Integer.parseInt(value);
    }
}
