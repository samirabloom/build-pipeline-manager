package com.buildmanager.api.json

import com.buildmanager.api.domain.Pipeline
import com.buildmanager.api.domain.Stage
import spock.lang.Specification
import spock.lang.Unroll

/**
 * @author jamesdbloom
 */
class PipelineSerializerTest extends Specification {


    public static final String NEW_LINE = System.getProperty("line.separator")

    @Unroll
    void 'should serialize \'#test\''() throws IOException {
        when:
            String actualJson = ObjectMapperFactory.createObjectMapper().writer().withDefaultPrettyPrinter().writeValueAsString(object)

        then:
            actualJson == expectedJson

        where:
            object         | test             || expectedJson
            new Pipeline() | 'minimal object' || "{ }"
            new Pipeline()
                    .setId(UUID.fromString("3749304e-7eb2-404c-b2ea-830f1d8e1347"))
                    .setName("name")
                    .setStages(
                    Arrays.asList(
                            new Stage()
                                    .setName("stage one"),
                            new Stage()
                                    .setName("stage two")
                    ))     | 'full object'    || "" +
                    "{" + NEW_LINE +
                    "  \"id\" : \"3749304e-7eb2-404c-b2ea-830f1d8e1347\"," + NEW_LINE +
                    "  \"name\" : \"name\"," + NEW_LINE +
                    "  \"stages\" : [ {" + NEW_LINE +
                    "    \"name\" : \"stage one\"" + NEW_LINE +
                    "  }, {" + NEW_LINE +
                    "    \"name\" : \"stage two\"" + NEW_LINE +
                    "  } ]" + NEW_LINE +
                    "}"

    }
}
