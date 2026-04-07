import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import ngrok from "@ngrok/ngrok";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { EMAIL_QUEUE, NOTIFICATIONS_QUEUE } from "./consts";

async function bootstrap() {
  const rabbitUrl = process.env.RABBITMQ_URL;

  if (!rabbitUrl) {
    throw new Error("RABBITMQ_URL não está definida");
  }

  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI });

  const config = new DocumentBuilder()
    .setTitle("Smart Agenda API")
    .setDescription("API description")
    .setVersion("1.0")
    .build();
  SwaggerModule.setup("docs", app, () =>
    SwaggerModule.createDocument(app, config),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: EMAIL_QUEUE,
      queueOptions: { durable: true },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: NOTIFICATIONS_QUEUE,
      queueOptions: { durable: true },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser(process.env.SECRET_KEY_COOKIES));
  app.enableCors({
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });

  ngrok
    .connect({ addr: 3000, authtoken: process.env.NGROK_AUTHTOKEN })
    .then((listener) =>
      console.log(`Ingress established at: ${listener.url()}`),
    );

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
