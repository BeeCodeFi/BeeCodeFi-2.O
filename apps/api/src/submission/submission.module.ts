import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ProgressModule } from "../progress/progress.module";
import { SubmissionController } from "./submission.controller";
import { SubmissionService } from "./submission.service";

@Module({
  imports: [AuthModule, ProgressModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
