import {
	ArgumentsHost,
	Catch,
	HttpStatus,
	UnsupportedMediaTypeException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { unlink } from "fs";

@Catch(UnsupportedMediaTypeException)
export class NotImageExeptionFilter extends BaseExceptionFilter {
	catch(exception: any, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const req = ctx.getRequest();
		const res = ctx.getResponse();

		if (req.file) {
			unlink(req.file.path, (e) => {
				if (e) return e;
			});
		}
		return res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).json({
			message: "Only images files are allowed (jpg / jpeg / png)",
		});
	}
}
