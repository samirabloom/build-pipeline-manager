(function (module) {
    "use strict";

    var viewBuildResponse = {
        "id": "8f0666b2-df97-42f5-a13e-9deac7dd590e",
        "number": 1,
        "status": "PASSED",
        "stage": "BUILD",
        "message": "build completed"
    };

    var editBuildResponse = {
        "id": "8f0666b2-df97-42f5-a13e-9deac7dd590e",
        "number": 3,
        "status": "IN_PROGRESS",
        "stage": "AUTO_QA",
        "message": "auto qa being deployed"
    };

    var buildListResponse = [
        viewBuildResponse,
        editBuildResponse,
        viewBuildResponse,
        editBuildResponse
    ];

    module.exports = {
        build: {
            list: buildListResponse,
            view: viewBuildResponse,
            edit: editBuildResponse
        }
    };

})(module);