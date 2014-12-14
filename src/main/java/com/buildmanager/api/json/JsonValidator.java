package com.buildmanager.api.json;

import com.buildmanager.json.ObjectMapperFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.core.report.ProcessingMessage;
import com.github.fge.jsonschema.core.report.ProcessingReport;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import com.github.fge.msgsimple.bundle.MessageBundle;
import com.github.fge.msgsimple.bundle.PropertiesBundle;
import com.google.common.base.Strings;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author jamesdbloom
 */
public class JsonValidator {
    private final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();
    private final MessageBundle messageBundle;
    private final JsonNode buildSchema;

    public JsonValidator(String messageResourcePath, String schemaResourcePath) throws IOException {
        messageBundle = PropertiesBundle.forPath(messageResourcePath);
        buildSchema = JsonLoader.fromResource(schemaResourcePath);
    }

    public List<BindingError> jsonValidator(String json) throws Exception {
        ProcessingReport validationReport =
                JsonSchemaFactory
                        .byDefault()
                        .getValidator()
                        .validate(buildSchema, objectMapper.readTree(json), true);

        List<BindingError> errorMessages = new ArrayList<>();
        if (!validationReport.isSuccess()) {
            for (ProcessingMessage processingMessage : validationReport) {
                errorMessages.add(getMessage(processingMessage));
            }
        }

        return errorMessages;
    }

    private final List<String> integerValidations = Arrays.asList("minItems", "maxItems", "minLength", "maxLength");
    private final List<String> listValidations = Arrays.asList("required", "enum");

    private BindingError getMessage(ProcessingMessage processingMessage) {
        String path = processingMessage.asJson().get("instance").get("pointer").asText().replaceFirst("/", "").replaceAll("/", ".");
        String type = processingMessage.asJson().get("keyword").asText();
        String message = messageBundle.getMessage("err." + path + (Strings.isNullOrEmpty(path) ? "" : ".") + type);
        if (listValidations.contains(type)) {
            message = String.format(message, processingMessage.asJson().get(type));
        }
        if (integerValidations.contains(type)) {
            message = String.format(message, processingMessage.asJson().get(type).asInt());
        }
        return new BindingError(path, type, message);
    }

}
