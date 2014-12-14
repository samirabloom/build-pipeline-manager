package com.buildmanager.api.build.domain;

import java.util.UUID;

/**
 * @author samirarabbanian
 */
public class Stage {
    private UUID id;
    private String name;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
