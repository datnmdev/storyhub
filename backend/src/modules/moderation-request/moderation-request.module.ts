import { Module } from "@nestjs/common";
import { ModerationRequestController } from "./moderation-request.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModerationRequest } from "./entities/moderation-request";
import { ModerationRequestService } from "./moderation-request.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModerationRequest
    ])
  ],
  controllers: [
    ModerationRequestController
  ],
  providers: [
    ModerationRequestService
  ],
})
export class ModerationRequestModule {}