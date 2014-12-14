package com.buildmanager.api.json.time;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.joda.time.DateTime;

/**
 * @author jamesdbloom
 */
public class JodaTimeModule extends SimpleModule {

    public static final Version VERSION = new Version(1, 0, 0, null, "com.nektan.gameserver.json", "json-mapping");

    public JodaTimeModule() {
        super(VERSION);

        addSerializer(DateTime.class, JodaDateTimeSerializer.INSTANCE);
        addDeserializer(DateTime.class, JodaDateTimeDeserializer.INSTANCE);
    }

}