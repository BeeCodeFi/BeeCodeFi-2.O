import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ProgressModule } from "../progress/progress.module";
import { EditorController } from "./editor.controller";
import { EditorService } from "./editor.service";

@Module({
  imports: [AuthModule, ProgressModule],
  controllers: [EditorController],
  providers: [EditorService],
})
export class EditorModule {}
