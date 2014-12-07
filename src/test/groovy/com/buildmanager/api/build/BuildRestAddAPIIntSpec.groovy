package com.buildmanager.api.build

import com.buildmanager.api.build.server.BuildManager
import groovy.json.JsonSlurper
import io.netty.handler.codec.http.HttpResponseStatus
import spock.lang.Specification

/**
 * @author samirarabbanian
 */
class BuildRestAddAPIIntSpec extends Specification {
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
                    "stage: \"BUILD\"" +
                    "}"

        when:
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)

        then:
            response.status == HttpResponseStatus.ACCEPTED.code()
            Map build = new JsonSlurper().parseText(response.body) as Map
            build.id
            build.number == 1
            build.status == "IN_PROGRESS"
            build.message == "build in-progress"
            build.stage == "BUILD"
    }

    void 'should validate adding new build'() {
        given:
            String body = "{" +
                    "number: \"a\", " +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "\"instance type (string) does not match any allowed primitive type (allowed: [\\\"integer\\\"])\"" +
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
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "\"instance type (string) does not match any allowed primitive type (allowed: [\\\"integer\\\"])\"," +
                    "\"instance value (\\\"NOT VALID\\\") not found in enum (possible values: [\\\"IN_PROGRESS\\\",\\\"PASSED\\\",\\\"FAILED\\\"])\"" +
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
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "\"string \\\"build in-progress and this is hopefully longer than I wanted to be\\\" is too long (length: 66, maximum allowed: 40)\"" +
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
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "\"instance value (\\\"IN VALID\\\") not found in enum (possible values: [\\\"BUILD\\\",\\\"DEVELOP\\\",\\\"AUTO_QA\\\",\\\"MANUAL_QA\\\",\\\"UAT, PROD\\\"])\"" +
                    "]";
    }

    void 'should validate adding new build with 2 missing properties'() {
        given:
            String body = "{" +
                    "number: 1, " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)

        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "\"object has missing required properties ([\\\"message\\\",\\\"status\\\"])\"" +
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
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "\"instance type (string) does not match any allowed primitive type (allowed: [\\\"integer\\\"])\"," +
                    "\"instance value (\\\"IN VALID\\\") not found in enum (possible values: [\\\"BUILD\\\",\\\"DEVELOP\\\",\\\"AUTO_QA\\\",\\\"MANUAL_QA\\\",\\\"UAT, PROD\\\"])\"," +
                    "\"instance value (\\\"IN VALID\\\") not found in enum (possible values: [\\\"IN_PROGRESS\\\",\\\"PASSED\\\",\\\"FAILED\\\"])\"" +
                    "]";
    }

}
