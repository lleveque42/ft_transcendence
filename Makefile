# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: aasli <aasli@student.42.fr>                +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/03/05 21:51:04 by aasli             #+#    #+#              #
#    Updated: 2023/03/05 22:03:56 by aasli            ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all: build

# --remove-orphans is set to put away a warning of similar containers name in different projects
# Source: https://stackoverflow.com/questions/50947938/docker-compose-orphan-containers-warning
build:
	docker compose up -d --build --remove-orphans

up:
	docker compose up -d --remove-orphans

down:
	docker compose down

clean: down
	docker system prune -a

fclean: clean
	docker compose down --volumes

.PHONY:	all up down clean fclean
