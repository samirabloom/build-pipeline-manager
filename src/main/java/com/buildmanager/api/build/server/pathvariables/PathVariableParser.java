package com.buildmanager.api.build.server.pathvariables;

import com.buildmanager.api.build.server.pathvariables.types.PathVariableTypeConverter;
import com.buildmanager.api.build.server.pathvariables.types.TypeRegistry;
import com.google.common.base.Strings;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author jamesdbloom
 */
public class PathVariableParser {

    private static final String DEFAULT_TYPE = "String";
    private static final TypeRegistry typeRegistry = new TypeRegistry();

    public List<PathVariable> parseUriPattern(String uriPattern) {
        LinkedList<PathVariable> pathVariablesPattern = new LinkedList<>();
        Pattern p = Pattern.compile("\\{" +
                "(?<name>\\w+?)" +
                "(:(?<type>(\\w*\\.?)+?))??" +
                "\\}");
        Matcher m = p.matcher(uriPattern);
        while (m.find()) {
            String name = m.group("name");
            String type = DEFAULT_TYPE;
            if (!Strings.isNullOrEmpty(m.group("type"))) {
                type = m.group("type");
            }
            pathVariablesPattern.addFirst(new PathVariable(name, type));
        }
        return pathVariablesPattern;
    }

    public Map<String, Object> parseUri(List<PathVariable> pathVariablesPattern, String uri) {
        Map<String, Object> pathVariables = new HashMap<>();
        String[] uriParts = uri.split("/");
        for (int i = 0; i < pathVariablesPattern.size(); i++) {
            PathVariable pathVariablePattern = pathVariablesPattern.get(i);
            PathVariableTypeConverter typeParser = typeRegistry.getTypeParser(pathVariablePattern.type);
            pathVariables.put(pathVariablePattern.name, typeParser.fromString(uriParts[uriParts.length - 1 - i]));
        }
        return pathVariables;
    }

}
