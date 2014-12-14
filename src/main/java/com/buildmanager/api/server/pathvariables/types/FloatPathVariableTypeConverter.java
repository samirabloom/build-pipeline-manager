package com.buildmanager.api.server.pathvariables.types;

/**
 * @author jamesdbloom
 */
public class FloatPathVariableTypeConverter implements PathVariableTypeConverter<Float> {

    public String getType() {
        return "Float";
    }

    public Float fromString(String value) {
        return Float.parseFloat(value);
    }
}
