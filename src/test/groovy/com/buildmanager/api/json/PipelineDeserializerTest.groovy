package com.buildmanager.api.json

import com.buildmanager.api.domain.Build
import com.buildmanager.api.domain.Pipeline
import com.buildmanager.api.domain.Stage
import spock.lang.Specification
import spock.lang.Unroll

/**
 * @author jamesdbloom
 */
class PipelineDeserializerTest extends Specification {

    public static final String NEW_LINE = System.getProperty("line.separator")

    @Unroll
    void 'should deserialize json \'#test\''() throws IOException {
        when:
            Pipeline actualObject = ObjectMapperFactory.createObjectMapper().readValue(json, Pipeline.class)

        then:
            actualObject == expectedObject

        where:
            test             | json  || expectedObject
            'minimal object' | "{ \"name\" : \"name\" }" || new Pipeline().setName("name")
            'full object'    | "" +
                    "{" + NEW_LINE +
                    "  \"id\" : \"3749304e-7eb2-404c-b2ea-830f1d8e1347\"," + NEW_LINE +
                    "  \"name\" : \"name\"," + NEW_LINE +
                    "  \"stages\" : [ {" + NEW_LINE +
                    "    \"name\" : \"stage one\"" + NEW_LINE +
                    "  }, {" + NEW_LINE +
                    "    \"name\" : \"stage two\"" + NEW_LINE +
                    "  } ]" + NEW_LINE +
                    "}"              || new Pipeline()
                    .setId(UUID.fromString("3749304e-7eb2-404c-b2ea-830f1d8e1347"))
                    .setName("name")
                    .setStages(
                    Arrays.asList(
                            new Stage()
                                    .setName("stage one"),
                            new Stage()
                                    .setName("stage two")
                    ))
    }
}
