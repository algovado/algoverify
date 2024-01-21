FROM node:18 as BUILD

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ARG DISCORD_CALLBACK_URL
ENV REACT_APP_DISCORD_CALLBACK_URL=$DISCORD_CALLBACK_URL

ARG DISCORD_BOT_CLIENT_ID
ENV REACT_APP_DISCORD_BOT_CLIENT_ID=$DISCORD_BOT_CLIENT_ID

RUN npm run build

FROM caddy:2.7.6

COPY --from=BUILD /usr/src/app/build /usr/share/caddy
COPY swagger.json /usr/share/caddy
COPY password_create.sh /password_create.sh
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443
CMD ["/bin/sh", "-c", ". /password_create.sh && echo $HASHED_PASSWORD && caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]
