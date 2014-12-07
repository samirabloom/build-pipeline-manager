package com.buildmanager.api.build

import com.buildmanager.api.build.domain.Build
import com.buildmanager.api.build.domain.BuildStatus
import com.buildmanager.api.build.respository.BuildRepository
import com.buildmanager.api.build.server.BuildManager
import groovy.json.JsonSlurper
import io.netty.handler.codec.http.HttpResponseStatus
import spock.lang.Specification

/**
 * @author samirarabbanian
 */
class BuildRestGetAPIIntSpec extends Specification {
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

    void 'should return a build'() {
        given:
            String body = "{" +
                    "number: 1, " +
                    "status: \"PASSED\", " +
                    "message: \"build completed\", " +
                    "stage: \"BUILD\"" +
                    "}"

        and:
            ClientResponse saveResponse = client.sendRequest("PUT", "/buildManager/build", body)
            Map savedBuild = new JsonSlurper().parseText(saveResponse.body) as Map
            UUID uuid = UUID.fromString(savedBuild.id)

        when:
            ClientResponse loadResponse = client.sendRequest("GET", "/buildManager/build/" + uuid, "")

        then:
            loadResponse.status == HttpResponseStatus.OK.code()
            Map loadedBuild = new JsonSlurper().parseText(loadResponse.body) as Map
            loadedBuild.id == uuid.toString()
            loadedBuild.number == 1
            loadedBuild.status == "PASSED"
            loadedBuild.message == "build completed"
            loadedBuild.stage == "BUILD"
    }

    void 'should return empty response if build does not exist' () {
        when:
            ClientResponse response = client.sendRequest("GET", "/buildManager/build/" + UUID.randomUUID(), "")

        then:
            response.status == HttpResponseStatus.NOT_FOUND.code()
            response.body == "";
    }

    void 'should return invalid Id response if build Id is not Integer' () {
        when:
            ClientResponse response = client.sendRequest("GET", "/buildManager/build/a", "")

        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[\"Invalid UUID string: a\"]";
    }

}
