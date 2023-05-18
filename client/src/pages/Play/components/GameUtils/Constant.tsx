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
export const OUT_OF_BOUND: number = PADDLE_X + PADDLE_WIDTH * 5;
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
export const BALL_REBOUND_Y_MULTIPLIER: number = 1.75;
export const BALL_X_SPEED_MULTIPLIER: number = 1.01;
export const BALL_1ST_REBOUND_X_SPEED_MULTIPLIER: number = 2;

// COLOR DEFAULT //

export const NET_DEFAULT_COLOR = "#dfe6e9";
export const BACKGROUND_DEFAULT_COLOR = "#2d3436";
export const WALL_DEFAULT_COLOR = "#2d3436";
export const PADDLE_DEFAULT_COLOR = "#74b9ff";
export const BALL_DEFAULT_COLOR = "#74b9ff";

// COLOR CITY //

export const BACKGROUND_CITY_COLOR = "#2E7D32";
export const WALL_CITY_COLOR = "#2F4858";
export const PADDLE_CITY_COLOR = "#2F4858";
export const BALL_CITY_COLOR = "#2F4858"

// COLOR CITY //

export const NET_SPACE_COLOR = "#4B4453";
// export const BACKGROUND_SPACE_COLOR = "#4B4453";
export const BACKGROUND_SPACE_COLOR = "#000000";
export const WALL_SPACE_COLOR = "#4B4453";
export const PADDLE_SPACE_COLOR = "#845EC2";
export const BALL_SPACE_COLOR = "#F9F871";
