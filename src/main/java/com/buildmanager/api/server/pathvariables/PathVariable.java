package com.buildmanager.api.server.pathvariables;

import com.buildmanager.api.domain.ObjectWithReflectiveEqualsHashCodeToString;

/**
* @author jamesdbloom
*/
public class PathVariable extends ObjectWithReflectiveEqualsHashCodeToString {
    public final String name;
    public final String type;

    public PathVariable(String name, String type) {
        this.name = name;
        this.type = type;
    }
}
