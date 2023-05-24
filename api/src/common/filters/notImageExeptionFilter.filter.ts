import {
	ArgumentsHost,
	Catch,
	HttpStatus,
	UnsupportedMediaTypeException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch(UnsupportedMediaTypeException)
export class NotImageExeptionFilter extends BaseExceptionFilter {
	catch(exception: any, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse();
		return res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).json({
			message: "Only images files are allowed (jpg / jpeg / png)",
		});
	}
}
