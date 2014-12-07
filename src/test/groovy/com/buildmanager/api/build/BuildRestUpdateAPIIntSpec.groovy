package com.buildmanager.api.build

import com.buildmanager.api.build.server.BuildManager
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

    }

    void 'should indicate build does not exist when retrieving build'() {

    }

    void 'should delete build'() {

    }

    void 'should indicate build does not exist when deleting build'() {

    }
}
