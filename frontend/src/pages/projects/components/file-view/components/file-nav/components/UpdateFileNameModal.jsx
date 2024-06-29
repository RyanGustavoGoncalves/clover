import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateFileName } from "./utils/updateFileName.";
import { Loader2 } from "lucide-react";

export function UpdateFileNameModal({ close, idFile, fileState }) {
    const token = localStorage.getItem("token");

    const handleCancel = () => {
        close(false);
    };

    const [file, setFile] = React.useState(fileState.fileName);
    const [loading, setLoading] = React.useState(false);

    const handleUpdateFileName = async () => {
        setLoading(true);
        await updateFileName(idFile, file, token);
        setLoading(false);
        handleCancel();
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Rename File</CardTitle>
                <CardDescription>Write a new name for your file</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">New file name</Label>
                            <Input
                                id="name"
                                placeholder="New file name"
                                value={file}
                                onChange={(e) => setFile(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                {
                    loading ?
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                        :
                        <Button onClick={() => handleUpdateFileName()}>Save</Button>
                }
            </CardFooter>
        </Card>
    );
}
