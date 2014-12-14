package com.buildmanager.api.respository;

import com.buildmanager.api.domain.Build;
import org.springframework.stereotype.Component;

/**
 * @author jamesdbloom
 */
@Component
public class BuildRepository extends Repository<Build> {

    protected BuildRepository() {
        super(Build.class);
    }
}
