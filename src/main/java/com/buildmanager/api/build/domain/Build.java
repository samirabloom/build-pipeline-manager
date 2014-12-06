package com.buildmanager.api.build.domain;

/**
 * @author samirarabbanian
 */
public class Build {
    private Integer id;
    private Integer number;
    private String status;
    private String message;
    private String stage;

    public Integer getId() {
        return id;
    }

    public Build setId(Integer id) {
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

    public String getStatus() {
        return status;
    }

    public Build setStatus(String status) {
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
