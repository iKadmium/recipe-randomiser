FROM node as frontend
WORKDIR /app
COPY frontend .
RUN npm install
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend
ENV DOTNET_NUGET_SIGNATURE_VERIFICATION=false
WORKDIR /app
COPY backend .
RUN dotnet restore
RUN dotnet publish -c Release

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend /app/Api/bin/Release/net8.0/publish .
COPY --from=frontend /app/build ./ClientApp
EXPOSE 5000
ENTRYPOINT ["dotnet", "Api.dll"]
