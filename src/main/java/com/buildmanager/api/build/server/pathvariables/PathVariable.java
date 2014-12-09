package com.buildmanager.api.build.server.pathvariables;

import com.buildmanager.api.build.domain.ObjectWithReflectiveEqualsHashCodeToString;

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
