package com.buildmanager.api.respository;

import com.buildmanager.api.domain.Pipeline;
import org.springframework.stereotype.Component;

/**
 * @author jamesdbloom
 */
@Component
public class PipelineRepository extends Repository<Pipeline> {

    public PipelineRepository() {
        super(Pipeline.class);
    }
}
