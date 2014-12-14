package com.buildmanager.cli;

import com.buildmanager.api.server.BuildManager;
import org.apache.commons.cli.*;

/**
 * @author jamesdbloom
 */
public class Main {

    public static void main(String... arguments) {
        boolean showHelp;

        Options options = new Options();
        options.addOption("p", "port", true, "REST API HTTP port");
        options.addOption("h", "help", false, "Show help");

        CommandLineParser parser = new PosixParser();
        CommandLine cmd;
        try {
            cmd = parser.parse(options, arguments, false);
            showHelp = cmd.hasOption("h");
        } catch (ParseException e) {
            cmd = null;
            showHelp = true;
        }

        if (showHelp || !cmd.hasOption("port")) {
            new HelpFormatter().printHelp("java -jar <path to build-manager-jar-with-dependencies.jar>  ", "", options, "", true);
            System.exit(1);
            return;
        }

        int port = Integer.parseInt(cmd.getOptionValue("port", "0"));

        new BuildManager(port);
    }

}
