package com.buildmanager.api.json.time;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.ISODateTimeFormat;

import java.io.IOException;

/**
 * @author jamesdbloom
 */
public class JodaDateTimeSerializer extends JsonSerializer<DateTime> {

    public static final JodaDateTimeSerializer INSTANCE = new JodaDateTimeSerializer();

    protected JodaDateTimeSerializer() { }

    @Override
    public void serialize(DateTime date, JsonGenerator json, SerializerProvider provider) throws IOException {
        String formattedDate = ISODateTimeFormat.dateTime().print(date.withZone(DateTimeZone.UTC));
        json.writeString(formattedDate);
    }

}