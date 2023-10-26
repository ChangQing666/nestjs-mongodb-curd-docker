# 安装 Node 精简版
FROM node:16.14.2-alpine

# 设置维护者信息 
LABEL maintainer="cqfee"

# 防止中文打印信息显示乱码
ENV LANG="C.UTF-8"

# 拷贝项目文件进行构建，拷贝到容器内的 app/server 目录下
WORKDIR /app/server
# 将项目中的 package.json 文件拷贝到容器中的 app/server 
COPY ./package.json /app/server
# 拷贝 pnpm 的依赖锁文件
#COPY pnpm-lock.yaml /app/server

# 项目中用到了 pnpm 包管理器
RUN npm install -g pnpm --registry=https://registry.npm.taobao.org
# 然后安装 pm2 用来做服务器的进程守护
RUN pnpm install -g pm2
# 安装项目依赖
RUN pnpm install

# 将当前目录代码复制到容器中
COPY . /app/server

# 打包代码
RUN pnpm run build

# 对外暴露3000端口
EXPOSE 3000

# 运行 pm2 启动打包之后的项目, pm2在容器中运行需要用 pm2-runtime 命令
CMD [ "pm2-runtime", "dist/main.js" ]