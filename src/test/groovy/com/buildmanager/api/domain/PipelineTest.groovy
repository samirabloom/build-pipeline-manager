package com.buildmanager.api.domain

import org.joda.time.DateTime
import spock.lang.Specification

/**
 * @author jamesdbloom
 */
class PipelineTest extends Specification {

    void 'should set and get fields correctly'() {
        given:
            UUID uuid = UUID.randomUUID();

        when:
            Pipeline pipeline = new Pipeline()
                    .setId(uuid)
                    .setName("name")
                    .setStages(
                    Arrays.asList(
                            new Stage()
                                    .setName("stage one"),
                            new Stage()
                                    .setName("stage two")
                    )
            )

        then:
            pipeline.getId() == uuid
            pipeline.getName() == "name"
            pipeline.getStages()[0].getName() == "stage one"
            pipeline.getStages()[1].getName() == "stage two"
    }

    void 'should only update certain fields'() {
        given:
            UUID uuid = UUID.randomUUID();
            Pipeline pipeline = new Pipeline()
                    .setId(uuid)
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
            pipeline.update(
                    new Pipeline()
                            .setId(UUID.randomUUID())
                            .setName("new name")
                            .setStages(
                            Arrays.asList(
                                    new Stage()
                                            .setName("new stage one"),
                                    new Stage()
                                            .setName("new stage two")
                            )
                    )
            )

        then: // not modified
            pipeline.getId() == uuid

        and: // modified
            pipeline.getName() == "new name"
            pipeline.getStages()[0].getName() == "new stage one"
            pipeline.getStages()[1].getName() == "new stage two"

    }
}
