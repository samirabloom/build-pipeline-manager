package com.buildmanager.api.respository

import com.buildmanager.api.domain.Build
import com.buildmanager.api.domain.BuildStatus
import spock.lang.Specification

/**
 * @author jamesdbloom
 */
class BuildRepositoryTest extends Specification {

    void 'should save and load'() {
        given:
            BuildRepository buildRepository = new BuildRepository()
            Build build = new Build()
                    .setId(UUID.randomUUID())
                    .setNumber(123)
                    .setMessage("a message")
                    .setStage("UAT")
                    .setStatus(BuildStatus.IN_PROGRESS)

        when:
            buildRepository.save(build)

        then:
            buildRepository.load(build.id) == build
    }

    void 'should load all'() {
        given:
            Build buildOne = new Build()
                    .setId(UUID.randomUUID())
                    .setNumber(1)
                    .setMessage("message one")
                    .setStage("stage one")
                    .setStatus(BuildStatus.FAILED)
            Build buildTwo = new Build()
                    .setId(UUID.randomUUID())
                    .setNumber(2)
                    .setMessage("message two")
                    .setStage("stage two")
                    .setStatus(BuildStatus.PASSED)

        and:
            BuildRepository buildRepository = new BuildRepository()
            buildRepository.clear()

        and:
            buildRepository.save(buildOne)
            buildRepository.save(buildTwo)

        when:
            List<Build> builds = buildRepository.loadAll()

        then:
            builds == [buildOne, buildTwo]
    }

    void 'should delete'() {
        given:
            BuildRepository buildRepository = new BuildRepository()
            Build build = new Build()
                    .setId(UUID.randomUUID())
                    .setNumber(123)
                    .setMessage("a message")
                    .setStage("UAT")
                    .setStatus(BuildStatus.IN_PROGRESS)

        and:
            buildRepository.save(build)

        when:
            buildRepository.delete(build.id)

        then:
            !buildRepository.load(build.id)
    }
}
