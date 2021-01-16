FROM cypress/included:4.0.2

WORKDIR /code

ENV APP_VERSION=app-v1

COPY ./cypress ./cypress
COPY ./cypress.json ./package.json ./tsconfig.json ./.eslintrc.json ./.nycrc.json ./.stylelintrc ./
COPY ./src ./src
COPY build ./webpack

RUN yarn install

ENTRYPOINT ["/bin/bash"]
