package com.buildmanager

import spock.lang.Specification
import spock.lang.Unroll

/**
 * @author samirarabbanian
 */
class ExampleSpec extends Specification {

    void setup() {
    }

    void 'this is a simple test'() {
        given:
            int sami = 99

        when:
            sami++

        then:
            sami > 99
    }

    @Unroll
    void '#value1 plus #value2 should be #expected'() {
        given:

        when:
            int actual = value1 + value2

        then:
            actual == expected

        where:
            value1 | value2 || expected
            1      | 2      || 3
            2      | 3      || 5
    }

    void 'mock socket throws exception'() {
        given:
            Socket mockSocket = Mock(Socket)

        when:
            mockSocket.close()

        then:
            thrown(IOException)
            1 * mockSocket.close() >> { throw new IOException("TEST EXCEPTION") }
            0 * _
    }
}
