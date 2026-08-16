import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { OptionalSessionGuard } from "../auth/session.guard";
import { ContentService } from "./content.service";

@Controller()
@UseGuards(OptionalSessionGuard)
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get("courses")
  listCourses() {
    return this.content.listCourses();
  }

  @Get("courses/:slug")
  getCourse(@Req() req: Request, @Param("slug") slug: string) {
    return this.content.getCourse(slug, req.userId);
  }

  @Get("lessons/:id")
  getLesson(@Req() req: Request, @Param("id") id: string) {
    return this.content.getLesson(id, req.userId);
  }
}
