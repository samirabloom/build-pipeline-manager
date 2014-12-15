package com.buildmanager.api.server.handler.build.integration

import com.buildmanager.api.build.ClientResponse
import com.buildmanager.api.build.RestClient
import com.buildmanager.api.server.BuildManager
import groovy.json.JsonSlurper
import io.netty.handler.codec.http.HttpResponseStatus
import org.joda.time.DateTime
import spock.lang.Specification

/**
 * @author samirarabbanian
 */
class BuildRestAddAPIIntTest extends Specification {
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

    void 'should add new build'() {
        given:
            String body = "{" +
                    "number: 1, " +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"BUILD\"," +
                    "createdDate: \"2014-12-14T18:52:02.043Z\",\n" +
                    "updatedDate: \"2014-12-14T18:52:02.043Z\"\n" +
                    "}"

        when:
            ClientResponse response = client.sendRequest("POST", "/api/build", body)

        then:
            response.status == HttpResponseStatus.ACCEPTED.code()
            Map build = new JsonSlurper().parseText(response.body) as Map
            build.id
            build.number == 1
            build.status == "IN_PROGRESS"
            build.message == "build in-progress"
            build.stage == "BUILD"
            build.createdDate == "2014-12-14T18:52:02.043Z"
            build.updatedDate == "2014-12-14T18:52:02.043Z"
    }

    void 'should validate when new build is added'() {
        given:
            String body = "{" +
                    "number: \"a\", " +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("POST", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"number\",\"type\":\"type\",\"message\":\"please enter a valid number\"}" +
                    "]";
    }


    void 'should validate build status'() {
        given:
            String body = "{" +
                    "number: \"a\", " +
                    "status: \"NOT VALID\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("POST", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"number\",\"type\":\"type\",\"message\":\"please enter a valid number\"}," +
                    "{\"path\":\"status\",\"type\":\"enum\",\"message\":\"please enter a status from [\\\"IN_PROGRESS\\\" , \\\"PASSED\\\", \\\"FAILED\\\"]\"}" +
                    "]";
    }


    void 'should validate build message length'() {
        given:
            String body = "{" +
                    "number: 1 , " +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress and this is hopefully longer than I wanted to be\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("POST", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"message\",\"type\":\"maxLength\",\"message\":\"please enter a message between 1 and 50 characters\"}" +
                    "]";
    }

    void 'should validate build stage'() {
        given:
            String body = "{" +
                    "number: 1, " +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"IN VALID\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("POST", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"stage\",\"type\":\"enum\",\"message\":\"please enter a stage from [\\\"BUILD\\\", \\\"DEVELOP\\\", \\\"AUTO_QA\\\", \\\"MANUAL_QA\\\", \\\"UAT\\\", \\\"PROD\\\"]\"}" +
                    "]";
    }

    void 'should validate adding new build with 2 missing properties'() {
        given:
            String body = "{" +
                    "number: 1, " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("POST", "/api/build", body)

        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"type\":\"required\",\"message\":\"please enter all required fields [\\\"message\\\",\\\"number\\\",\\\"stage\\\",\\\"status\\\"]\"}" +
                    "]";
    }

    void 'should validate adding new build with 2 in valid properties'() {
        given:
            String body = "{" +
                    "number: \"a\", " +
                    "status: \"IN VALID\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"IN VALID\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("POST", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"number\",\"type\":\"type\",\"message\":\"please enter a valid number\"}," +
                    "{\"path\":\"stage\",\"type\":\"enum\",\"message\":\"please enter a stage from [\\\"BUILD\\\", \\\"DEVELOP\\\", \\\"AUTO_QA\\\", \\\"MANUAL_QA\\\", \\\"UAT\\\", \\\"PROD\\\"]\"}," +
                    "{\"path\":\"status\",\"type\":\"enum\",\"message\":\"please enter a status from [\\\"IN_PROGRESS\\\" , \\\"PASSED\\\", \\\"FAILED\\\"]\"}" +
                    "]";
    }

}
