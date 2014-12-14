package com.buildmanager.api.configuration;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * @author jamesdbloom
 */
@Configuration
@ComponentScan(
        basePackages = {
                "com.buildmanager"
        }
)
public class RestAPIConfiguration {

}
