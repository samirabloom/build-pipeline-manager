package com.buildmanager.api.server.handler.pipeline.integration

import com.buildmanager.api.build.ClientResponse
import com.buildmanager.api.build.RestClient
import com.buildmanager.api.server.BuildManager
import groovy.json.JsonSlurper
import io.netty.handler.codec.http.HttpResponseStatus
import spock.lang.Ignore
import spock.lang.Specification

/**
 * @author samirarabbanian
 */
class PipelineRestAddAPIIntTest extends Specification {
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

    void 'should add new pipeline'() {
        given:
            String body = "{" +
                    "name: \"build manager\", " +
                    "stages: [" +
                    "   {" +
                    "      name: \"BUILD\"" +
                    "   }," +
                    "   {" +
                    "      name: \"DEVELOPMENT\"" +
                    "   }" +
                    "]" +
                    "}"

        when:
            ClientResponse response = client.sendRequest("POST", "/api/pipeline", body)

        then:
            response.status == HttpResponseStatus.ACCEPTED.code()
            Map pipeline = new JsonSlurper().parseText(response.body) as Map
            pipeline.id
            pipeline.name == "build manager"
            pipeline.stages[0].name == "BUILD"
            pipeline.stages[1].name == "DEVELOPMENT"
    }

    void 'should validate pipeline name'() {
        given:
            String body = "{" +
                    "name: 2, " +
                    "stages: [" +
                    "   {" +
                    "      name: \"BUILD\"" +
                    "   }," +
                    "   {" +
                    "      name: \"DEVELOPMENT\"" +
                    "   }" +
                    "]" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("POST", "/api/pipeline", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"name\",\"type\":\"type\",\"message\":\"please enter a valid name\"}" +
                    "]";
    }


    void 'should validate pipeline has at least one stage'() {
        given:
            String body = "{" +
                    "name: \"build manager\", " +
                    "stages: [" +
                    "]" +
                    "}"

        when:
            ClientResponse response = client.sendRequest("POST", "/api/pipeline", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"stages\",\"type\":\"minItems\",\"message\":\"please enter at least one stage for the pipeline\"}" +
                    "]";
    }


    void 'should validate pipeline stage name'() {
        given:
            String body = "{" +
                    "name: \"build manager\", " +
                    "stages: [" +
                    "   {" +
                    "      name: 45" +
                    "   }," +
                    "   {" +
                    "      name: \"DEVELOPMENT\"" +
                    "   }" +
                    "]" +
                    "}"

        when:
            ClientResponse response = client.sendRequest("POST", "/api/pipeline", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"stages.name\",\"type\":\"type\",\"message\":\"please enter a valid stage name\"}" +
                    "]";
    }

    void 'should validate multiple validation errors'() {
        given:
            String body = "{" +
                    "name: \"\", " +
                    "stages: [ ]" +
                    "}"
        when:
            ClientResponse response = client.sendRequest("POST", "/api/pipeline", body)
        then:
            response.status == HttpResponseStatus.BAD_REQUEST.code()
            response.body == "[" +
                    "{\"path\":\"name\",\"type\":\"minLength\",\"message\":\"please enter a name between 1 and 50 characters\"}," +
                    "{\"path\":\"stages\",\"type\":\"minItems\",\"message\":\"please enter at least one stage for the pipeline\"}" +
                    "]";
    }

}
