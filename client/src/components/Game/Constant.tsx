// PADDLES //

export const PADDLE_X: number = 1.25;
export const PADDLE_HEIGHT: number = 0.4;
export const PADDLE_WIDTH: number = 0.075;
export const PADDLE_HALF_SIZE: number = PADDLE_HEIGHT / 2;
export const RIGHT_PADDLE: number = PADDLE_X;
export const LEFT_PADDLE: number = -PADDLE_X;
export const PADDLE_SPEED: number = 2.5;

// MAP //

export const CEILING: number = 1;
export const FLOOR: number = -1;
export const OUT_OF_RANGE: number = PADDLE_X + 0.4;
export const WALL_WIDTH: number = PADDLE_WIDTH;
export const MAP_LENGTH: number =
	PADDLE_X * 2 + PADDLE_WIDTH * 2 + WALL_WIDTH * 2;
export const MAP_WIDTH: number = CEILING - FLOOR + WALL_WIDTH * 2;
export const MAP_DEPTH: number = PADDLE_WIDTH;

// BALL //

export const BALL_RADIUS: number = PADDLE_WIDTH / 2;
export const BALL_DIAMETER: number = BALL_RADIUS * 2;
export const BALL_MAX_X_SPEED: number = 3;
export const BALL_X_SPEED: number = 1.25;
// export const BALL_X_SPEED: number = 0.25;
// export const BALL_X_SPEED: number = 0;
export const BALL_REBOUND_Y_MULTIPLIER: number = 2;
export const BALL_SPAWN_X_SPEED_MULTIPLIER: number = 1;
export const BALL_1ST_REBOUND_X_SPEED_MULTIPLIER: number = 2;
