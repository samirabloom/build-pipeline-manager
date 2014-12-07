package com.buildmanager.api.build

import com.buildmanager.api.build.server.BuildManager
import io.netty.handler.codec.http.HttpResponseStatus
import spock.lang.Specification

/**
 * @author samirarabbanian
 */
class BuildRestAddAPIIntSpec extends Specification {
    static int port = 9090
    static BuildManager buildManager

    void setupSpec() {
        buildManager = new BuildManager(port)
    }

    void cleanupSpec() {
        buildManager.stop()
    }

    void 'should add new build'() {
        given:
            RestClient client = new RestClient("localhost", port)
        and:
            String body = "{" +
                    "number: 1, " +
                    "status: \"PASSED\", " +
                    "message: \"build completed\", " +
                    "stage: \"BUILD\"" +
                    "}"

        when:
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)

        then:
            response.status == HttpResponseStatus.ACCEPTED.code()
            response.body == "{" +
                    "\"id\":1," +
                    "\"number\":1," +
                    "\"status\":\"PASSED\"," +
                    "\"message\":\"build completed\"," +
                    "\"stage\":\"BUILD\"" +
                    "}"
    }

    void 'should validate adding new build'() {
        given:
            RestClient client = new RestClient("localhost", port)
        and:
            String body = "{" +
                    "number: \"a\", " +
                    "status: \"PASSED\", " +
                    "message: \"build completed\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "\"instance type (string) does not match any allowed primitive type (allowed: [\\\"integer\\\"])\"" +
                    "]";
            // test that a build must contain:
            // - status (IN_PROGRESS, PASSED, FAILED) "DONE"
            // - message 0 < 128 "DONE"
            // - stage (BUILD, DEVELOP, AUTO_QA, MANUAL_QA, UAT, PROD) "DONE"
    }


    void 'should validate build status'() {
        given:
            RestClient client = new RestClient("localhost", port)
        and:
            String body = "{" +
                    "number: \"a\", " +
                    "status: \"NOT VALID\", " +
                    "message: \"build completed\", " +
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
            RestClient client = new RestClient("localhost", port)
        and:
            String body = "{" +
                    "number: 1 , " +
                    "status: \"PASSED\", " +
                    "message: \"build completed and this is hopefully longer than I wanted to be\", " +
                    "stage: \"BUILD\"" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "\"string \\\"build completed and this is hopefully longer than I wanted to be\\\" is too long (length: 64, maximum allowed: 40)\"" +
                    "]";
    }

    void 'should validate build stage'() {
        given:
            RestClient client = new RestClient("localhost", port)
        and:
            String body = "{" +
                    "number: 1, " +
                    "status: \"PASSED\", " +
                    "message: \"build completed\", " +
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
            RestClient client = new RestClient("localhost", port)
        and:
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
            RestClient client = new RestClient("localhost", port)
        and:
            String body = "{" +
                    "number: \"a\", " +
                    "status: \"IN VALID\", " +
                    "message: \"build completed\", " +
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
