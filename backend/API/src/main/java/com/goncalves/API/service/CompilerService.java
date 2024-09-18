package com.goncalves.API.service;

import com.goncalves.API.infra.configurations.CompilerWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.file.Path;
import java.util.concurrent.ExecutionException;

@Service
public class CompilerService {

    @Autowired
    private CompilerWebSocketHandler webSocketHandler;

    public String compileJavaAndRunCode(Path path) throws IOException, InterruptedException, ExecutionException {
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
        ProcessBuilder processBuilder = new ProcessBuilder("java", path.getFileName().toString().replace(".java", ""));
        processBuilder.redirectErrorStream(true);
        Process runProcess = processBuilder.start();

        BufferedReader outputReader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()));
        OutputStreamWriter inputWriter = new OutputStreamWriter(runProcess.getOutputStream());

        StringBuilder output = new StringBuilder();
        String line;
        while ((line = outputReader.readLine()) != null) {
            output.append(line).append("\n");

            if (line.trim().endsWith(":")) { // Assuming prompts end with ":"
                // Send WebSocket message to frontend
                String finalLine = line;
                webSocketHandler.getSessions().forEach(session -> {
                    try {
                        session.sendMessage(new TextMessage("Input required: " + finalLine));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });

                // Wait for user input from WebSocket
                String userInput = webSocketHandler.getUserInput();
                inputWriter.write(userInput + "\n");
                inputWriter.flush();
            }
        }

        return output.toString();
    }
}
