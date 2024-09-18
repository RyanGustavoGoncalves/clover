export class WebSocketConfig{
    constructor(url) {
        // Cria uma instância WebSocket com a URL fornecida
        this.websocket = new WebSocket(url);

        // Configura um manipulador de eventos para lidar com mensagens recebidas do servidor
        this.websocket.onmessage = this.handleMessage.bind(this);
        
        // Configura um manipulador de eventos para lidar com a abertura da conexão WebSocket
        this.websocket.onopen = () => {
            console.log("Conexão WebSocket estabelecida.");
            // Você pode adicionar qualquer lógica adicional aqui, se necessário
        };

        // Configura um manipulador de eventos para lidar com o fechamento da conexão WebSocket
        this.websocket.onclose = () => {
            console.log("Conexão WebSocket fechada.");
            // Você pode adicionar qualquer lógica adicional aqui, se necessário
        };

        // Configura um manipulador de eventos para lidar com erros na conexão WebSocket
        this.websocket.onerror = (error) => {
            console.error("Erro na conexão WebSocket:", error);
            // Você pode adicionar qualquer lógica adicional aqui, se necessário
        };
    }

    // Método para enviar uma mensagem para o servidor
    sendMessage(message) {
        if (this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(message);
        } else {
            console.error("A conexão WebSocket não está aberta.");
        }
    }

    // Método para lidar com mensagens recebidas do servidor
    handleMessage(event) {
        console.log("Mensagem recebida do servidor:", event.data);
        // Faça o que você precisar com a mensagem recebida do servidor
    }
}