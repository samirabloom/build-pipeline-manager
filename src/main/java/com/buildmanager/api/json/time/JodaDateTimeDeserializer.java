package com.buildmanager.api.json.time;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.joda.time.DateTime;
import org.joda.time.format.ISODateTimeFormat;

import java.io.IOException;

/**
 * @author jamesdbloom
 */
public class JodaDateTimeDeserializer extends JsonDeserializer<DateTime> {

    public static final JodaDateTimeDeserializer INSTANCE = new JodaDateTimeDeserializer();

    protected JodaDateTimeDeserializer() { }

    @Override
    public DateTime deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        if (jp.getCurrentToken() == JsonToken.VALUE_STRING) {
            return ISODateTimeFormat.dateTime().parseDateTime(jp.getText());
        } else {
            return null;
        }
    }

}