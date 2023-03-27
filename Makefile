# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: arudy <arudy@student.42.fr>                +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/03/05 21:51:04 by aasli             #+#    #+#              #
#    Updated: 2023/03/27 12:43:23 by arudy            ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:
	docker compose up --build

up:
	docker compose up

down:
	docker compose down

re: fclean all

fclean: clean prune

clean: down
	docker system prune -a --force

prune:
	docker volume prune --force
	docker network prune --force

ls:
	docker image ls -a
	@echo "------------------\n"
	docker container ls
	@echo "------------------\n"
	docker volume ls -q
	@echo "------------------\n"
	docker network ls

.PHONY: all re build up stop clean fclean prune ls

