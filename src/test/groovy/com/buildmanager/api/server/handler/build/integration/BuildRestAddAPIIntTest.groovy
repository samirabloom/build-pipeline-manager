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
                    "pipelineId : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\", " +
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
            build.pipelineId == "3d922b33-e2d5-4ccb-ade4-26b94377e4dc"
            build.number == 1
            build.status == "IN_PROGRESS"
            build.message == "build in-progress"
            build.stage == "BUILD"
            build.createdDate == "2014-12-14T18:52:02.043Z"
            build.updatedDate == "2014-12-14T18:52:02.043Z"
    }

    void 'should validate build number'() {
        given:
            String body = "{" +
                    "pipelineId : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\", " +
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
                    "pipelineId : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\", " +
                    "number: 1, " +
                    "status: \"NOT VALID\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("POST", "/api/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"status\",\"type\":\"enum\",\"message\":\"please enter a status from [\\\"IN_PROGRESS\\\",\\\"PASSED\\\",\\\"FAILED\\\"]\"}" +
                    "]";
    }


    void 'should validate build message length'() {
        given:
            String body = "{" +
                    "pipelineId : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\", " +
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
                    "{\"path\":\"message\",\"type\":\"maxLength\",\"message\":\"please enter a message less then 50 characters\"}" +
                    "]";
    }

    void 'should validate build stage'() {
        given:
            String pipelineBody = "{" +
                    "name: \"build manager\", " +
                    "stages: [" +
                    "   {" +
                    "      name: \"BUILD\"" +
                    "   }," +
                    "   {" +
                    "      name: \"DEVELOPMENT\"" +
                    "   }" +
                    "]" +
                    "}"
            ClientResponse pipelineResponse = client.sendRequest("POST", "/api/pipeline", pipelineBody)
            Map pipeline = new JsonSlurper().parseText(pipelineResponse.body) as Map

        and:
            String buildBody = "{" +
                    "pipelineId : \"" + pipeline.id + "\", " +
                    "number: 1, " +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"AUTO_QA\"" +
                    "}"
        when:
            ClientResponse buildResponse = client.sendRequest("POST", "/api/build", buildBody)
        then:
            buildResponse.status == HttpResponseStatus.BAD_REQUEST.code()
            buildResponse.body == "[" +
                    "{\"path\":\"stage\",\"type\":\"enum\",\"message\":\"please enter a stage from [BUILD, DEVELOPMENT]\"}" +
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
                    "{\"type\":\"required\",\"message\":\"please enter all required fields [\\\"message\\\",\\\"number\\\",\\\"pipelineId\\\",\\\"stage\\\",\\\"status\\\"]\"}" +
                    "]";
    }

    void 'should validate adding new build with 2 in valid properties'() {
        given:
            String body = "{" +
                    "pipelineId : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\", " +
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
                    "{\"path\":\"status\",\"type\":\"enum\",\"message\":\"please enter a status from [\\\"IN_PROGRESS\\\",\\\"PASSED\\\",\\\"FAILED\\\"]\"}" +
                    "]";
    }

}
