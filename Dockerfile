# syntax = docker/dockerfile:1

ARG RUBY_VERSION=3.3.0
FROM ruby:$RUBY_VERSION-slim as base

ARG RAILS_MASTER_KEY
ENV RAILS_MASTER_KEY=$RAILS_MASTER_KEY

WORKDIR /rails

ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    curl gnupg build-essential git libpq-dev libvips pkg-config && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install --no-install-recommends -y nodejs

COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git

COPY . .

RUN echo "REACT_APP_ENDPOINT_URL=https://pennylane-assessment.onrender.com/api/v1/search" > pennylane-front/.env.production

RUN npm install --prefix pennylane-front && npm run build --prefix pennylane-front
RUN rm -rf public && mkdir -p public && cp -a pennylane-front/build/. public/

RUN bundle exec bootsnap precompile app/ lib/
RUN ./bin/rails assets:precompile

FROM base as final

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libvips postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp
USER rails:rails

ENTRYPOINT ["/rails/bin/docker-entrypoint"]
EXPOSE 3002
CMD ["./bin/rails", "server"]
