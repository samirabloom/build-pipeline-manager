package com.buildmanager.api.build

import com.buildmanager.api.build.server.BuildManager
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
            ClientResponse saveResponse = client.sendRequest("PUT", "/buildManager/build", body)
            Map savedBuild = new JsonSlurper().parseText(saveResponse.body) as Map
            UUID uuid = UUID.fromString(savedBuild.id)

        and:
            String updatedBuildBody = "{" +
                    "number: 1, " +
                    "status: \"PASSED\", " +
                    "stage: \"DEVELOP\", " +
                    "message: \"develop completed\"" +
                    "}"

        when:
            ClientResponse updatedBuildResponse = client.sendRequest("POST", "/buildManager/build/" + uuid, updatedBuildBody)

        then:
            updatedBuildResponse.status == HttpResponseStatus.ACCEPTED.code()
            Map updatedBuild = new JsonSlurper().parseText(updatedBuildResponse.body) as Map
            updatedBuild.id == uuid.toString()
            updatedBuild.number == 1
            updatedBuild.status == "PASSED"
            updatedBuild.message == "develop completed"
            updatedBuild.stage == "DEVELOP"
    }

    void 'should not update non-updatable fields'() {
        given:
            String body = "{" +
                    "number: 1, " +
                    "status: \"IN_PROGRESS\", " +
                    "message: \"build in-progress\", " +
                    "stage: \"BUILD\"" +
                    "}"

        and:
            ClientResponse response = client.sendRequest("PUT", "/buildManager/build", body)
            Map build = new JsonSlurper().parseText(response.body) as Map
            UUID uuid = UUID.fromString(build.id)

        and:
            String updatedBuildBody = "{" +
                    "id: \"" + UUID.randomUUID() + "\", " +
                    "number: 4, " +
                    "status: \"IN_PROGRESS\", " +
                    "stage: \"BUILD\", " +
                    "message: \"build in-progress\"" +
                    "}"

        when:
            ClientResponse updatedBuildResponse = client.sendRequest("POST", "/buildManager/build/" + uuid, updatedBuildBody)

        then:
            updatedBuildResponse.status == HttpResponseStatus.ACCEPTED.code()
            Map updatedBuild = new JsonSlurper().parseText(updatedBuildResponse.body) as Map
            updatedBuild.id == uuid.toString()
            updatedBuild.number == 1
            updatedBuild.status == "IN_PROGRESS"
            updatedBuild.message == "build in-progress"
            updatedBuild.stage == "BUILD"

    }

    void 'should indicate build does not exist when updating build'() {
        given:
            UUID uuid = UUID.randomUUID()

        and:
            String body = "{" +
                    "number: 1, " +
                    "status: \"PASSED\", " +
                    "stage: \"DEVELOP\", " +
                    "message: \"develop completed\"" +
                    "}"

        when:
            ClientResponse response = client.sendRequest("POST", "/buildManager/build/" + uuid, body)

        then:
            response.status == HttpResponseStatus.NOT_FOUND.code()
            response.body == ""
    }

}
