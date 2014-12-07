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
class BuildRestUpdateAPIIntSpec extends Specification {
    static int port = 9090
    static BuildManager buildManager

    void setupSpec() {
        buildManager = new BuildManager(port)
    }

    void cleanupSpec() {
        buildManager.stop()
    }

    void 'should update build'() {
        given:
            RestClient client = new RestClient("localhost", port)
            UUID uuid = UUID.randomUUID()

        and:
            new BuildRepository().save(
                    new Build()
                            .setId(uuid)
                            .setNumber(1)
                            .setStatus(BuildStatus.IN_PROGRESS)
                            .setStage("BUILD")
                            .setMessage("build in-progress")
            )
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
            response.status == HttpResponseStatus.OK.code()
            Map build = new JsonSlurper().parseText(response.body) as Map
            build.id == uuid.toString()
            build.number == 1
            build.status == "PASSED"
            build.message == "develop completed"
            build.stage == "DEVELOP"
    }

    void 'should not update non-updatable fields'() {
        given:
            RestClient client = new RestClient("localhost", port)
            UUID uuid = UUID.randomUUID()

        and:
            new BuildRepository().save(
                    new Build()
                            .setId(uuid)
                            .setNumber(1)
                            .setStatus(BuildStatus.IN_PROGRESS)
                            .setStage("BUILD")
                            .setMessage("build in-progress")
            )
        and:
            String body = "{" +
                    "id: \"" + UUID.randomUUID() +"\", "+
                    "number: 4, " +
                    "status: \"IN_PROGRESS\", " +
                    "stage: \"BUILD\", " +
                    "message: \"build in-progress\"" +
                    "}"

        when:
            ClientResponse response = client.sendRequest("POST", "/buildManager/build/" + uuid, body)

        then:
            response.status == HttpResponseStatus.OK.code()
            Map build = new JsonSlurper().parseText(response.body) as Map
            build.id == uuid.toString()
            build.number == 1
            build.status == "IN_PROGRESS"
            build.message == "build in-progress"
            build.stage == "BUILD"

    }

    void 'should indicate build does not exist when updating build'() {
        given:
            RestClient client = new RestClient("localhost", port)
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
