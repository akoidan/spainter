# cd <root>
# docker build  -f ./docker/Dockerfile -t deathangel908/spainter .
# docker push deathangel908/spainter
FROM node:14 as builder

WORKDIR /usr/src/frontend
COPY ./package.json ./yarn.lock ./
RUN yarn install
COPY ./  ./
RUN yarn build


FROM nginx:1.21.6-alpine

COPY --from=builder /usr/src/frontend/index.css /usr/src/frontend/index.html /usr/src/frontend/font  /usr/src/frontend/index.js /srv/http/
COPY ./docker/nginx.conf /etc/nginx/conf.d/pychat.conf
RUN rm /etc/nginx/conf.d/default.conf
