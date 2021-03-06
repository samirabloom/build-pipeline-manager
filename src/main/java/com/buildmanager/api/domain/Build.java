package com.buildmanager.api.domain;

import org.joda.time.DateTime;

import java.util.UUID;

/**
 * @author samirarabbanian
 */
public class Build extends Entity<Build> {
    private UUID id;
    private UUID pipelineId;
    private Integer number;
    private BuildStatus status;
    private String message;
    private String stage;
    private DateTime createdDate = new DateTime();
    private DateTime updatedDate = new DateTime();

    public UUID getId() {
        return id;
    }

    public Build setId(UUID id) {
        this.id = id;
        return this;
    }

    public UUID getPipelineId() {
        return pipelineId;
    }

    public Build setPipelineId(UUID pipelineId) {
        this.pipelineId = pipelineId;
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

    public DateTime getCreatedDate() {
        return createdDate;
    }

    public Build setCreatedDate(DateTime createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public DateTime getUpdatedDate() {
        return updatedDate;
    }

    public Build setUpdatedDate(DateTime updatedDate) {
        this.updatedDate = updatedDate;
        return this;
    }

    public Build update(Build updater) {
        if (updater.status != null) {
            this.status = updater.status;
        }
        if (updater.message != null) {
            this.message = updater.message;
        }
        if (updater.stage != null) {
            this.stage = updater.stage;
        }
        this.updatedDate = new DateTime();
        return this;
    }

    @Override
    public int compareTo(Object o) {
        if (o instanceof Entity) {
            return createdDate.compareTo(((Build) o).createdDate);
        } else {
            return -1;
        }
    }

}
