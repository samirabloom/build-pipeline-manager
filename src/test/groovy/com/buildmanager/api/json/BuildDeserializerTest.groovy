package com.buildmanager.api.json

import com.buildmanager.api.domain.Build
import com.buildmanager.api.domain.BuildStatus
import org.joda.time.DateTime
import spock.lang.Specification
import spock.lang.Unroll

/**
 * @author jamesdbloom
 */
class BuildDeserializerTest extends Specification {

    public static final String NEW_LINE = System.getProperty("line.separator")

    @Unroll
    void 'should deserialize json \'#test\''() throws IOException {
        when:
            Build actualObject = ObjectMapperFactory.createObjectMapper().readValue(json, Build.class)

        then:
            actualObject == expectedObject

        where:
            test             | json || expectedObject
            'minimal object' | "" +
                    "{" + NEW_LINE +
                    "  \"createdDate\" : \"2014-12-15T18:29:16.965Z\"," + NEW_LINE +
                    "  \"updatedDate\" : \"2014-12-15T18:29:16.965Z\"" + NEW_LINE +
                    "}"             || new Build()
                    .setCreatedDate(new DateTime("2014-12-15T18:29:16.965Z"))
                    .setUpdatedDate(new DateTime("2014-12-15T18:29:16.965Z"))
            'full object'    | "" +
                    "{" + NEW_LINE +
                    "  \"id\" : \"3749304e-7eb2-404c-b2ea-830f1d8e1347\"," + NEW_LINE +
                    "  \"number\" : 1," + NEW_LINE +
                    "  \"status\" : \"FAILED\"," + NEW_LINE +
                    "  \"message\" : \"message\"," + NEW_LINE +
                    "  \"stage\" : \"stage\"," + NEW_LINE +
                    "  \"createdDate\" : \"2014-12-14T18:52:02.043Z\"," + NEW_LINE +
                    "  \"updatedDate\" : \"2014-12-14T18:52:02.043Z\"" + NEW_LINE +
                    "}"             || new Build()
                    .setId(UUID.fromString("3749304e-7eb2-404c-b2ea-830f1d8e1347"))
                    .setNumber(1)
                    .setMessage("message")
                    .setStage("stage")
                    .setStatus(BuildStatus.FAILED)
                    .setCreatedDate(new DateTime("2014-12-14T18:52:02.043Z"))
                    .setUpdatedDate(new DateTime("2014-12-14T18:52:02.043Z"))
    }
}
