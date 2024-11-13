export const convertContentByFile = (content, singleRequest) => {
    // Obter os dados do conteúdo do arquivo
    const fileContentData = content;

    // Converter os dados para um objeto Blob
    const blob = new Blob([fileContentData], { type: 'application/octet-stream' });

    // Criar um novo objeto File a partir do Blob
    const file = new File([blob], singleRequest.fileName, { type: 'application/octet-stream' });

    // Retornar o objeto File
    return file;
}