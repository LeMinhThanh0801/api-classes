import { IUser } from '@modules/users';
import { NextFunction, Request, Response } from 'express';
import BodyRespone from '@core/response_default';
import CreateDto from './dtos/create.dto';
import ClassroomService from './classrooms.service';
import Classroom from './classrooms.interface';

export default class ClassroomsController {
  private classroomService = new ClassroomService();

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const model: CreateDto = req.body;
      const classroom: Classroom = await this.classroomService.create(
        userId,
        model
      );

      const resp = new BodyRespone('Success', classroom);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const classId = req.query.id;
      const classroom: Classroom = await this.classroomService.getDetail(
        classId as string
      );

      const resp = new BodyRespone('Success', classroom);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public listUserInClassroom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const classId = req.query.id;
      const classroom: Array<IUser> =
        await this.classroomService.listUserInClassroom(classId as string);
      const resp = new BodyRespone('Success', classroom);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public listClassroom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listClassroom: Array<Classroom> =
        await this.classroomService.listClassroom();

      const resp = new BodyRespone('Success', listClassroom);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public joinInClassroom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.query.userId;
      const classId = req.query.classId;
      const classroom: Classroom = await this.classroomService.joinInClassroom(
        classId as string,
        userId as string,
      );

      const resp = new BodyRespone('Success', classroom);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public createClassroomInvitationLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const classId = req.body.classId;
      const invitationLink: string =
        await this.classroomService.createClassroomInvitationLink(
          classId,
          userId
        );

      const resp = new BodyRespone('Success', {
        invitationLink: invitationLink,
      });
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public sendClassroomInvitationLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const mail = req.body.mail;
      const link = req.body.link;
      const notification: string =
        await this.classroomService.sendClassroomInvitationLink(
          userId,
          mail,
          link
        );

      const resp = new BodyRespone('Success', {});
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
