package com.buildmanager.api.build;

/**
 * @author samirarabbanian
 */
public class ClientResponse {
    public int status;
    public String body;

    public ClientResponse(int status, String body) {
        this.status = status;
        this.body = body;
    }
}
