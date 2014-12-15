package com.buildmanager.api.json.time

import com.buildmanager.api.json.ObjectMapperFactory
import org.joda.time.DateTime
import spock.lang.Specification
import spock.lang.Unroll

/**
 * @author jamesdbloom
 */
class JodaDateTimeDeserializerTest extends Specification {

    @Unroll
    void 'should deserialize json \'#test\''() throws IOException {
        when:
            DateTime actualObject = ObjectMapperFactory.createObjectMapper().readValue(json, DateTime.class)

        then:
            actualObject == expectedObject

        where:
            test        | json                           || expectedObject
            'full date' | "\"2014-12-14T18:52:02.043Z\"" || new DateTime("2014-12-14T18:52:02.043Z")
            'year only' | "\"2014-12-14T00:00:00.000Z\"" || new DateTime("2014-12-14")
    }
}
