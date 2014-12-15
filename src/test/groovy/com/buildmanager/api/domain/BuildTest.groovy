package com.buildmanager.api.domain

import org.joda.time.DateTime
import spock.lang.Specification

/**
 * @author jamesdbloom
 */
class BuildTest extends Specification {

    void 'should set and get fields correctly'() {
        given:
            UUID uuid = UUID.randomUUID();
            DateTime dateTime = new DateTime("2010-10-10");

        when:
            Build build = new Build()
                    .setId(uuid)
                    .setNumber(1)
                    .setMessage("message")
                    .setStage("stage")
                    .setStatus(BuildStatus.FAILED)
                    .setCreatedDate(dateTime)
                    .setUpdatedDate(dateTime)

        then:
            build.getId() == uuid
            build.getNumber() == 1
            build.getCreatedDate() == dateTime
            build.getUpdatedDate() == dateTime
            build.getMessage() == "message"
            build.getStage() == "stage"
            build.getStatus() == BuildStatus.FAILED
    }

    void 'should only update certain fields'() {
        given:
            UUID uuid = UUID.randomUUID();
            DateTime dateTime = new DateTime("2010-10-10");
            Build build = new Build()
                    .setId(uuid)
                    .setNumber(1)
                    .setMessage("message")
                    .setStage("stage")
                    .setStatus(BuildStatus.FAILED)
                    .setCreatedDate(dateTime)
                    .setUpdatedDate(dateTime)

        when:
            build.update(
                    new Build()
                            .setId(UUID.randomUUID())
                            .setNumber(2)
                            .setMessage("new message")
                            .setStage("new stage")
                            .setStatus(BuildStatus.PASSED)
                            .setCreatedDate(new DateTime())
            )

        then: // not modified
            build.getId() == uuid
            build.getNumber() == 1
            build.getCreatedDate() == dateTime

        and: // modified
            build.getUpdatedDate() != dateTime
            build.getMessage() == "new message"
            build.getStage() == "new stage"
            build.getStatus() == BuildStatus.PASSED

    }
}
