package com.buildmanager.api.server.handler.build.integration

import com.buildmanager.api.build.ClientResponse
import com.buildmanager.api.build.RestClient
import com.buildmanager.api.respository.BuildRepository
import com.buildmanager.api.server.BuildManager
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

        new BuildRepository().clear();
        buildManager = new BuildManager(port)
        client = new RestClient("localhost", port)
    }

    void cleanupSpec() {
        buildManager.stop()
    }

    void 'should return all builds'() {
        given:
            String body = "{" +
                    "number: 1, " +
                    "status: \"PASSED\", " +
                    "message: \"build completed\", " +
                    "stage: \"BUILD\"" +
                    "}"

        and:
            ClientResponse saveFirstResponse = client.sendRequest("POST", "/api/build", body)
            Map savedFirstBuild = new JsonSlurper().parseText(saveFirstResponse.body) as Map
            UUID firstUuid = UUID.fromString(savedFirstBuild.id)

        and:
            ClientResponse saveSecondResponse = client.sendRequest("POST", "/api/build", body)
            Map savedSecondBuild = new JsonSlurper().parseText(saveSecondResponse.body) as Map
            UUID secondUuid = UUID.fromString(savedSecondBuild.id)

        when:
            ClientResponse loadResponse = client.sendRequest("GET", "/api/build", "")

        then:
            loadResponse.status == HttpResponseStatus.OK.code()
            List loadedBuilds = new JsonSlurper().parseText(loadResponse.body) as List
            loadedBuilds[0].id == firstUuid.toString()
            loadedBuilds[0].number == 1
            loadedBuilds[0].status == "PASSED"
            loadedBuilds[0].message == "build completed"
            loadedBuilds[0].stage == "BUILD"
            loadedBuilds[1].id == secondUuid.toString()
            loadedBuilds[1].number == 1
            loadedBuilds[1].status == "PASSED"
            loadedBuilds[1].message == "build completed"
            loadedBuilds[1].stage == "BUILD"
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
            ClientResponse saveResponse = client.sendRequest("POST", "/api/build", body)
            Map savedBuild = new JsonSlurper().parseText(saveResponse.body) as Map
            UUID uuid = UUID.fromString(savedBuild.id)

        when:
            ClientResponse loadResponse = client.sendRequest("GET", "/api/build/" + uuid, "")

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
            ClientResponse response = client.sendRequest("GET", "/api/build/" + UUID.randomUUID(), "")

        then:
            response.status == HttpResponseStatus.NOT_FOUND.code()
            response.body == "";
    }

    // FIXME - fix this UUID validation to not just assume request list if UUID is invalid!!
//
//    void 'should return invalid Id response if build Id is not Integer' () {
//        when:
//            ClientResponse response = client.sendRequest("GET", "/api/build/a", "")
//
//        then:
//            response.status == HttpResponseStatus.BAD_REQUEST.code()
//            response.body == "[\"Invalid UUID string: a\"]";
//    }

}
