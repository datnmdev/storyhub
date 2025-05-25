import { Module } from "@nestjs/common";
import { BackgroundService } from "./background.service";
import { SocketModule } from "../socket/socket.module";

@Module({
  imports: [
    SocketModule
  ],
  providers: [
    BackgroundService
  ]
})
export class BackgroundModule {}