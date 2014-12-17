package com.buildmanager.api.server.handler.build

import com.buildmanager.api.domain.Build
import com.buildmanager.api.domain.BuildStatus
import com.buildmanager.api.respository.BuildRepository
import com.buildmanager.api.respository.PipelineRepository
import com.buildmanager.api.uuid.UUIDFactory
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
            RestAPIBuildHandler buildHandler = new RestAPIBuildHandler()
            buildHandler.buildRepository = Mock(BuildRepository)
            buildHandler.pipelineRepository = Mock(PipelineRepository)

        and:
            EmbeddedChannel embeddedChannel = new EmbeddedChannel(buildHandler)

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
            1 * buildHandler.buildRepository.loadAll() >> buildList
            0 * _

        and:
            response.content().toString(Charsets.UTF_8) == buildListJson
    }

    void 'should return single build'() {
        given:
            RestAPIBuildHandler buildHandler = new RestAPIBuildHandler()
            buildHandler.buildRepository = Mock(BuildRepository)
            buildHandler.pipelineRepository = Mock(PipelineRepository)

        and:
            EmbeddedChannel embeddedChannel = new EmbeddedChannel(buildHandler)

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
            1 * buildHandler.buildRepository.load(UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc")) >> build
            0 * _

        and:
            response.content().toString(Charsets.UTF_8) == buildJson
    }

    void 'should return save build'() {
        given:
            RestAPIBuildHandler buildHandler = new RestAPIBuildHandler()
            buildHandler.buildRepository = Mock(BuildRepository)
            buildHandler.pipelineRepository = Mock(PipelineRepository)
            buildHandler.uuidFactory = Mock(UUIDFactory)

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
                    "  \"pipelineId\" : \"ffff2b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"number\" : 1,\n" +
                    "  \"status\" : \"IN_PROGRESS\",\n" +
                    "  \"message\" : \"build in progress\",\n" +
                    "  \"stage\" : \"BUILD\",\n" +
                    "  \"createdDate\" : \"2014-12-14T18:52:02.043Z\",\n" +
                    "  \"updatedDate\" : \"2014-12-14T18:52:02.043Z\"\n" +
                    "}"
            String buildResponseBody = "{\n" +
                    "  \"id\" : \"3d922b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
                    "  \"pipelineId\" : \"ffff2b33-e2d5-4ccb-ade4-26b94377e4dc\",\n" +
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
            1 * buildHandler.pipelineRepository.load(UUID.fromString("ffff2b33-e2d5-4ccb-ade4-26b94377e4dc"))
            1 * buildHandler.uuidFactory.generateUUID() >> UUID.fromString("3d922b33-e2d5-4ccb-ade4-26b94377e4dc")
            1 * buildHandler.buildRepository.save(build)
            0 * _

        and:
            response.content().toString(Charsets.UTF_8) == buildResponseBody
    }
}
