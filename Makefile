# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: arudy <arudy@student.42.fr>                +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/03/05 21:51:04 by aasli             #+#    #+#              #
#    Updated: 2023/03/28 16:04:34 by arudy            ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:
	docker compose up --build

up:
	docker compose up

down:
	docker compose down

re: fclean all

fclean:
	docker image rm -f api_img client_img postgres
	docker container rm -f api client postgres
	docker volume rm -f ft_transcendence_database
	docker network rm -f ft_transcendence_backend-network ft_transcendence_frontend-network

ls:
	docker image ls -a
	@echo "------------------\n"
	docker container ls
	@echo "------------------\n"
	docker volume ls -q
	@echo "------------------\n"
	docker network ls

.PHONY: all re build up stop clean fclean prune ls

