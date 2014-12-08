package com.buildmanager.api.build.respository

import com.buildmanager.api.build.domain.Build
import com.buildmanager.api.build.domain.BuildStatus
import spock.lang.Specification

/**
 * @author jamesdbloom
 */
class BuildRepositorySpec extends Specification {

    void 'should save and retrieve build'() {
        given:
            BuildRepository buildRepository = new BuildRepository();
            Build build = new Build()
                    .setId(UUID.randomUUID())
                    .setNumber(123)
                    .setMessage("a message")
                    .setStage("UAT")
                    .setStatus(BuildStatus.IN_PROGRESS);

        when:
            buildRepository.save(build);

        then:
            buildRepository.load(build.id) == build
    }

    void 'should delete build'() {
        given:
            BuildRepository buildRepository = new BuildRepository();
            Build build = new Build()
                    .setId(UUID.randomUUID())
                    .setNumber(123)
                    .setMessage("a message")
                    .setStage("UAT")
                    .setStatus(BuildStatus.IN_PROGRESS);

        and:
            buildRepository.save(build);

        when:
            buildRepository.delete(build.id);

        then:
            !buildRepository.load(build.id)
    }
}
