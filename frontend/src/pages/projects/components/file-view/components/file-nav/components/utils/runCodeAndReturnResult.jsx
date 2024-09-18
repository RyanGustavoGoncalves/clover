import { url } from "@/infra/url"

export const runCodeAndReturnResult = async ( token, fileContent, setOutput, singleRequest ) => {
    try {
        const response = await fetch(`${url}/terminal/compile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code: fileContent.data, fileName: singleRequest.fileName}),
        });
        if (response.ok) {
            const data = await response.json();
            setOutput(data.get);
        } else {
            console.log("Error");
        }
    } catch (err) {
        console.log(err);
    }
}