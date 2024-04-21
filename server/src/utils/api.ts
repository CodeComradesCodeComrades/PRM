import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PROJECT_NAME, serverVersion } from "src/constants";

export const swagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle(PROJECT_NAME)
    .setDescription(`${PROJECT_NAME}'s Api`)
    .setVersion(serverVersion.toString())
    .addServer('/api')
    .build();
    
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document);
}