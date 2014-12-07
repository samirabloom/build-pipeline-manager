package com.buildmanager.api.build.domain;

import java.util.UUID;

/**
 * @author samirarabbanian
 */
public class Build extends ObjectWithReflectiveEqualsHashCodeToString {
    private UUID id;
    private Integer number;
    private BuildStatus status;
    private String message;
    private String stage;

    public UUID getId() {
        return id;
    }

    public Build setId(UUID id) {
        this.id = id;
        return this;
    }

    public Integer getNumber() {
        return number;
    }

    public Build setNumber(Integer number) {
        this.number = number;
        return this;
    }

    public BuildStatus getStatus() {
        return status;
    }

    public Build setStatus(BuildStatus status) {
        this.status = status;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public Build setMessage(String message) {
        this.message = message;
        return this;
    }

    public String getStage() {
        return stage;
    }

    public Build setStage(String stage) {
        this.stage = stage;
        return this;
    }
}
