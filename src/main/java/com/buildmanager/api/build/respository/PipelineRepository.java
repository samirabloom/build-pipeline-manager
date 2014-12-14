package com.buildmanager.api.build.respository;

import com.buildmanager.api.build.domain.Pipeline;
import org.springframework.stereotype.Component;

/**
 * @author jamesdbloom
 */
@Component
public class PipelineRepository extends Repository<Pipeline> {

    protected PipelineRepository() {
        super(Pipeline.class);
    }
}
