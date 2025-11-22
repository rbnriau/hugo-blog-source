#!/bin/bash
hugo
rsync -avz --delete ./public/ bytepath:/var/www/blog_hugo

