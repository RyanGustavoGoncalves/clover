import * as React from "react";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "@/pages/components/Icon";
import logo from "@/pages/components/assets/PTCC.png";
import { useEffect } from "react";
import { FetchUser } from "@/pages/home/components/utils/getInfoUser/FetchUser";
import { fetchRequestById } from "@/pages/home/components/utils/fetchRequestById/fetchRequestById";
import { useState } from "react";
import { useRef } from "react";
import { commitAndUpdateFile } from "@/pages/projects/components/utils/commitAndUpdateFile/commitAndUpdateFile";
import { convertContentByFile } from "@/pages/projects/components/file-editor/components/utils/convertContentByFile/convertContentByFile";

const HomeNavbar = ({ idProject }) => {
    const token = localStorage.getItem("token");
    const [userData, setUserData] = useState({});
    const [singleRequest, setSingleRequest] = useState({});
    const ws = useRef(null);
    const [newCommitAndFile, setNewCommitAndFile] = useState({ newCommit: '', newFile: null });
    const location = useLocation();
    const pathname = location.pathname;

    const handleCommit = async (idProject, idFile) => {
        await commitAndUpdateFile(token, idProject, idFile, newCommitAndFile);
    };

    const extractPathFileName = (path) => {
        const pathArray = path.split("/");
        const fileName = pathArray[pathArray.length - 1];
        const obj = {
            fileName: fileName,
        }
        return obj;
    };

    useEffect(() => {
        FetchUser(token, setUserData);
        fetchRequestById(token, idProject, setSingleRequest);
    }, [token]);

    useEffect(() => { }, [userData.profileImage]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8090');

        ws.current.onopen = () => {
            console.log('Conectado ao servidor WebSocket');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'success') {
                console.log(message.message);
            } else if (message.type === 'error') {
                console.error(message.message);
            } else if (message.type === 'fileSaved') {
                // Atualizar o conteúdo do arquivo no frontend
                newCommitAndFile.newFile = convertContentByFile(message.payload.fileContent, extractPathFileName(message.payload.filePath));
                newCommitAndFile.newCommit = message.payload.commitMessage;
                handleCommit(message.payload.projectId, message.payload.fileId);
                console.log(`Arquivo ${message.payload.filePath} atualizado no frontend.`);
            }
        };

        ws.current.onclose = () => {
            console.log('Conexão WebSocket fechada');
        };

        ws.current.onerror = (error) => {
            console.error('Erro no WebSocket:', error);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    return (
        <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
                <Icon src={logo} alt="logo" />
                <span className="hidden font-bold sm:inline-block text-secondary-foreground">
                    Clover
                </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">

                {idProject !== null && idProject !== undefined && idProject !== "editor" ? (
                    <Link
                        to={`/project/${idProject}`}
                        className={cn(
                            "transition-colors hover:text-foreground/80",
                            pathname === `/project/${idProject}` || `/project/folder/${idProject}` ? "text-foreground" : "text-foreground/60"
                        )}
                    >
                        {singleRequest.projectName}
                    </Link>
                ) : (
                    <Link
                        to={"/"}
                        className={cn(
                            "transition-colors hover:text-foreground/80",
                            pathname === "/" ? "text-foreground" : "text-foreground/60"
                        )}
                    >
                        Overview
                    </Link>
                )}

                {idProject !== null && idProject !== undefined && idProject !== "editor" && (

                    <Link
                        to={`/issues/${idProject}`}
                        className={cn(
                            "transition-colors hover:text-foreground/80",
                            pathname === `/issues/${idProject}` ? "text-foreground" : "text-foreground/60"
                        )}
                    >
                        Issues
                    </Link>

                )}
                {idProject !== null && idProject !== undefined && idProject !== "editor" && (

                    <Link
                        to={`/annotation/${idProject}`}
                        className={cn(
                            "transition-colors hover:text-foreground/80",
                            pathname === `/annotation/${idProject}` ? "text-foreground" : "text-foreground/60"
                        )}
                    >
                        Annotation
                    </Link>

                )}

                <Link
                    to={`/roadmap`}
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === "/roadmap" ? "text-foreground" : "text-foreground/60"
                    )}
                >
                    Roadmaps
                </Link>
            </nav>
        </div>
    );
}

export default HomeNavbar;