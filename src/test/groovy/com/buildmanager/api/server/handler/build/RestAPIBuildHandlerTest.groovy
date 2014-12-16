package com.buildmanager.api.server.handler.build

import com.buildmanager.api.uuid.UUIDFactory
import com.buildmanager.api.domain.Build
import com.buildmanager.api.domain.BuildStatus
import com.buildmanager.api.respository.BuildRepository
import com.buildmanager.api.server.handler.build.RestAPIBuildHandler
import com.google.common.base.Charsets
import io.netty.buffer.Unpooled
import io.netty.channel.embedded.EmbeddedChannel
import io.netty.handler.codec.http.*
import org.joda.time.DateTime
import spock.lang.Specification

/**
 * @author jamesdbloom
 */
class RestAPIBuildHandlerTest extends Specification {

    void 'should return list of builds'() {
        given:
            BuildRepository buildRepository = Mock(BuildRepository)
            EmbeddedChannel embeddedChannel = new EmbeddedChannel(new RestAPIBuildHandler(buildRepository))

        and:
            List<Build> buildList = Arrays.asList(
                    new Build()
                            .setId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc"))
                            .setPipelineId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc"))
                            .setNumber(1)
                            .setStage("BUILD")
                            .setStatus(BuildStatus.IN_PROGRESS)
                            .setCreatedDate(new DateTime("2014-12-14T18:52:01.720Z"))
                            .setUpdatedDate(new DateTime("2014-12-14T18:52:01.720Z")),
                    new Build()
                            .setId(UUID.fromString("11ae191c-a0af-435c-a7f7-d5fda247ea47"))
                            .setPipelineId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc"))
                            .setNumber(2)
                            .setStage("AUTO_QA")
                            .setStatus(BuildStatus.PASSED)
                            .setCreatedDate(new DateTime("2014-12-14T18:52:01.721Z"))
                            .setUpdatedDate(new DateTime("2014-12-14T18:52:01.721Z"))
            );
            String buildListJson = "[ {\n" +
                    "  \"id\" : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"pipelineId\" : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"number\" : 1,\n" +
                    "  \"status\" : \"IN_PROGRESS\",\n" +
                    "  \"stage\" : \"BUILD\",\n" +
                    "  \"createdDate\" : \"2014-12-14T18:52:01.720Z\",\n" +
                    "  \"updatedDate\" : \"2014-12-14T18:52:01.720Z\"\n" +
                    "}, {\n" +
                    "  \"id\" : \"11ae191c-a0af-435c-a7f7-d5fda247ea47\",\n" +
                    "  \"pipelineId\" : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"number\" : 2,\n" +
                    "  \"status\" : \"PASSED\",\n" +
                    "  \"stage\" : \"AUTO_QA\",\n" +
                    "  \"createdDate\" : \"2014-12-14T18:52:01.721Z\",\n" +
                    "  \"updatedDate\" : \"2014-12-14T18:52:01.721Z\"\n" +
                    "} ]";

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
            Build build = new Build()
                    .setId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc"))
                    .setPipelineId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc"))
                    .setNumber(1)
                    .setStage("BUILD")
                    .setStatus(BuildStatus.IN_PROGRESS)
                    .setCreatedDate(new DateTime("2014-12-14T18:52:02.007Z"))
                    .setUpdatedDate(new DateTime("2014-12-14T18:52:02.007Z"));
            String buildJson = "{\n" +
                    "  \"id\" : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"pipelineId\" : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"number\" : 1,\n" +
                    "  \"status\" : \"IN_PROGRESS\",\n" +
                    "  \"stage\" : \"BUILD\",\n" +
                    "  \"createdDate\" : \"2014-12-14T18:52:02.007Z\",\n" +
                    "  \"updatedDate\" : \"2014-12-14T18:52:02.007Z\"\n" +
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
            Build build = new Build()
                    .setId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc"))
                    .setPipelineId(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc"))
                    .setNumber(1)
                    .setStage("BUILD")
                    .setStatus(BuildStatus.IN_PROGRESS)
                    .setCreatedDate(new DateTime("2014-12-14T18:52:02.043Z"))
                    .setUpdatedDate(new DateTime("2014-12-14T18:52:02.043Z"))
            String buildRequestBody = "{\n" +
                    "  \"pipelineId\" : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"number\" : 1,\n" +
                    "  \"status\" : \"IN_PROGRESS\",\n" +
                    "  \"message\" : \"build in progress\",\n" +
                    "  \"stage\" : \"BUILD\",\n" +
                    "  \"createdDate\" : \"2014-12-14T18:52:02.043Z\",\n" +
                    "  \"updatedDate\" : \"2014-12-14T18:52:02.043Z\"\n" +
                    "}"
            String buildResponseBody = "{\n" +
                    "  \"id\" : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"pipelineId\" : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"number\" : 1,\n" +
                    "  \"status\" : \"IN_PROGRESS\",\n" +
                    "  \"message\" : \"build in progress\",\n" +
                    "  \"stage\" : \"BUILD\",\n" +
                    "  \"createdDate\" : \"2014-12-14T18:52:02.043Z\",\n" +
                    "  \"updatedDate\" : \"2014-12-14T18:52:02.043Z\"\n" +
                    "}"

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
