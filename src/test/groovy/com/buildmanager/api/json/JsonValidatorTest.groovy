package com.buildmanager.api.json

import spock.lang.Specification
import spock.lang.Unroll

/**
 * @author jamesdbloom
 */
class JsonValidatorTest extends Specification {

    @Unroll
    void 'should validate \'#scenario\' and format error message'() {
        given:
            JsonValidator jsonValidator = new JsonValidator("/json/messages/test_validation_message.properties", "/json/schemas/test_json_schema.json");

        when:
            List<BindingError> validator = jsonValidator.jsonValidator(json)

        then:
            validator == result

        where:
            scenario               | json                                                                                   || result
            'no errors'            | "{arrayField: [ \"one\" ], enumField: \"one\"}"                                        || []
            'required fields'      | "{}"                                                                                   || [new BindingError("", "required", "please enter all required fields - [\"arrayField\",\"enumField\"]")]
            'too few items'        | "{arrayField: [ ],         enumField: \"one\"}"                                        || [new BindingError("arrayField", "minItems", "please enter at least 1 item(s)")]
            'too long string'      | "{arrayField: [ \"one\" ], enumField: \"one\", stringField: \"1234567\"}"              || [new BindingError("stringField", "maxLength", "please enter less then 6 characters")]
            'incorrect enum'       | "{arrayField: [ \"one\" ], enumField: \"four\"}"                                       || [new BindingError("enumField", "enum", "please enter a valid value from [\"one\",\"two\"]")]
            'extra field'          | "{arrayField: [ \"one\" ], enumField: \"one\", extra: \"field\"}"                      || [new BindingError("", "additionalProperties", "please only provide allow fields, the following fields are not allowed: [\"extra\"]")]
            'incorrect sub-fields' | "{arrayField: [ \"one\" ], enumField: \"one\", objectField: {stringField: \"1234\"} }" || [new BindingError("objectField.stringField", "maxLength", "please enter less then 3 characters")]
            'missing sub-fields'   | "{arrayField: [ \"one\" ], enumField: \"one\", objectField: { } }"                     || [new BindingError("objectField", "required", "please enter all required fields - [\"stringField\"]")]
            'multiple errors'      | "{arrayField: [ ],  stringField: \"1234\"}"                                            || [
                    new BindingError("", "required", "please enter all required fields - [\"arrayField\",\"enumField\"]"),
                    new BindingError("arrayField", "minItems", "please enter at least 1 item(s)"),
                    new BindingError("stringField", "minLength", "please enter at least 5 characters")
            ]
    }
}
