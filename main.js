document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const resultDiv = document.getElementById('result');

    // Acessa a câmera usando a API WebRTC
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error('Erro ao acessar a câmera:', error);
        });

    // Quando o vídeo está carregado, inicia a captura de quadros
    video.addEventListener('loadeddata', () => {
        setInterval(() => {
            captureFrame();
        }, 1000); // Captura um quadro a cada segundo (ajuste conforme necessário)
    });

    function captureFrame() {
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Obtém a imagem do canvas e a passa para o Tesseract.js para reconhecimento de texto
        Tesseract.recognize(
            canvas.toDataURL('image/png'),
            'eng',
            { logger: info => console.log(info) } // Use isso para depurar resultados
        ).then(({ data: { text } }) => {
            // Exibe o resultado na página
            resultDiv.innerHTML = `<strong>Números encontrados:</strong> ${text}`;
        }).catch((error) => {
            console.error('Erro no reconhecimento de texto:', error);
        });
    }
});