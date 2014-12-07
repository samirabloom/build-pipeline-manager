package com.buildmanager.api.build

import com.buildmanager.api.build.domain.Build
import com.buildmanager.api.build.domain.BuildStatus
import com.buildmanager.api.build.server.BuildManager
import io.netty.handler.codec.http.HttpResponseStatus
import spock.lang.Specification

/**
 * @author samirarabbanian
 */
class BuildRestDeleteAPIIntSpec extends Specification {
    static int port = 9090
    static BuildManager buildManager

    void setupSpec() {
        buildManager = new BuildManager(port)
    }

    void cleanupSpec() {
        buildManager.stop()
    }

    void 'should delete build'() {
        given:
            RestClient client = new RestClient("localhost", port)
            UUID uuid = UUID.randomUUID()

        and:
            BuildManager.database.put(uuid,
                    new Build()
                            .setId(uuid)
                            .setNumber(1)
                            .setStatus(BuildStatus.PASSED)
                            .setStage("BUILD")
                            .setMessage("build completed")
            )

        when:
            ClientResponse response = client.sendRequest("DELETE", "/buildManager/build/" + uuid, "")

        then:
            response.status == HttpResponseStatus.OK.code()
            response.body == "";

    }

    void 'should indicate build does not exist when deleting build'() {
        given:
            RestClient client = new RestClient("localhost", port)

        when:
            ClientResponse response = client.sendRequest("DELETE", "/buildManager/build/" + UUID.randomUUID(), "")

        then:
            response.status == HttpResponseStatus.NOT_FOUND.code()
            response.body == "";
    }
}
