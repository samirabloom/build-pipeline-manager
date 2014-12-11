function loadJson(path)
{
    'use strict';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/base/json/" + path, false);
    xmlhttp.send(null);

    if (xmlhttp.status === 200)
    {
        return JSON.parse(xmlhttp.responseText);
    }

    throw "Could not load JSON file: " + path;
}
