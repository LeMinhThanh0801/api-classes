import { isEmptyObject, Logger } from "@core/utils";
import { HttpException } from "@core/exception";
import ClassroomSchema from "./classrooms.model";
import CreateDto from "./dtos/create.dto";
import Classroom from "./classrooms.interface";
import { UserService } from "@modules/users";
import { IUser } from "@modules/users/";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
const { ObjectId } = require("mongoose").Types;
import CryptoJS from "crypto-js";
class ClassroomService {
  public classroomSchema = ClassroomSchema;

  public async create(userId: string, model: CreateDto): Promise<Classroom> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, "Model is empty");
    }

    const userService = new UserService();
    const user = await userService.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    if (user.user_type === 0) {
      throw new HttpException(400, `User is student`);
    }

    const classroom = await this.classroomSchema
      .findOne({ name: model.name })
      .exec();
    if (classroom) {
      throw new HttpException(
        409,
        `Classroom name ${model.name} already exist`
      );
    }

    const createClassroom: Classroom = await this.classroomSchema.create({
      ...model,
      auth_id: userId,
      participants_id: [userId],
      createTime: Date.now(),
    });

    return createClassroom;
  }

  public async getDetail(classroomId: string): Promise<Classroom> {
    const classroom = await this.classroomSchema.findById(classroomId).exec();
    if (!classroom) {
      throw new HttpException(409, `Classroom is not exist`);
    }

    return classroom;
  }

  public async listUserInClassroom(classroomId: string): Promise<Array<IUser>> {
    const listUser = <any>(
      await this.classroomSchema
        .findOne({ _id: classroomId })
        .populate("participants_id")
        .select({ user: 1 })
    );
    if (!listUser) {
      throw new HttpException(409, `Classroom is not exist`);
    }

    return listUser;
  }

  public async listClassroom(): Promise<Array<Classroom>> {
    const listClassroom = <any>(
      await this.classroomSchema.find()
    );

    if (!listClassroom) {
      throw new HttpException(409, `Classroom is not exist`);
    }

    return listClassroom;
  }

  public async joinInClassroom(
    encryptClassroomId: string,
    encryptUserId: string
  ): Promise<Classroom> {
    //Decode userId and classroomId
    const bytesUserId = CryptoJS.AES.decrypt(encryptUserId, process.env.SECRET_KEY!);
    const userId = bytesUserId.toString(CryptoJS.enc.Utf8);

    const bytesClassroomId = CryptoJS.AES.decrypt(encryptClassroomId, process.env.SECRET_KEY!);
    const classroomId = bytesClassroomId.toString(CryptoJS.enc.Utf8);

    const classroom = await this.classroomSchema.findById(classroomId);
    if (!classroom) {
      throw new HttpException(409, `Classroom is not exist`);
    }

    let participants_id = classroom.participants_id;
    const IsExistInClassroom = participants_id.includes(userId);

    if (IsExistInClassroom === true) {
      throw new HttpException(409, `User already exist in classroom`);
    }

    let updateClassroomById;
    participants_id.push(userId);
    updateClassroomById = await this.classroomSchema.findByIdAndUpdate(
      classroomId,
      {
        participants_id: participants_id,
      }
    );

    if (!updateClassroomById) {
      throw new HttpException(409, "Error when update classroom");
    }

    const classroom_updated = await this.classroomSchema.findById(classroomId);
    if (!classroom_updated) {
      throw new HttpException(404, `Classroom is not exists`);
    }

    return classroom_updated;
  }

  public async createClassroomInvitationLink(
    classroomId: string,
    userId: string
  ): Promise<string> {
    const classroom = await this.classroomSchema.findById(classroomId);
    if (!classroom) {
      throw new HttpException(409, `Classroom is not exist`);
    }

    let participants_id = classroom.participants_id;
    const IsExistInClassroom = participants_id.includes(userId);

    if (IsExistInClassroom === true) {
      throw new HttpException(409, `User already exist in classroom`);
    }

    const encryptUserId: string = CryptoJS.AES.encrypt(userId, process.env.SECRET_KEY!).toString();
    const encryptclassroomId: string = CryptoJS.AES.encrypt(classroomId, process.env.SECRET_KEY!).toString();

    return `${process.env.ENDPOINT}/api/classrooms/join_in_classroom?userId=${encodeURIComponent(encryptUserId)}&classId=${encodeURIComponent(encryptclassroomId)}`;
  }

  public async sendClassroomInvitationLink(
    userId: string,
    mail: string,
    link: string
  ): Promise<string> {
    const transporter = nodemailer.createTransport({
      // config mail server
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL, //T??i kho???n gmail v???a t???o
        pass: process.env.PASSWORD_GMAIL, //M???t kh???u t??i kho???n gmail v???a t???o
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    const mainOptions = {
      // thi???t l???p ?????i t?????ng, n???i dung g???i mail
      from: "system classroom",
      to: mail,
      subject: "DatDuyThanh",
      text: link, //Th?????ng thi m??nh kh??ng d??ng c??i n??y thay v??o ???? m??nh s??? d???ng html ????? d??? edit h??n
      // html: content //N???i dung html m??nh ???? t???o tr??n kia :))
    };

    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        Logger.info(err);
        throw new HttpException(409, `Error when send mail: ${err}`);
      } else {
        Logger.info("Message sent: " + info.response);
      }
    });

    return `Send mail success`
  }
}

export default ClassroomService;
