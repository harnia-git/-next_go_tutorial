# Docker Compose Configuration for Front-End Setup
Dockerfile
```
FROM node:20.11.1

WORKDIR /app
```
compose.yaml
```
services:
  next-front:
    build:
      context: .
    tty: true
    volumes:
      - ./next-front:/app
    environment:
      - WATCHPACK_POLLING=true
    command: sh -c "npm run dev"
    ports:
      - "3000:3000"
  # go-server:
  #   build:
  #     context: ./go-server
  #     dockerfile: Dockerfile
  #   ports:
  #     - "8080:8080"
  #   tty: true
  #   volumes:
  #     - ./go-server:/app

```
# docker compose command
```
docker compose run --rm next-front sh -c 'npx create-next-app . --no-src-dir --typescript'
```
* サービス app が起動してコンテナが作られ、実行が終わり次第コンテナは削除される。→ —rm
* コンテナ内でシェルを実行 → sh
* ファイル名の代わりに実行するコマンドの文字列であることを伝える → -c
* カレントディレクトリに作成 → .
* src ディレクトリを作成しない → —no-src-dir
* typescript を入れる → —typescript

Next.jsアプリケーションfront-end開発環境の初期化のためのコンテナ

# パーミッションの設定
next-frontは作成時rootなので、userにする
```
sudo chown -R $USER:$USER next-front
```
# Frontendの動作を確認する
cd next-front
npm run dev

# go-server構築

```
mkdir go-server
cd go-server
go mod init go-server
touch main.go
```
main.go
```
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World!")
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
```
```
go run main.go
curl localhost:8080
```
# /go-server/Dockerfile を作る
ホットリロードの設定のため？

```
FROM golang:1.22.1-bookworm
WORKDIR /app
RUN go install github.com/cosmtrek/air@latest
CMD ["air"]
```

# compose.yaml に以下追記
```
  go-server:
    build:
      context: ./go-server
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    tty: true
    volumes:
      - ./go-server:/app
```
# /go-server/.air.toml の追加
```
# Config file for [Air](https://github.com/cosmtrek/air) in TOML format

# Working directory

# . or absolute path, please note that the directories following must be under root.

root = "."
tmp_dir = "tmp"

[build]

# Array of commands to run before each build

pre_cmd = ["echo 'hello air' > pre_cmd.txt"]

# Just plain old shell command. You could use `make` as well.

cmd = "go build -o ./tmp/main ."

# Array of commands to run after ^C

post_cmd = ["echo 'hello air' > post_cmd.txt"]

# Binary file yields from `cmd`.

bin = "tmp/main"

# Customize binary, can setup environment variables when run your app.

full_bin = "APP_ENV=dev APP_USER=air ./tmp/main"

# Watch these filename extensions.

include_ext = ["go", "tpl", "tmpl", "html"]

# Ignore these filename extensions or directories.

exclude_dir = ["assets", "tmp", "vendor", "frontend/node_modules"]

# Watch these directories if you specified.

include_dir = []

# Watch these files.

include_file = []

# Exclude files.

exclude_file = []

# Exclude specific regular expressions.

exclude_regex = ["_test\\.go"]

# Exclude unchanged files.

exclude_unchanged = true

# Follow symlink for directories

follow_symlink = true

# This log file places in your tmp_dir.

log = "air.log"

# Poll files for changes instead of using fsnotify.

poll = false

# Poll interval (defaults to the minimum interval of 500ms).

poll_interval = 500 # ms

# It's not necessary to trigger build each time file changes if it's too frequent.

delay = 0 # ms

# Stop running old binary when build errors occur.

stop_on_error = true

# Send Interrupt signal before killing process (windows does not support this feature)

send_interrupt = false

# Delay after sending Interrupt signal

kill_delay = 500 # nanosecond

# Rerun binary or not

rerun = false

# Delay after each executions

rerun_delay = 500

# Add additional arguments when running binary (bin/full_bin). Will run './tmp/main hello world'.

args_bin = ["hello", "world"]

[log]

# Show log time

time = false

# Only show main log (silences watcher, build, runner)

main_only = false

[color]

# Customize each part's color. If no color found, use the raw app log.

main = "magenta"
watcher = "cyan"
build = "yellow"
runner = "green"

[misc]

# Delete tmp directory on exit

clean_on_exit = true

[screen]
clear_on_rebuild = true
keep_scroll = true
```
# compose.yaml がある場所で以下のコマンド実行
```
docker-compose up -d go-server
```
http://localhost:8080 確認する
ホットリロードの確認もしてみる

# コンテナの確認
```
@DESKTOP-RDM131Q:~/Test/handson2/next-front$ docker ps
CONTAINER ID   IMAGE                COMMAND   CREATED          STATUS          PORTS                    NAMES
e4dc3c8976a1   handson2-go-server   "air"     13 minutes ago   Up 13 minutes   0.0.0.0:8080->8080/tcp   handson2-go-server-1
```
# コンテナを一度止めて再度起動するには
volumeは削除しないで、コンテナを削除してみる.(サービス停止・コンテナ削除)
```
docker compose down 
```
サービス再起動

ホットリロードなので、main.goの書き換えを行ったので、再度ビルドしてupする
```
docker compose build next-front
docker compose build go-server
docker compose up
```
#　フロントエンドとバックエンドの相互作用を確認する
* main.go
* next-front/app/composents/DataFetcher.client.tsx作成
* next-front/app/page.tsx編集
* next.config.mjs  ようわからん
* [notion](https://www.notion.so/Git-7f17a92441f949e8bd1cb3eac6381ebf?pvs=4)