package com.buildmanager.api.build.server.handler

import com.buildmanager.api.build.uuid.UUIDFactory
import com.buildmanager.api.domain.Build
import com.buildmanager.api.domain.BuildStatus
import com.buildmanager.api.respository.BuildRepository
import com.buildmanager.api.server.handler.build.RestAPIBuildHandler
import com.google.common.base.Charsets
import io.netty.buffer.Unpooled
import io.netty.channel.embedded.EmbeddedChannel
import io.netty.handler.codec.http.*
import spock.lang.Specification

/**
 * @author jamesdbloom
 */
class RestAPIHandlerTest extends Specification {

    void 'should return list of builds'() {
        given:
            BuildRepository buildRepository = Mock(BuildRepository)
            EmbeddedChannel embeddedChannel = new EmbeddedChannel(new RestAPIBuildHandler(buildRepository))

        and:
            List<Build> buildList = Arrays.asList(
                    new Build().setId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc")).setNumber(1).setStage("BUILD").setStatus(BuildStatus.IN_PROGRESS),
                    new Build().setId(UUID.fromString("11ae191c-a0af-435c-a7f7-d5fda247ea47")).setNumber(2).setStage("AUTO_QA").setStatus(BuildStatus.PASSED)
            );
            String buildListJson = "[" +
                    "{\"id\":\"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\"number\":1,\"status\":\"IN_PROGRESS\",\"stage\":\"BUILD\"}," +
                    "{\"id\":\"11ae191c-a0af-435c-a7f7-d5fda247ea47\",\"number\":2,\"status\":\"PASSED\",\"stage\":\"AUTO_QA\"}" +
                    "]";

        and:
            HttpRequest httpRequest = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.GET, "/api/build")

        when:
            embeddedChannel.writeInbound(httpRequest)
            DefaultFullHttpResponse response = embeddedChannel.readOutbound() as DefaultFullHttpResponse

        then:
            1 * buildRepository.loadAll() >> buildList
            0 * _

        and:
            response.content().toString(Charsets.UTF_8) == buildListJson
    }

    void 'should return single build'() {
        given:
            BuildRepository buildRepository = Mock(BuildRepository)
            EmbeddedChannel embeddedChannel = new EmbeddedChannel(new RestAPIBuildHandler(buildRepository))

        and:
            Build build = new Build().setId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc")).setNumber(1).setStage("BUILD").setStatus(BuildStatus.IN_PROGRESS);
            String buildJson = "{" +
                    "\"id\":\"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\"," +
                    "\"number\":1," +
                    "\"status\":\"IN_PROGRESS\"," +
                    "\"stage\":\"BUILD\"" +
                    "}";

        and:
            HttpRequest httpRequest = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.GET, "/api/build/3d922b33-e2d5-4ccb-ade4-26b94377e4dc")

        when:
            embeddedChannel.writeInbound(httpRequest)
            DefaultFullHttpResponse response = embeddedChannel.readOutbound() as DefaultFullHttpResponse

        then:
            1 * buildRepository.load(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc")) >> build
            0 * _

        and:
            response.content().toString(Charsets.UTF_8) == buildJson
    }

    void 'should return save build'() {
        given:
            BuildRepository buildRepository = Mock(BuildRepository)
            RestAPIBuildHandler buildHandler = new RestAPIBuildHandler(buildRepository)
            UUIDFactory uuidFactory = Mock(UUIDFactory)
            buildHandler.uuidFactory = uuidFactory

        and:
            EmbeddedChannel embeddedChannel = new EmbeddedChannel(buildHandler)

        and:
            Build build = new Build().setId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc")).setNumber(1).setStage("BUILD").setStatus(BuildStatus.IN_PROGRESS)
            String buildRequestBody = "{" +
                    "\"number\":1," +
                    "\"status\":\"IN_PROGRESS\"," +
                    "\"message\":\"build in progress\"," +
                    "\"stage\":\"BUILD\"" +
                    "}";
            String buildResponseBody = "{" +
                    "\"id\":\"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\"," +
                    "\"number\":1," +
                    "\"status\":\"IN_PROGRESS\"," +
                    "\"message\":\"build in progress\"," +
                    "\"stage\":\"BUILD\"" +
                    "}";

        and:
            HttpRequest httpRequest = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.POST, "/api/build", Unpooled.wrappedBuffer(buildRequestBody.getBytes(Charsets.UTF_8)))

        when:
            embeddedChannel.writeInbound(httpRequest)
            DefaultFullHttpResponse response = embeddedChannel.readOutbound() as DefaultFullHttpResponse

        then:
            1 * uuidFactory.generateUUID() >> UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc")
            1 * buildRepository.save(build)
            0 * _

        and:
            response.content().toString(Charsets.UTF_8) == buildResponseBody
    }
}
