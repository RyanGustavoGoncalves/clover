import { url } from "@/infra/url";
import { toast } from "sonner";

export const updateFileName = async (idFile, fileName, token) => {
    try {
        const response = await fetch(`${url}/projects/files/${idFile}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                
            },
            body: fileName 
        });

        if (!response.ok) {
            // Se a resposta não for bem-sucedida (código de status HTTP diferente de 200)
            const errorData = await response.json(); // Converte a resposta em JSON
            toast.error("Error!", {
                description: `HTTP Status: ${response.status}`,
            });
            throw new Error(errorData.message || 'Failed to update file name');
        }
        toast.success("Sucess!", {
            description: "File updated Successfully!",
        });
        return await response.json(); // Retorna os dados da resposta como JSON
    } catch (error) {
        toast.error("Error!", {
            description: `Error Details: ${error.message}`,
        });
        console.error('Error updating file name:', error);
        throw error; // Lança o erro para ser tratado pelo código que chama essa função
    }
};
