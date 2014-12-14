package com.buildmanager.api.domain;

import com.buildmanager.json.ObjectMapperFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.io.Serializable;

/**
 * @author jamesdbloom
 */
public class ObjectWithReflectiveEqualsHashCodeToString implements Serializable {

    @Override
    public boolean equals(Object other) {
        return EqualsBuilder.reflectionEquals(this, other);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

    @Override
    public String toString() {
        try {
            return ObjectMapperFactory
                    .createObjectMapper()
                    .writer()
                    .withDefaultPrettyPrinter()
                    .writeValueAsString(this);
        } catch (JsonProcessingException e) {
            String className = getClass().getName();
            return String.format("{ error : \"%s.toString()\", message : \"%s\" }", className, e.getMessage());
        }
    }

}