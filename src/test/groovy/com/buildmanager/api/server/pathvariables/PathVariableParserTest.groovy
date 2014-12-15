package com.buildmanager.api.server.pathvariables

import com.buildmanager.api.server.pathvariables.PathVariable
import com.buildmanager.api.server.pathvariables.PathVariableParser
import spock.lang.Specification
import spock.lang.Unroll

/**
 * @author jamesdbloom
 */
class PathVariableParserTest extends Specification {

    @Unroll
    void 'should parse path variable pattern in \'#uriPattern\''() {
        when:
            List pathVariablesPattern = new PathVariableParser().parseUriPattern(uriPattern);

        then:
            pathVariablesPattern == result

        where:
            uriPattern                                        || result
            "/foo/bar"                                        || []
            "/foo/bar/{one}"                                  || [new PathVariable("one", "String")]
            "/foo/bar/{one}/{two}"                            || [new PathVariable("two", "String"), new PathVariable("one", "String")]
            "/foo/bar/{one}/{two}/{three}"                    || [new PathVariable("three", "String"), new PathVariable("two", "String"), new PathVariable("one", "String")]
            "/foo/bar/{one:String}"                           || [new PathVariable("one", "String")]
            "/foo/bar/{one:String}/{two:UUID}"                || [new PathVariable("two", "UUID"), new PathVariable("one", "String")]
            "/foo/bar/{one:Float}/{two:UUID}/{three:Integer}" || [new PathVariable("three", "Integer"), new PathVariable("two", "UUID"), new PathVariable("one", "Float")]
    }

    @Unroll
    void 'should parse path variables in \'#uri\''() {
        when:
            Map pathVariables = new PathVariableParser().parseUri(pathVariablesPattern, uri);

        then:
            pathVariables == result

        where:
            pathVariablesPattern                                                                                        | uri                                                   || result
            []                                                                                                          | "/foo/bar"                                            || [:]
            [new PathVariable("one", "String")]                                                                         | "/foo/bar/one"                                        || ["one": "one"]
            [new PathVariable("two", "String"), new PathVariable("one", "String")]                                      | "/foo/bar/one/two"                                    || ["one": "one", "two": "two"]
            [new PathVariable("three", "String"), new PathVariable("two", "String"), new PathVariable("one", "String")] | "/foo/bar/one/two/three"                              || ["one": "one", "two": "two", "three": "three"]
            [new PathVariable("two", "String"), new PathVariable("one", "UUID")]                                        | "/foo/bar/8f1c543a-c608-43b8-8341-8d5df1149be4/two"   || ["one": UUID.fromString("8f1c543a-c608-43b8-8341-8d5df1149be4"), "two": "two"]
            [new PathVariable("three", "Integer"), new PathVariable("two", "UUID"), new PathVariable("one", "Float")]   | "/foo/bar/1.0/8f1c543a-c608-43b8-8341-8d5df1149be4/3" || ["one": 1.0, "two": UUID.fromString("8f1c543a-c608-43b8-8341-8d5df1149be4"), "three": 3]
            [new PathVariable("three", "Integer"), new PathVariable("two", "UUID"), new PathVariable("one", "Float")]   | "/foo/bar/1/8f1c543a-c608-43b8-8341-8d5df1149be4/3"   || ["one": 1.0, "two": UUID.fromString("8f1c543a-c608-43b8-8341-8d5df1149be4"), "three": 3]
    }

    @Unroll
    void 'should parse handle invalid variables in \'#uri\''() {
        when:
            new PathVariableParser().parseUri(pathVariablesPattern, uri);

        then:
            Exception ex = thrown()
            ex.message == message
            ex.class == type

        where:
            pathVariablesPattern                                                                                      | uri                                                             || type                     || message
            [new PathVariable("two", "String"), new PathVariable("one", "UUID")]                                      | "/foo/bar/not_uuid/two"                                         || IllegalArgumentException || "Invalid UUID string: not_uuid"
            [new PathVariable("three", "Integer"), new PathVariable("two", "UUID"), new PathVariable("one", "Float")] | "/foo/bar/not_float/8f1c543a-c608-43b8-8341-8d5df1149be4/3"     || NumberFormatException    || "For input string: \"not_float\""
            [new PathVariable("three", "Integer"), new PathVariable("two", "UUID"), new PathVariable("one", "Float")] | "/foo/bar/1.0/8f1c543a-c608-43b8-8341-8d5df1149be4/not_integer" || NumberFormatException    || "For input string: \"not_integer\""
    }
}
