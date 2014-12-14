package com.buildmanager.api.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * @author samirarabbanian
 */
public class Pipeline extends Entity<Pipeline> {
    private UUID id;
    private String name;
    private List<Stage> stages = new ArrayList<>();

    public UUID getId() {
        return id;
    }

    public Pipeline setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public Pipeline setName(String name) {
        this.name = name;
        return this;
    }

    public List<Stage> getStages() {
        return stages;
    }

    public Pipeline setStages(List<Stage> stages) {
        this.stages = stages;
        return this;
    }

    public Pipeline update(Pipeline updater) {
        if (updater.name != null) {
            this.name = updater.name;
        }
        if (updater.stages != null) {
            this.stages = updater.stages;
        }
        return this;
    }
}
