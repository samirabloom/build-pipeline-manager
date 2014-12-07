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
class BuildRestDeleteAPIIntSpec extends Specification {
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
                    "number: 1, " +
                    "status: \"PASSED\", " +
                    "message: \"build completed\", " +
                    "stage: \"BUILD\"" +
                    "}"

        and:
            ClientResponse saveResponse = client.sendRequest("PUT", "/buildManager/build", body)
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
            ClientResponse deletedResponse = client.sendRequest("DELETE", "/buildManager/build/" + uuid, "")

        then:
            deletedResponse.status == HttpResponseStatus.OK.code()
            deletedResponse.body == "";

    }

    void 'should indicate build does not exist when deleting build'() {
        when:
            ClientResponse response = client.sendRequest("DELETE", "/buildManager/build/" + UUID.randomUUID(), "")

        then:
            response.status == HttpResponseStatus.NOT_FOUND.code()
            response.body == "";
    }
}
