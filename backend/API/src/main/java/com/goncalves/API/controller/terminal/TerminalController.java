package com.goncalves.API.controller.terminal;

import com.goncalves.API.infra.exception.Successfully;
import com.goncalves.API.service.CompilerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/terminal")
public class TerminalController {

    @Autowired
    private CompilerService compilerService;

    @PostMapping("/compile")
    public ResponseEntity compileCode(@RequestBody CodeRequest codeRequest) {
        String code = codeRequest.code();
        String filename = codeRequest.fileName();
        Path path = Paths.get(filename);

        try {
            // Write the Java code to the temporary file
            Files.write(path, code.getBytes());

            // Compile and run the Java file
            String result = compilerService.compileJavaAndRunCode(path);

            // Check if the result contains a compilation error
            if (result.startsWith("Compilation Error:")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
            }

            return ResponseEntity.ok(new Successfully("Success in compiling your file", result));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("IO Error: " + e.getMessage());
        } catch (InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Interrupted Error: " + e.getMessage());
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                Files.deleteIfExists(path);
                Files.deleteIfExists(Paths.get("TempCode.class"));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
