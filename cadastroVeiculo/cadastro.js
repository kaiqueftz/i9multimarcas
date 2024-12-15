// Função para pré-visualizar as imagens selecionadas
const inputFile = document.getElementById("imagens");
const imagePreview = document.getElementById("imagePreview");

inputFile.addEventListener("change", function(event) {
    const files = event.target.files;
    imagePreview.innerHTML = ""; // Limpa a visualização atual

    // Exibe as imagens selecionadas
    Array.from(files).forEach((file, index) => {
        if (index < 3) {  // Limite de 3 imagens
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgElement = document.createElement("img");
                imgElement.src = e.target.result;
                
                const previewItem = document.createElement("div");
                previewItem.classList.add("preview-item");

                const removeBtn = document.createElement("button");
                removeBtn.classList.add("remove-btn");
                removeBtn.innerHTML = "X";
                removeBtn.addEventListener("click", function() {
                    previewItem.remove();  // Remove a imagem ao clicar no "X"
                });

                previewItem.appendChild(imgElement);
                previewItem.appendChild(removeBtn);
                imagePreview.appendChild(previewItem);
            };

            reader.readAsDataURL(file);  // Lê a imagem como URL
        }
    });
});