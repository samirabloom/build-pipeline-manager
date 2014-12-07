package com.buildmanager.api.build

import com.buildmanager.api.build.domain.Build
import com.buildmanager.api.build.server.BuildManager
import io.netty.handler.codec.http.HttpResponseStatus
import spock.lang.Specification

/**
 * @author samirarabbanian
 */
class BuildRestGetAPIIntSpec extends Specification {
    static int port = 9090
    static BuildManager buildManager

    void setupSpec() {
        buildManager = new BuildManager(port)
    }

    void cleanupSpec() {
        buildManager.stop()
    }

    void 'should return a build'() {
        given:
            RestClient client = new RestClient("localhost", port)

        and:
            BuildManager.database.put(1,
                    new Build()
                            .setId(1)
                            .setNumber(1)
                            .setStatus("PASSED")
                            .setStage("BUILD")
                            .setMessage("build completed")
            )

        when:
            ClientResponse response = client.sendRequest("GET", "/buildManager/build/1", "")

        then:
            response.status == HttpResponseStatus.OK.code()
            response.body == "{" +
                    "\"id\":1," +
                    "\"number\":1," +
                    "\"status\":\"PASSED\"," +
                    "\"message\":\"build completed\"," +
                    "\"stage\":\"BUILD\"" +
                    "}"
    }

    void 'should return empty response if build does not exist' () {
        given:
            RestClient client = new RestClient("localhost", port)

        when:
            ClientResponse response = client.sendRequest("GET", "/buildManager/build/666", "")

        then:
            response.status == HttpResponseStatus.NOT_FOUND.code()
            response.body == "";
    }

    void 'should return invalid Id response if build Id is not Integer' () {
        given:
            RestClient client = new RestClient("localhost", port)

        when:
            ClientResponse response = client.sendRequest("GET", "/buildManager/build/a", "")

        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[\"Invalid id For input string: \\\"a\\\"\"]";
    }



}
