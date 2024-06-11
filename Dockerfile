FROM node as frontend
WORKDIR /app
COPY frontend .
RUN npm install
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk AS backend
WORKDIR /app
COPY backend .
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend /app/out .
COPY --from=frontend /app/build ./ClientApp
EXPOSE 5000
ENTRYPOINT ["dotnet", "Api.dll"]
