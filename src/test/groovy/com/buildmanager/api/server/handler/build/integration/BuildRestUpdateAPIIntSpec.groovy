package com.buildmanager.api.server.handler.build.integration

import com.buildmanager.api.build.ClientResponse
import com.buildmanager.api.build.RestClient
import com.buildmanager.api.server.BuildManager
import groovy.json.JsonSlurper
import io.netty.handler.codec.http.HttpResponseStatus
import spock.lang.Specification

/**
 * @author samirarabbanian
 */
class BuildRestUpdateAPIIntSpec extends Specification {
    static BuildManager buildManager
    static RestClient client

    void setupSpec() {
        int port = 9090

        buildManager = new BuildManager(port)
        client = new RestClient("localhost", port)
    }

    void cleanupSpec() {
        buildManager.stop()
    }

    void 'should update build'() {
        given:
            String body = "{" +
                    "number: 1, " +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"BUILD\"" +
                    "}"

        and:
            ClientResponse saveResponse = client.sendRequest("POST", "/api/build", body)
            Map savedBuild = new JsonSlurper().parseText(saveResponse.body) as Map
            UUID uuid = UUID.fromString(savedBuild.id)

        and:
            String updatedBuildBody = "{" +
                    "status: \"PASSED\", " +
                    "stage: \"DEVELOP\", " +
                    "message: \"develop completed\"" +
                    "}"

        when:
            ClientResponse updatedBuildResponse = client.sendRequest("PUT", "/api/build/" + uuid, updatedBuildBody)

        then:
            updatedBuildResponse.status == HttpResponseStatus.ACCEPTED.code()
            Map updatedBuild = new JsonSlurper().parseText(updatedBuildResponse.body) as Map
            updatedBuild.id == uuid.toString()
            updatedBuild.number == 1
            updatedBuild.status == "PASSED"
            updatedBuild.message == "develop completed"
            updatedBuild.stage == "DEVELOP"
    }

    void 'should indicate build does not exist when updating build'() {
        given:
            UUID uuid = UUID.randomUUID()

        and:
            String body = "{" +
                    "status: \"PASSED\", " +
                    "stage: \"DEVELOP\", " +
                    "message: \"develop completed\"" +
                    "}"

        when:
            ClientResponse response = client.sendRequest("PUT", "/api/build/" + uuid, body)

        then:
            response.status == HttpResponseStatus.NOT_FOUND.code()
            response.body == ""
    }

    void 'should not allow number or id to be specified'() {
        given:
            String body = "{" +
                    "id: \"" + UUID.randomUUID() + "\", " +
                    "number: 1, " +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("PUT", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"type\":\"additionalProperties\",\"message\":\"please only provide allow fields [\\\"id\\\",\\\"number\\\"]\"}" +
                    "]";
    }

    void 'should validate build status'() {
        given:
            String body = "{" +
                    "status: \"NOT VALID\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("PUT", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"status\",\"type\":\"enum\",\"message\":\"please enter a status from [\\\"IN_PROGRESS\\\" , \\\"PASSED\\\", \\\"FAILED\\\"]\"}" +
                    "]";
    }


    void 'should validate build message length'() {
        given:
            String body = "{" +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress and this is hopefully longer than I wanted to be\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("PUT", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"message\",\"type\":\"maxLength\",\"message\":\"please enter a message between 1 and 50 characters\"}" +
                    "]";
    }

    void 'should validate build stage'() {
        given:
            String body = "{" +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"IN VALID\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("PUT", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"stage\",\"type\":\"enum\",\"message\":\"please enter a stage from [\\\"BUILD\\\", \\\"DEVELOP\\\", \\\"AUTO_QA\\\", \\\"MANUAL_QA\\\", \\\"UAT\\\", \\\"PROD\\\"]\"}" +
                    "]";
    }

}
