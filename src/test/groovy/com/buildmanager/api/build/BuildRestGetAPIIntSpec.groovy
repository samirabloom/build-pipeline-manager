package com.buildmanager.api.build

import com.buildmanager.api.build.domain.Build
import com.buildmanager.api.build.domain.BuildStatus
import com.buildmanager.api.build.respository.BuildRepository
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
            UUID uuid = UUID.randomUUID()

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
            ClientResponse response = client.sendRequest("GET", "/buildManager/build/" + uuid.toString(), "")

        then:
            response.status == HttpResponseStatus.OK.code()
            response.body == "{" +
                    "\"id\":\"" + uuid + "\"," +
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
            ClientResponse response = client.sendRequest("GET", "/buildManager/build/" + UUID.randomUUID().toString(), "")

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
            response.body == "[\"Invalid UUID string: a\"]";
    }



}
