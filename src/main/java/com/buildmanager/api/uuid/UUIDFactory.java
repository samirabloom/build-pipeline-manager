package com.buildmanager.api.uuid;

import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * @author jamesdbloom
 */
@Component
public class UUIDFactory {

    public UUID generateUUID() {
        return UUID.randomUUID();
    }
}
