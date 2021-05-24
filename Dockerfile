FROM rust as builder
WORKDIR /usr/src

#RUN rustup target add x86_64-unknown-linux-musl

RUN cargo new rewind
WORKDIR /usr/src/rewind
COPY Cargo.toml Cargo.lock ./
RUN cargo build --release

COPY src ./src
#RUN cargo install --target x86_64-unknown-linux-musl --path .
RUN cargo install --path .

FROM rust
COPY --from=builder /usr/local/cargo/bin/rewind .
COPY src ./src
COPY config.toml .
CMD ["./rewind"]
