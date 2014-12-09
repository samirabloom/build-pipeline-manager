package com.buildmanager.api.build.json;

import com.buildmanager.api.build.domain.ObjectWithReflectiveEqualsHashCodeToString;

import javax.annotation.concurrent.Immutable;

/**
* @author jamesdbloom
*/
@Immutable
public class BindingError extends ObjectWithReflectiveEqualsHashCodeToString {
    public final String path;
    public final String type;
    public final String message;

    public BindingError(String path, String type, String message) {
        this.path = path;
        this.type = type;
        this.message = message;
    }
}
