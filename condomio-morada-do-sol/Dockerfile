# Usa a imagem oficial do Node.js como base
FROM node:18-alpine 

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos do projeto para o contêiner
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install 

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta usada pelo React (geralmente 3000)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
