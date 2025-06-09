import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { ModerationRequest } from '../moderation-request/entities/moderation-request';
import { ModerationRequestStatus } from '@/common/constants/moderation-request.constants';
import { ClientManagerService } from '../socket/socket.service';
import { JwtService } from '@/common/jwt/jwt.service';
import { Role } from '@/common/constants/user.constants';

@Injectable()
export class BackgroundService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly clientManagerService: ClientManagerService,
    private readonly jwtService: JwtService
  ) {}

  onModuleInit() {
    this.moderationDispatch();
  }

  private moderationDispatch() {
    setInterval(async () => {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const pendingModerationRequests = await this.dataSource.manager.find(
          ModerationRequest,
          {
            where: {
              status: ModerationRequestStatus.PENDING,
              moderatorId: IsNull(),
            },
          }
        );
        const clientPayloadsWithModerationRole = this.clientManagerService
          .getAll()
          .map((client) => this.jwtService.decode(client.handshake.auth.token))
          .filter((payload) => payload.role === Role.MODERATOR);
        const nextClientPayloadGenerator = (function* () {
          let index = 0;
          while (true) {
            yield clientPayloadsWithModerationRole[index];
            if (index + 1 >= clientPayloadsWithModerationRole.length) {
              index = 0;
            } else {
              ++index;
            }
          }
        })();
        for (const pendingModerationRequest of pendingModerationRequests) {
          const nextClientPayload = nextClientPayloadGenerator.next().value;
          await queryRunner.manager.update(
            ModerationRequest,
            {
              id: pendingModerationRequest.id,
            },
            {
              moderatorId: nextClientPayload.id,
            }
          );
        }
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }, 5000);
  }
}
