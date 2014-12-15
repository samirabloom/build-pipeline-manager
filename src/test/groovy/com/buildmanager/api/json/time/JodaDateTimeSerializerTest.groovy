package com.buildmanager.api.json.time

import com.buildmanager.api.json.ObjectMapperFactory
import org.joda.time.DateTime
import spock.lang.Specification
import spock.lang.Unroll

/**
 * @author jamesdbloom
 */
class JodaDateTimeSerializerTest extends Specification {

    @Unroll
    void 'should serialize \'#test\''() throws IOException {
        when:
            String actualJson = ObjectMapperFactory.createObjectMapper().writeValueAsString(object)

        then:
            actualJson == expectedJson

        where:
            test        | object                                   || expectedJson
            'full date' | new DateTime("2014-12-14T18:52:02.043Z") || "\"2014-12-14T18:52:02.043Z\""
            'year only' | new DateTime("2014-12-14")               || "\"2014-12-14T00:00:00.000Z\""
    }
}
