package com.buildmanager.api.server.handler.build.integration

import com.buildmanager.api.build.ClientResponse
import com.buildmanager.api.build.RestClient
import com.buildmanager.api.domain.Build
import com.buildmanager.api.domain.BuildStatus
import com.buildmanager.api.respository.BuildRepository
import com.buildmanager.api.server.BuildManager
import groovy.json.JsonSlurper
import io.netty.handler.codec.http.HttpResponseStatus
import spock.lang.Specification

/**
 * @author samirarabbanian
 */
class BuildRestDeleteAPIIntTest extends Specification {
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

    void 'should delete build'() {
        given:
            String body = "{" +
                    "pipelineId : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\", " +
                    "number: 1, " +
                    "status: \"PASSED\", " +
                    "message: \"build completed\", " +
                    "stage: \"BUILD\"" +
                    "}"

        and:
            ClientResponse saveResponse = client.sendRequest("POST", "/api/build", body)
            Map savedBuild = new JsonSlurper().parseText(saveResponse.body) as Map
            UUID uuid = UUID.fromString(savedBuild.id)

        and:
            new BuildRepository().save(
                    new Build()
                            .setId(uuid)
                            .setNumber(1)
                            .setStatus(BuildStatus.PASSED)
                            .setStage("BUILD")
                            .setMessage("build completed")
            )

        when:
            ClientResponse deletedResponse = client.sendRequest("DELETE", "/api/build/" + uuid, "")

        then:
            deletedResponse.status == HttpResponseStatus.ACCEPTED.code()
            deletedResponse.body == "";

    }

    void 'should indicate build does not exist when deleting build'() {
        when:
            ClientResponse response = client.sendRequest("DELETE", "/api/build/" + UUID.randomUUID(), "")

        then:
            response.status == HttpResponseStatus.NOT_FOUND.code()
            response.body == "";
    }
}
