package com.buildmanager.api.server.pathvariables.types;

/**
 * @author jamesdbloom
 */
public interface PathVariableTypeConverter<T> {

    public String getType();

    public T fromString(String value);

}
