package com.goncalves.API.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;

@Service
public class JavaCompilerService {

    public String compileAndRunCode(Path path) throws IOException, InterruptedException {
        // Compile the Java file
        Process compileProcess = Runtime.getRuntime().exec("javac " + path.toString());
        compileProcess.waitFor();

        if (compileProcess.exitValue() != 0) {
            // Read compilation errors
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(compileProcess.getErrorStream()));
            String errorOutput = errorReader.lines().reduce("", (acc, line) -> acc + line + "\n");
            return "Compilation Error:\n" + errorOutput;
        }

        // Run the compiled file
        Process runProcess = Runtime.getRuntime().exec("java " + path.getFileName().toString().replace(".java", ""));
        BufferedReader outputReader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()));
        String output = outputReader.lines().reduce("", (acc, line) -> acc + line + "\n");

        return output;
    }
}
