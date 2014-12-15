package com.buildmanager.api.respository

import com.buildmanager.api.domain.Build
import com.buildmanager.api.domain.Pipeline
import com.buildmanager.api.domain.Stage
import spock.lang.Specification

/**
 * @author jamesdbloom
 */
class PipelineRepositoryTest extends Specification {

    void 'should save and load'() {
        given:
            PipelineRepository pipelineRepository = new PipelineRepository()
            Pipeline pipeline = new Pipeline()
                    .setId(UUID.randomUUID())
                    .setName("name")
                    .setStages(
                    Arrays.asList(
                            new Stage()
                                    .setName("stage one"),
                            new Stage()
                                    .setName("stage two")
                    )
            )

        when:
            pipelineRepository.save(pipeline)

        then:
            pipelineRepository.load(pipeline.id) == pipeline
    }

    void 'should load all'() {
        given:
            Pipeline pipelineOne = new Pipeline()
                    .setId(UUID.randomUUID())
                    .setName("pipeline one")
                    .setStages(
                    Arrays.asList(
                            new Stage()
                                    .setName("pipeline one - stage one"),
                            new Stage()
                                    .setName("pipeline one - stage two")
                    )
            )
            Pipeline pipelineTwo = new Pipeline()
                    .setId(UUID.randomUUID())
                    .setName("pipeline two")
                    .setStages(
                    Arrays.asList(
                            new Stage()
                                    .setName("pipeline two - stage one"),
                            new Stage()
                                    .setName("pipeline two - stage two")
                    )
            )

        and:
            PipelineRepository pipelineRepository = new PipelineRepository()
            pipelineRepository.clear()

        and:
            pipelineRepository.save(pipelineOne)
            pipelineRepository.save(pipelineTwo)

        when:
            List<Pipeline> pipelines = pipelineRepository.loadAll()

        then:
            pipelines == [pipelineOne, pipelineTwo]
    }

    void 'should delete'() {
        given:
            PipelineRepository pipelineRepository = new PipelineRepository()
            Pipeline pipeline = new Pipeline()
                    .setId(UUID.randomUUID())
                    .setName("name")
                    .setStages(
                    Arrays.asList(
                            new Stage()
                                    .setName("stage one"),
                            new Stage()
                                    .setName("stage two")
                    )
            )

        and:
            pipelineRepository.save(pipeline)

        when:
            pipelineRepository.delete(pipeline.id)

        then:
            !pipelineRepository.load(pipeline.id)
    }
}
