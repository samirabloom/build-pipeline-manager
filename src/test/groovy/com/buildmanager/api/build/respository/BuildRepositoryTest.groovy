package com.buildmanager.api.build.respository

import com.buildmanager.api.build.domain.Build
import com.buildmanager.api.build.domain.BuildStatus
import spock.lang.Specification

/**
 * @author jamesdbloom
 */
class BuildRepositoryTest extends Specification {

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
            buildRepository.saveBuild(build);

        then:
            buildRepository.loadBuild(build.id) == build
    }
}
