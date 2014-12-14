package com.buildmanager.api.domain;

import java.util.UUID;

/**
 * @author samirarabbanian
 */
public abstract class Entity<T extends Entity> extends ObjectWithReflectiveEqualsHashCodeToString implements Comparable {
    public abstract UUID getId();
    public abstract Entity setId(UUID id);
    public abstract Entity update(T updater);

    @Override
    public int compareTo(Object o) {
        if (o instanceof Entity) {
            return getId().compareTo(((Entity) o).getId());
        } else {
            return -1;
        }
    }
}
