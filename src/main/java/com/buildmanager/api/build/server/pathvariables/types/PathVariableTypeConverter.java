package com.buildmanager.api.build.server.pathvariables.types;

/**
 * @author jamesdbloom
 */
public interface PathVariableTypeConverter<T> {

    public String getType();

    public T fromString(String value);

}
